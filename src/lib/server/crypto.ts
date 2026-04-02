const IP_HASH_ALGORITHM = 'SHA-256';

export async function hashIp(ip: string, secret: string): Promise<string> {
	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		'raw',
		encoder.encode(secret),
		{ name: 'HMAC', hash: IP_HASH_ALGORITHM },
		false,
		['sign']
	);

	const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(ip));

	return Array.from(new Uint8Array(signature))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}
