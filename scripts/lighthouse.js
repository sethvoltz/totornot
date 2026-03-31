#!/usr/bin/env node
// @ts-check
/**
 * Lighthouse testing script for local development
 * Builds the app, starts preview server, runs Lighthouse, generates reports
 *
 * Usage:
 *   node scripts/lighthouse.js [options]
 *
 * Options:
 *   -v, --verbose    Enable verbose output for debugging
 *   -p, --port       Custom port (default: 8765)
 *   -r, --runs       Number of audit runs (default: 3)
 *
 * Environment variables:
 *   LIGHTHOUSE_PORT  Custom port
 *   LIGHTHOUSE_RUNS  Number of audit runs
 */

import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const REPORTS_DIR = path.join(ROOT_DIR, '.lighthouse');

// Parse command line arguments
const args = process.argv.slice(2);
const isVerbose = args.includes('-v') || args.includes('--verbose');

// Parse custom port from args
let customPort = null;
const portIndex = args.findIndex((arg) => arg === '-p' || arg === '--port');
if (portIndex !== -1 && args[portIndex + 1]) {
	customPort = parseInt(args[portIndex + 1], 10);
}

// Parse custom runs from args
let customRuns = null;
const runsIndex = args.findIndex((arg) => arg === '-r' || arg === '--runs');
if (runsIndex !== -1 && args[runsIndex + 1]) {
	customRuns = parseInt(args[runsIndex + 1], 10);
}

const LIGHTHOUSE_PORT = customPort || parseInt(process.env.LIGHTHOUSE_PORT || '8765', 10);
const LIGHTHOUSE_RUNS = customRuns || parseInt(process.env.LIGHTHOUSE_RUNS || '3', 10);
const SERVER_URL = `http://localhost:${LIGHTHOUSE_PORT}`;
const STARTUP_TIMEOUT = 30000;

// Track resources for cleanup
let previewProcess = null;
let chrome = null;
let isCleaningUp = false;

/**
 * Log verbose messages
 * @param {string} message
 */
function vlog(message) {
	if (isVerbose) {
		console.log(`[verbose] ${message}`);
	}
}

/**
 * Check if a port is in use
 * @param {number} port
 * @returns {Promise<boolean>}
 */
function isPortInUse(port) {
	return new Promise((resolve) => {
		const server = net.createServer();
		server.once('error', () => {
			resolve(true);
		});
		server.once('listening', () => {
			server.close();
			resolve(false);
		});
		server.listen(port);
	});
}

/**
 * Cleanup function - kills all spawned processes
 */
async function cleanup() {
	if (isCleaningUp) return;
	isCleaningUp = true;

	console.log('\n🧹 Cleaning up...');

	if (chrome) {
		vlog('Killing Chrome...');
		try {
			await chrome.kill();
			vlog('Chrome killed');
		} catch (e) {
			vlog(`Error killing Chrome: ${e}`);
		}
		chrome = null;
	}

	if (previewProcess) {
		vlog('Killing preview process...');
		try {
			await killProcess(previewProcess);
			vlog('Preview process killed');
		} catch (e) {
			vlog(`Error killing preview process: ${e}`);
		}
		previewProcess = null;
	}

	console.log('✅ Cleanup complete');
}

// Set up signal handlers for graceful shutdown
process.on('SIGINT', async () => {
	console.log('\n\n⚠️  Received SIGINT (Ctrl+C)');
	await cleanup();
	process.exit(130);
});

process.on('SIGTERM', async () => {
	console.log('\n\n⚠️  Received SIGTERM');
	await cleanup();
	process.exit(143);
});

process.on('uncaughtException', async (error) => {
	console.error('\n❌ Uncaught Exception:', error);
	await cleanup();
	process.exit(1);
});

process.on('unhandledRejection', async (reason) => {
	console.error('\n❌ Unhandled Rejection:', reason);
	await cleanup();
	process.exit(1);
});

/**
 * Run a command and return the output
 * @param {string} command
 * @param {string[]} args
 * @param {import('node:child_process').SpawnOptions} options
 * @returns {Promise<import('node:child_process').ChildProcess>}
 */
