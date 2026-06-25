import { env, SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from '../src/index';

describe('AI Support Operations worker', () => {
	it('returns API metadata from the health endpoint', async () => {
		const response = await worker.fetch(new Request('http://example.com'), env);
		const body = (await response.json()) as { ok: boolean; service: string };

		expect(response.status).toBe(200);
		expect(body.ok).toBe(true);
		expect(body.service).toBe('AI Support Operations API');
	});

	it('handles CORS preflight requests', async () => {
		const response = await SELF.fetch('https://example.com/api/requests', {
			method: 'OPTIONS',
		});

		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
	});

	it('validates request payloads before processing', async () => {
		const response = await worker.fetch(
			new Request('http://example.com/api/requests', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ title: '' }),
			}),
			env,
		);
		const body = (await response.json()) as { error: string };

		expect(response.status).toBe(400);
		expect(body.error).toBe('title is required');
	});
});
