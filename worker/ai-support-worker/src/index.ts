/// <reference lib="webworker" />

type Priority = 'low' | 'medium' | 'high' | 'urgent';
type RequestStatus = 'new' | 'triaged' | 'in_progress' | 'blocked' | 'resolved' | 'closed';

export interface Env {
	GROQ_API_KEY?: string;
	GROQ_MODEL?: string;
	SUPABASE_URL?: string;
	SUPABASE_SERVICE_ROLE_KEY?: string;
	ALLOWED_ORIGIN?: string;
}

type IntakeRequest = {
	title: string;
	description: string;
	requesterName: string;
	requesterEmail: string;
	department: string;
	evidenceLinks?: string[];
};

type AiClassification = {
	summary: string;
	category: string;
	priority: Priority;
	recommendedOwner: string;
	riskLevel: 'low' | 'medium' | 'high';
	blockers: string[];
	suggestedActions: string[];
};

const fallbackClassification: AiClassification = {
	summary: 'Request received and awaiting AI classification.',
	category: 'General Support',
	priority: 'medium',
	recommendedOwner: 'Support Operations',
	riskLevel: 'medium',
	blockers: [],
	suggestedActions: ['Review the request details', 'Assign an owner', 'Confirm next steps with the requester'],
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: corsHeaders(env) });
		}

		try {
			if (url.pathname === '/') {
				return json(env, {
					ok: true,
					service: 'AI Support Operations API',
					endpoints: ['POST /api/requests', 'GET /api/requests', 'PATCH /api/requests/:id'],
				});
			}

			if (url.pathname === '/api/requests' && request.method === 'POST') {
				const input = validateIntake(await readJson(request));
				const ai = await classifyWithGroq(input, env);
				const saved = await createSupabaseRequest(input, ai, env);

				console.log('support_request_created', { id: saved.id, priority: saved.priority });
				return json(env, { request: saved }, 201);
			}

			if (url.pathname === '/api/requests' && request.method === 'GET') {
				const requests = await listSupabaseRequests(env);
				return json(env, { requests });
			}

			const patchMatch = url.pathname.match(/^\/api\/requests\/([^/]+)$/);
			if (patchMatch && request.method === 'PATCH') {
				const id = decodeURIComponent(patchMatch[1]);
				const update = validateUpdate(await readJson(request));
				const saved = await updateSupabaseRequest(id, update, env);

				console.log('support_request_updated', { id: saved.id, status: saved.status });
				return json(env, { request: saved });
			}

			return json(env, { error: 'Not found' }, 404);
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unexpected error';
			const status = error instanceof ApiError ? error.status : 500;

			console.error('api_error', { status, message });
			return json(env, { error: message }, status);
		}
	},
};

class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
	}
}

async function readJson(request: Request) {
	try {
		return await request.json();
	} catch {
		throw new ApiError(400, 'Request body must be valid JSON');
	}
}

function validateIntake(body: unknown): IntakeRequest {
	if (!isRecord(body)) {
		throw new ApiError(400, 'Request body must be an object');
	}

	const input = {
		title: requiredString(body.title, 'title'),
		description: requiredString(body.description, 'description'),
		requesterName: requiredString(body.requesterName, 'requesterName'),
		requesterEmail: requiredString(body.requesterEmail, 'requesterEmail'),
		department: requiredString(body.department, 'department'),
		evidenceLinks: optionalStringList(body.evidenceLinks, 'evidenceLinks'),
	};

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.requesterEmail)) {
		throw new ApiError(400, 'requesterEmail must be a valid email address');
	}

	return input;
}

function validateUpdate(body: unknown) {
	if (!isRecord(body)) {
		throw new ApiError(400, 'Request body must be an object');
	}

	const update: Record<string, unknown> = {};

	if (body.status !== undefined) {
		const status = requiredString(body.status, 'status') as RequestStatus;
		if (!['new', 'triaged', 'in_progress', 'blocked', 'resolved', 'closed'].includes(status)) {
			throw new ApiError(400, 'status is not supported');
		}
		update.status = status;
	}

	if (body.assigned_owner !== undefined) {
		update.assigned_owner = optionalString(body.assigned_owner, 'assigned_owner');
	}

	if (body.blockers !== undefined) {
		update.blockers = optionalStringList(body.blockers, 'blockers');
	}

	if (body.evidence_links !== undefined) {
		update.evidence_links = optionalStringList(body.evidence_links, 'evidence_links');
	}

	if (Object.keys(update).length === 0) {
		throw new ApiError(400, 'No supported update fields provided');
	}

	update.updated_at = new Date().toISOString();
	return update;
}

