#!/usr/bin/env node
/**
 * pulse-plugin-profile.mjs — Live Antigravity Plugin Token-Profile Switcher
 * -------------------------------------------------------------------------
 * Uses Antigravity's local LanguageServerService Connect RPCs (GetAllPlugins &
 * JetboxWriteState) to inspect installed plugins or toggle sprint profiles LIVE
 * without restarting Antigravity or hand-editing config.json.
 */

import path from 'node:path';
import { pathToFileURL } from 'node:url';

const address = process.env.ANTIGRAVITY_LS_ADDRESS || 'localhost:5387';
const csrf = process.env.ANTIGRAVITY_CSRF_TOKEN || '';

const PROFILES = {
  'design-studio': {
    description: 'Pure Brand Identity, Art Direction & 3-Look UX Prototyping sprint (~12K tokens saved; keeps ONLY creative-ux-studio + modern-web-guidance-plugin)',
    enable: ['creative-ux-studio', 'modern-web-guidance-plugin'],
    disable: [
      'chrome-devtools-plugin',
      'firebase',
      'gemini-api',
      'geminipulse-studio',
      'google-antigravity-sdk',
      'google-cloud-developer',
      'google-developer-knowledge',
    ],
  },
  'lean-editorial': {
    description: 'Ultra-lean writing & social sprint (~9K–12K tokens saved; pauses DevTools/Firebase/Cloud)',
    enable: ['geminipulse-studio', 'gemini-api', 'google-developer-knowledge'],
    disable: ['chrome-devtools-plugin', 'firebase', 'google-cloud-developer', 'google-antigravity-sdk'],
  },
  'web-qa': {
    description: 'Frontend UI, accessibility, LCP & headless DOM debugging sprint',
    enable: ['creative-ux-studio', 'geminipulse-studio', 'modern-web-guidance-plugin', 'chrome-devtools-plugin', 'gemini-api'],
    disable: ['google-cloud-developer', 'google-antigravity-sdk'],
  },
  'firebase-backend': {
    description: 'Firestore Security Rules, Auth, Hosting & Cloud architecture sprint (DevTools paused)',
    enable: ['geminipulse-studio', 'firebase', 'google-cloud-developer', 'gemini-api', 'modern-web-guidance-plugin'],
    disable: ['chrome-devtools-plugin'],
  },
  'restore-all': {
    description: 'Re-enables all standard web, Firebase, Cloud, DevTools, Creative UX & GeminiPulse plugins',
    enable: [
      'creative-ux-studio',
      'geminipulse-studio',
      'chrome-devtools-plugin',
      'firebase',
      'gemini-api',
      'google-antigravity-sdk',
      'google-cloud-developer',
      'google-developer-knowledge',
      'modern-web-guidance-plugin',
    ],
    disable: [],
  },
};

async function lsrpc(method, bodyObj) {
  const res = await fetch(`http://${address}/exa.language_server_pb.LanguageServerService/${method}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-codeium-csrf-token': csrf,
    },
    body: JSON.stringify(bodyObj),
  });
  if (!res.ok) {
    throw new Error(`${method} failed with HTTP ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function getInventory() {
  const wsUri = pathToFileURL(path.resolve(process.cwd())).href;
  const data = await lsrpc('GetAllPlugins', {
    workspaceUris: [wsUri],
  });
  return (data.plugins || []).map((p) => {
    const parts = String(p.path || '').split('/');
    return {
      name: p.name,
      dir: parts[parts.length - 1],
      enabled: !p.disabled,
      skillCount: (p.skills || []).length,
      agentCount: (p.agents || []).length,
      mcpCount: (p.mcpServers || []).length,
    };
  });
}

async function main() {
  const cmd = process.argv[2] || 'status';
  const inventory = await getInventory();

  if (cmd === 'status') {
    const activeSkills = inventory.filter((p) => p.enabled).reduce((acc, p) => acc + p.skillCount, 0);
    const activeAgents = inventory.filter((p) => p.enabled).reduce((acc, p) => acc + p.agentCount, 0);
    console.log(
      JSON.stringify(
        {
          summary: {
            installedPlugins: inventory.length,
            enabledPlugins: inventory.filter((p) => p.enabled).length,
            activeBundledSkills: activeSkills,
            activeBundledAgents: activeAgents,
          },
          availableProfiles: Object.fromEntries(Object.entries(PROFILES).map(([k, v]) => [k, v.description])),
          plugins: inventory,
        },
        null,
        2
      )
    );
    return;
  }

  const profile = PROFILES[cmd];
  if (!profile) {
    console.error(`Unknown profile "${cmd}". Available: status, ${Object.keys(PROFILES).join(', ')}`);
    process.exit(1);
  }

  const installedDirs = new Set(inventory.map((p) => p.dir));
  const changes = [];

  for (const dir of profile.enable) {
    if (installedDirs.has(dir)) {
      await lsrpc('JetboxWriteState', { userConfig: { plugins: { [dir]: { enabled: true } } } });
      changes.push({ dir, enabled: true });
    }
  }
  for (const dir of profile.disable) {
    if (installedDirs.has(dir)) {
      await lsrpc('JetboxWriteState', { userConfig: { plugins: { [dir]: { enabled: false } } } });
      changes.push({ dir, enabled: false });
    }
  }

  console.log(JSON.stringify({ appliedProfile: cmd, description: profile.description, liveChanges: changes }, null, 2));
}

main().catch((err) => {
  console.error('[pulse-plugin-profile] Error:', err.message);
  process.exit(1);
});