function spawnCommand(command, args, options = {}) {
	vlog(`Spawning: ${command} ${args.join(' ')}`);
	return new Promise((resolve, reject) => {
		const stdio = isVerbose ? 'inherit' : 'ignore';
		const child = spawn(command, args, {
			stdio,
			detached: false,
			...options
		});

		child.on('error', (err) => {
			vlog(`Spawn error: ${err.message}`);
			reject(err);
		});

		child.on('exit', (code, signal) => {
			vlog(`Process exited with code ${code}, signal ${signal}`);
		});

		// Give it a moment to start, then resolve
		setTimeout(() => {
			if (child.killed) {
				reject(new Error('Process was killed immediately'));
			} else {
				vlog('Process spawned successfully');
				resolve(child);
			}
		}, 1000);
	});
}

/**
 * Wait for server to be ready
 * @param {string} url
 * @param {number} timeout
 * @returns {Promise<void>}
 */
async function waitForServer(url, timeout) {
	vlog(`Waiting for server at ${url}...`);
	const startTime = Date.now();
	let attempts = 0;

	while (Date.now() - startTime < timeout) {
		attempts++;
		try {
			const response = await fetch(url);
			if (response.ok) {
				vlog(`Server ready after ${attempts} attempts (${Date.now() - startTime}ms)`);
				console.log('✅ Server is ready');
				return;
			}
		} catch (err) {
			if (isVerbose && attempts % 5 === 0) {
				console.log(`[verbose] Attempt ${attempts}: ${err.message}`);
			}
		}
		await new Promise((/** @type {(value: void) => void} */ resolve) => setTimeout(resolve, 500));
	}

	throw new Error(`Server did not start within ${timeout}ms`);
}

/**
 * Kill a process
 * @param {import('node:child_process').ChildProcess} process
 * @returns {Promise<void>}
 */
function killProcess(process) {
	return new Promise((resolve) => {
		if (!process || process.killed) {
			resolve();
			return;
		}

		let resolved = false;
		const done = () => {
			if (!resolved) {
				resolved = true;
				resolve();
			}
		};

		process.on('close', done);
		process.on('exit', done);

		// Try graceful kill first
		try {
			process.kill('SIGTERM');
		} catch {
			done();
			return;
		}

		// Force kill after 5 seconds
		setTimeout(() => {
			try {
				if (!process.killed) {
					process.kill('SIGKILL');
				}
			} catch {
				// Process might already be dead
			}
			done();
		}, 5000);
	});
}

/**
 * Run Lighthouse audit
 * @param {string} url
 * @param {chromeLauncher.LaunchedChrome} chrome
 * @param {number} runNumber
 */
async function runLighthouse(url, chrome, runNumber) {
	console.log(`\n📊 Running Lighthouse audit #${runNumber}...`);
	vlog(`Audit URL: ${url}`);

	/** @type {import('lighthouse').Flags} */
	const options = {
		logLevel: isVerbose ? 'info' : 'error',
		output: ['html', 'json'],
		port: chrome.port,
		formFactor: 'desktop',
		screenEmulation: {
			width: 1350,
			height: 940,
			deviceScaleFactor: 1,
			mobile: false,
			disabled: false
		}
	};

	const runnerResult = await lighthouse(url, options);

	if (!runnerResult) {
		throw new Error('Lighthouse audit failed');
	}

	const { lhr, report } = runnerResult;
	vlog(
		`Audit #${runNumber} complete. Score: ${Math.round((lhr.categories.performance?.score || 0) * 100)}%`
	);

	// Save reports
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const baseFilename = `lighthouse-${runNumber}-${timestamp}`;

	fs.writeFileSync(
		path.join(REPORTS_DIR, `${baseFilename}.html`),
		Array.isArray(report) ? report[0] : report
	);
	fs.writeFileSync(path.join(REPORTS_DIR, `${baseFilename}.json`), JSON.stringify(lhr, null, 2));

	return lhr;
}

/**
 * Print audit summary
 * @param {any[]} results
 */