async function classifyWithGroq(input: IntakeRequest, env: Env): Promise<AiClassification> {
	if (!env.GROQ_API_KEY) {
		return fallbackClassification;
	}

	const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.GROQ_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model: env.GROQ_MODEL || 'llama-3.1-8b-instant',
			temperature: 0.2,
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content:
						'Classify internal support requests. Return only JSON with summary, category, priority, recommendedOwner, riskLevel, blockers, and suggestedActions.',
				},
				{
					role: 'user',
					content: JSON.stringify(input),
				},
			],
		}),
	});

	if (!response.ok) {
		console.error('groq_error', { status: response.status, body: await response.text() });
		return fallbackClassification;
	}

	const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
	const content = data.choices?.[0]?.message?.content;
	if (!content) {
		return fallbackClassification;
	}

	try {
		return normalizeClassification(JSON.parse(content));
	} catch {
		return fallbackClassification;
	}
}

function normalizeClassification(value: unknown): AiClassification {
	if (!isRecord(value)) {
		return fallbackClassification;
	}

	return {
		summary: optionalString(value.summary, 'summary') || fallbackClassification.summary,
		category: optionalString(value.category, 'category') || fallbackClassification.category,
		priority: normalizePriority(value.priority),
		recommendedOwner:
			optionalString(value.recommendedOwner, 'recommendedOwner') ||
			optionalString(value.recommended_owner, 'recommended_owner') ||
			fallbackClassification.recommendedOwner,
		riskLevel: normalizeRisk(value.riskLevel || value.risk_level),
		blockers: optionalStringList(value.blockers, 'blockers'),
		suggestedActions: optionalStringList(value.suggestedActions || value.suggested_actions, 'suggestedActions'),
	};
}

async function createSupabaseRequest(input: IntakeRequest, ai: AiClassification, env: Env) {
	return supabaseFetch(env, '/rest/v1/support_requests', {
		method: 'POST',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify({
			title: input.title,
			description: input.description,
			requester_name: input.requesterName,
			requester_email: input.requesterEmail,
			department: input.department,
			evidence_links: input.evidenceLinks || [],
			status: 'triaged',
			category: ai.category,
			priority: ai.priority,
			assigned_owner: ai.recommendedOwner,
			ai_summary: ai.summary,
			risk_level: ai.riskLevel,
			blockers: ai.blockers,
			suggested_actions: ai.suggestedActions,
		}),
	}).then(firstRow);
}

async function listSupabaseRequests(env: Env) {
	return supabaseFetch(env, '/rest/v1/support_requests?select=*&order=created_at.desc', {
		method: 'GET',
	});
}

async function updateSupabaseRequest(id: string, update: Record<string, unknown>, env: Env) {
	return supabaseFetch(env, `/rest/v1/support_requests?id=eq.${encodeURIComponent(id)}`, {
		method: 'PATCH',
		headers: { Prefer: 'return=representation' },
		body: JSON.stringify(update),
	}).then(firstRow);
}

async function supabaseFetch(env: Env, path: string, init: RequestInit) {
	if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
		throw new ApiError(500, 'Supabase is not configured for this Worker');
	}

	const response = await fetch(`${env.SUPABASE_URL}${path}`, {
		...init,
		headers: {
			apikey: env.SUPABASE_SERVICE_ROLE_KEY,
			Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
			'Content-Type': 'application/json',
			...(init.headers || {}),
		},
	});

	if (!response.ok) {
		const body = await response.text();
		console.error('supabase_error', { status: response.status, body });
		throw new ApiError(502, 'Supabase request failed');
	}

	return await response.json();
}

function firstRow(rows: unknown) {
	if (Array.isArray(rows) && rows[0]) {
		return rows[0];
	}
	throw new ApiError(502, 'Supabase did not return a saved request');
}

function corsHeaders(env: Env) {
	return {
		'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
		'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type,Authorization',
	};
}

function json(env: Env, body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			...corsHeaders(env),
			'Content-Type': 'application/json',
		},
	});
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string) {
	if (typeof value !== 'string' || !value.trim()) {
		throw new ApiError(400, `${field} is required`);
	}
	return value.trim();
}

function optionalString(value: unknown, field: string) {
	if (value === null || value === undefined || value === '') {
		return '';
	}
	if (typeof value !== 'string') {
		throw new ApiError(400, `${field} must be a string`);
	}
	return value.trim();
}

function optionalStringList(value: unknown, field: string) {
	if (value === undefined || value === null || value === '') {
		return [];
	}
	if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
		throw new ApiError(400, `${field} must be a list of strings`);
	}
	return value.map((item) => item.trim()).filter(Boolean);
}

function normalizePriority(value: unknown): Priority {
	const priority = typeof value === 'string' ? value.toLowerCase() : '';
	if (['low', 'medium', 'high', 'urgent'].includes(priority)) {
		return priority as Priority;
	}
	return fallbackClassification.priority;
}

function normalizeRisk(value: unknown): 'low' | 'medium' | 'high' {
	const risk = typeof value === 'string' ? value.toLowerCase() : '';
	if (['low', 'medium', 'high'].includes(risk)) {
		return risk as 'low' | 'medium' | 'high';
	}
	return fallbackClassification.riskLevel;
}
