#!/usr/bin/env node
/**
 * house-rules-guard.mjs — Optional Zero-Token PreToolUse Guardrail Hook
 * ---------------------------------------------------------------------
 * Enforces GeminiPulse House Rules #1 (Never push to 'agile' remote; never stage .env)
 * and #3 (Billing Gate: Firebase Cloud Functions deploy requires explicit confirmation).
 * Note: Never emits "allow" so standard user command permissions are never bypassed.
 */

import fs from 'node:fs';

let payload = {};
try {
  const raw = fs.readFileSync(0, 'utf8');
  payload = raw ? JSON.parse(raw) : {};
} catch {
  process.stdout.write(JSON.stringify({ decision: 'ask' }));
  process.exit(0);
}

const workspaces = payload.workspacePaths || [];
const inGeminiPulse = workspaces.some((p) => String(p).includes('geminipulse-com'));
const cmd = String(payload?.toolCall?.args?.CommandLine || '');

if (inGeminiPulse) {
  if (/\bgit\s+push\s+agile\b/.test(cmd)) {
    process.stdout.write(
      JSON.stringify({
        decision: 'deny',
        reason: 'Blocked by GeminiPulse House Rule #1: Never push to the archived "agile" remote. Push only to "origin".',
      })
    );
    process.exit(0);
  }

  if (/\bgit\s+add\s+.*(^|\s|\/)\.env(\.|\s|$)/.test(cmd)) {
    process.stdout.write(
      JSON.stringify({
        decision: 'deny',
        reason: 'Blocked by GeminiPulse House Rule #1 (Zero-PII): Never stage .env or secret files.',
      })
    );
    process.exit(0);
  }

  if (/firebase(-tools)?\s+deploy/.test(cmd) && (cmd.includes('functions') || !cmd.includes('--only'))) {
    process.stdout.write(
      JSON.stringify({
        decision: 'force_ask',
        reason: '🚨 HOUSE RULE #3 BILLING GATE: Deploying Firebase Cloud Functions requires explicit Blaze billing approval from Neil.',
      })
    );
    process.exit(0);
  }
}

process.stdout.write(JSON.stringify({ decision: 'ask' }));
