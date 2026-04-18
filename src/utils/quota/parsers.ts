/**
 * Normalization and parsing functions for quota data.
 */

import type {
  ClaudeUsagePayload,
  CodexUsagePayload,
  CursorQuotaRow,
  GeminiCliCodeAssistPayload,
  GeminiCliQuotaPayload,
  KimiUsagePayload,
} from '@/types';
import { normalizeAuthIndex } from '@/utils/usage';

const GEMINI_CLI_MODEL_SUFFIX = '_vertex';
export { normalizeAuthIndex };

export function normalizeStringValue(value: unknown): string | null {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value.toString();
  }
  return null;
}

export function normalizeGeminiCliModelId(value: unknown): string | null {
  const modelId = normalizeStringValue(value);
  if (!modelId) return null;
  if (modelId.endsWith(GEMINI_CLI_MODEL_SUFFIX)) {
    return modelId.slice(0, -GEMINI_CLI_MODEL_SUFFIX.length);
  }
  return modelId;
}

export function normalizeNumberValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function normalizeQuotaFraction(value: unknown): number | null {
  const normalized = normalizeNumberValue(value);
  if (normalized !== null) return normalized;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.endsWith('%')) {
      const parsed = Number(trimmed.slice(0, -1));
      return Number.isFinite(parsed) ? parsed / 100 : null;
    }
  }
  return null;
}

export function normalizePlanType(value: unknown): string | null {
  const normalized = normalizeStringValue(value);
  return normalized ? normalized.toLowerCase() : null;
}

export function decodeBase64UrlPayload(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const normalized = trimmed.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
      return window.atob(padded);
    }
    if (typeof atob === 'function') {
      return atob(padded);
    }
  } catch {
    return null;
  }
  return null;
}

export function parseIdTokenPayload(value: unknown): Record<string, unknown> | null {
  if (!value) return null;
  if (typeof value === 'object') {
    return Array.isArray(value) ? null : (value as Record<string, unknown>);
  }
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    // Continue to JWT parsing
  }
  const segments = trimmed.split('.');
  if (segments.length < 2) return null;
  const decoded = decodeBase64UrlPayload(segments[1]);
  if (!decoded) return null;
  try {
    const parsed = JSON.parse(decoded) as Record<string, unknown>;
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {
    return null;
  }
  return null;
}

export function parseAntigravityPayload(payload: unknown): Record<string, unknown> | null {
  const toRecord = (value: unknown): Record<string, unknown> | null => {
    if (value === undefined || value === null) return null;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return null;
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed as Record<string, unknown>;
        }
      } catch {
        return null;
      }
      return null;
    }
    if (typeof value === 'object' && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return null;
  };

  const parsed = toRecord(payload);
  if (!parsed) return null;

  if ('models' in parsed) {
    return parsed;
  }

  const nested = toRecord(parsed.body);
  if (nested) {
    return nested;
  }

  return parsed;
}

export function parseClaudeUsagePayload(payload: unknown): ClaudeUsagePayload | null {
  if (payload === undefined || payload === null) return null;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed) as ClaudeUsagePayload;
    } catch {
      return null;
    }
  }
  if (typeof payload === 'object') {
    return payload as ClaudeUsagePayload;
  }
  return null;
}

export function parseCodexUsagePayload(payload: unknown): CodexUsagePayload | null {
  if (payload === undefined || payload === null) return null;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed) as CodexUsagePayload;
    } catch {
      return null;
    }
  }
  if (typeof payload === 'object') {
    return payload as CodexUsagePayload;
  }
  return null;
}

export function parseGeminiCliQuotaPayload(payload: unknown): GeminiCliQuotaPayload | null {
  if (payload === undefined || payload === null) return null;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed) as GeminiCliQuotaPayload;
    } catch {
      return null;
    }
  }
  if (typeof payload === 'object') {
    return payload as GeminiCliQuotaPayload;
  }
  return null;
}

export function parseGeminiCliCodeAssistPayload(payload: unknown): GeminiCliCodeAssistPayload | null {
  if (payload === undefined || payload === null) return null;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed) as GeminiCliCodeAssistPayload;
    } catch {
      return null;
    }
  }
  if (typeof payload === 'object') {
    return payload as GeminiCliCodeAssistPayload;
  }
  return null;
}

export function parseKimiUsagePayload(payload: unknown): KimiUsagePayload | null {
  if (payload === undefined || payload === null) return null;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return null;
    try {
      return JSON.parse(trimmed) as KimiUsagePayload;
    } catch {
      return null;
    }
  }
  if (typeof payload === 'object') {
    return payload as KimiUsagePayload;
  }
  return null;
}

const CURSOR_USAGE_SKIP_KEYS = new Set([
  'startofmonth',
  'billingcyclestart',
  'subscription',
  'plan',
  'membershiptype',
  'metadata',
  'user',
  'team',
]);

function cursorUsageEntryUsed(entry: Record<string, unknown>): number | null {
  const v =
    normalizeNumberValue(entry.numRequests) ??
    normalizeNumberValue(entry.num_requests) ??
    normalizeNumberValue(entry.used) ??
    normalizeNumberValue(entry.requests);
  return v !== null ? Math.max(0, Math.floor(v)) : null;
}

function cursorUsageEntryLimit(entry: Record<string, unknown>): number | null {
  const v =
    normalizeNumberValue(entry.maxRequestUsage) ??
    normalizeNumberValue(entry.max_request_usage) ??
    normalizeNumberValue(entry.maxUsage) ??
    normalizeNumberValue(entry.max_usage) ??
    normalizeNumberValue(entry.limit);
  if (v === null) return null;
  const n = Math.floor(v);
  return n < 0 ? 0 : n;
}

function isCursorUsageEntry(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const o = value as Record<string, unknown>;
  return (
    cursorUsageEntryUsed(o) !== null ||
    cursorUsageEntryLimit(o) !== null ||
    typeof o.model === 'string' ||
    typeof o.modelId === 'string' ||
    typeof o.model_id === 'string'
  );
}

/**
 * Parses Cursor `GET https://api2.cursor.sh/auth/usage` JSON into quota rows.
 * Shape varies by account; we accept per-model objects with request counts.
 */
export function parseCursorUsageRows(payload: unknown): CursorQuotaRow[] | null {
  let root: Record<string, unknown> | null = null;
  if (payload === undefined || payload === null) return null;
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (!trimmed) return null;
    try {
      root = JSON.parse(trimmed) as Record<string, unknown>;
    } catch {
      return null;
    }
  } else if (typeof payload === 'object' && !Array.isArray(payload)) {
    root = payload as Record<string, unknown>;
  }
  if (!root) return null;

  const rows: CursorQuotaRow[] = [];
  for (const [key, raw] of Object.entries(root)) {
    const lk = key.trim().toLowerCase();
    if (!lk || CURSOR_USAGE_SKIP_KEYS.has(lk)) continue;
    if (!isCursorUsageEntry(raw)) continue;
    const entry = raw as Record<string, unknown>;
    const used = cursorUsageEntryUsed(entry) ?? 0;
    const limit = cursorUsageEntryLimit(entry) ?? 0;
    const labelFromModel =
      (typeof entry.model === 'string' && entry.model.trim()) ||
      (typeof entry.modelId === 'string' && entry.modelId.trim()) ||
      (typeof entry.model_id === 'string' && entry.model_id.trim()) ||
      '';
    const label = labelFromModel || key;
    rows.push({ id: `cursor-${key}`, label, used, limit });
  }

  rows.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));
  return rows.length ? rows : null;
}