function printSummary(results) {
	console.log('\n' + '='.repeat(60));
	console.log('📈 LIGHTHOUSE SUMMARY (Average of ' + results.length + ' runs)');
	console.log('='.repeat(60));

	const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
	const averages = {};

	for (const category of categories) {
		const scores = results.map((r) => r.categories[category]?.score || 0);
		const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
		const min = Math.min(...scores);
		const max = Math.max(...scores);

		averages[category] = avg;

		const emoji = avg >= 0.9 ? '🟢' : avg >= 0.5 ? '🟡' : '🔴';
		const pct = Math.round(avg * 100);
		console.log(
			`${emoji} ${category.padEnd(16)} ${pct}% (range: ${Math.round(min * 100)}-${Math.round(max * 100)}%)`
		);
	}

	// Core Web Vitals
	console.log('\n📊 Core Web Vitals (Average):');
	const fcp = results.map((r) => r.audits['first-contentful-paint']?.numericValue || 0);
	const lcp = results.map((r) => r.audits['largest-contentful-paint']?.numericValue || 0);
	const tbt = results.map((r) => r.audits['total-blocking-time']?.numericValue || 0);
	const cls = results.map((r) => r.audits['cumulative-layout-shift']?.numericValue || 0);

	const avgFcp = fcp.reduce((a, b) => a + b, 0) / fcp.length;
	const avgLcp = lcp.reduce((a, b) => a + b, 0) / lcp.length;
	const avgTbt = tbt.reduce((a, b) => a + b, 0) / tbt.length;
	const avgCls = cls.reduce((a, b) => a + b, 0) / cls.length;

	console.log(`   First Contentful Paint: ${(avgFcp / 1000).toFixed(2)}s`);
	console.log(`   Largest Contentful Paint: ${(avgLcp / 1000).toFixed(2)}s`);
	console.log(`   Total Blocking Time: ${avgTbt.toFixed(0)}ms`);
	console.log(`   Cumulative Layout Shift: ${avgCls.toFixed(3)}`);

	console.log('\n📁 Reports saved to: .lighthouse/');
	console.log('='.repeat(60));

	return averages;
}

async function main() {
	console.log('🚀 Starting Lighthouse testing...\n');
	vlog(`Port: ${LIGHTHOUSE_PORT}`);
	vlog(`Runs: ${LIGHTHOUSE_RUNS}`);
	vlog(`Reports directory: ${REPORTS_DIR}`);

	// Check if port is already in use
	vlog(`Checking if port ${LIGHTHOUSE_PORT} is available...`);
	if (await isPortInUse(LIGHTHOUSE_PORT)) {
		console.error(`\n❌ Error: Port ${LIGHTHOUSE_PORT} is already in use.`);
		console.error("   This might be from a previous Lighthouse run that didn't clean up properly.");
		console.error('   Try killing any wrangler processes or use a different port:');
		console.error(`   pnpm lighthouse --port ${LIGHTHOUSE_PORT + 1}`);
		process.exit(1);
	}
	vlog('Port is available');

	// Ensure reports directory exists
	if (!fs.existsSync(REPORTS_DIR)) {
		fs.mkdirSync(REPORTS_DIR, { recursive: true });
	}

	try {
		// Step 1: Build the app
		console.log('🔨 Building app...');
		execSync('pnpm build', { stdio: isVerbose ? 'inherit' : 'inherit' });
		console.log('✅ Build complete\n');

		// Step 2: Start preview server on custom port
		console.log(`🌐 Starting preview server on port ${LIGHTHOUSE_PORT}...`);

		// Check if worker file exists
		const workerPath = path.join(ROOT_DIR, '.svelte-kit/cloudflare/_worker.js');
		if (!fs.existsSync(workerPath)) {
			throw new Error(`Worker file not found: ${workerPath}`);
		}
		vlog(`Worker file exists: ${workerPath}`);

		previewProcess = await spawnCommand(
			'pnpm',
			[
				'exec',
				'wrangler',
				'dev',
				'.svelte-kit/cloudflare/_worker.js',
				'--port',
				String(LIGHTHOUSE_PORT)
			],
			{ cwd: ROOT_DIR }
		);

		console.log('✓ Preview process spawned');

		// Wait for server to be ready
		await waitForServer(SERVER_URL, STARTUP_TIMEOUT);

		// Step 3: Launch Chrome
		console.log('🖥️  Launching Chrome...');
		chrome = await chromeLauncher.launch({
			chromeFlags: ['--headless', '--no-sandbox', '--disable-setuid-sandbox']
		});
		vlog(`Chrome launched on port ${chrome.port}`);

		// Step 4: Run multiple Lighthouse audits
		const results = [];

		for (let i = 1; i <= LIGHTHOUSE_RUNS; i++) {
			const result = await runLighthouse(SERVER_URL, chrome, i);
			results.push(result);
		}

		// Step 5: Print summary
		printSummary(results);

		console.log('\n✨ Lighthouse testing complete!');
		process.exitCode = 0;
	} catch (error) {
		console.error('\n❌ Error:', error.message);
		if (isVerbose && error.stack) {
			console.error(error.stack);
		}
		process.exitCode = 1;
	} finally {
		await cleanup();
	}
}

main();
