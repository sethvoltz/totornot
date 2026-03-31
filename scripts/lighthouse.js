#!/usr/bin/env node
// @ts-check
/**
 * Lighthouse testing script for local development
 * Builds the app, starts preview server, runs Lighthouse, generates reports
 */

import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');
const REPORTS_DIR = path.join(ROOT_DIR, '.lighthouse');
const LIGHTHOUSE_PORT = parseInt(process.env.LIGHTHOUSE_PORT || '8765', 10);
const SERVER_URL = `http://localhost:${LIGHTHOUSE_PORT}`;
const STARTUP_TIMEOUT = 30000;

/**
 * Run a command and return the output
 * @param {string} command
 * @param {string[]} args
 * @param {import('node:child_process').SpawnOptions} options
 * @returns {Promise<import('node:child_process').ChildProcess>}
 */
function spawnCommand(command, args, options = {}) {
	return new Promise((resolve, reject) => {
		const child = spawn(command, args, {
			stdio: ['ignore', 'ignore', 'ignore'],
			...options
		});

		child.on('error', reject);
		child.on('spawn', () => resolve(child));
	});
}

/**
 * Wait for server to be ready
 * @param {string} url
 * @param {number} timeout
 * @returns {Promise<void>}
 */
async function waitForServer(url, timeout) {
	const startTime = Date.now();

	while (Date.now() - startTime < timeout) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				console.log('✅ Server is ready');
				return;
			}
		} catch {
			// Server not ready yet
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

		process.on('close', () => resolve());
		process.on('exit', () => resolve());

		// Try graceful kill first
		process.kill('SIGTERM');

		// Force kill after 5 seconds
		setTimeout(() => {
			try {
				process.kill('SIGKILL');
			} catch {
				// Process might already be dead
			}
			resolve();
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

	/** @type {import('lighthouse').Flags} */
	const options = {
		logLevel: 'error',
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

	// Ensure reports directory exists
	if (!fs.existsSync(REPORTS_DIR)) {
		fs.mkdirSync(REPORTS_DIR, { recursive: true });
	}

	let previewProcess = null;
	let chrome = null;

	try {
		// Step 1: Build the app
		console.log('🔨 Building app...');
		execSync('pnpm build', { stdio: 'inherit' });
		console.log('✅ Build complete\n');

		// Step 2: Start preview server on custom port
		console.log(`🌐 Starting preview server on port ${LIGHTHOUSE_PORT}...`);
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

		// Wait for server to be ready
		await waitForServer(SERVER_URL, STARTUP_TIMEOUT);

		// Step 3: Launch Chrome
		console.log('🖥️  Launching Chrome...');
		chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

		// Step 4: Run multiple Lighthouse audits
		const numberOfRuns = parseInt(process.env.LIGHTHOUSE_RUNS || '3', 10);
		const results = [];

		for (let i = 1; i <= numberOfRuns; i++) {
			const result = await runLighthouse(SERVER_URL, chrome, i);
			results.push(result);
		}

		// Step 5: Print summary
		printSummary(results);

		console.log('\n✨ Lighthouse testing complete!');
		process.exit(0);
	} catch (error) {
		console.error('\n❌ Error:', error.message);
		process.exit(1);
	} finally {
		// Cleanup
		if (chrome) {
			await chrome.kill();
		}
		if (previewProcess) {
			await killProcess(previewProcess);
		}
	}
}

main();
