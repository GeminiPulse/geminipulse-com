#!/usr/bin/env node
/**
 * GeminiPulse YouTube Shorts Voiceover Generator (gemini-3.8-flash-tts)
 * ---------------------------------------------------------------------
 * Generates 24kHz WAV narration tracks for Short #05 & Short #06 ("mAiking the swAitch")
 * using the official Google Gemini Interactions API (`gemini-3.8-flash-tts`).
 *
 * Usage:
 *   GEMINI_API_KEY="your_key" node scripts/generate-short-tts.mjs short-05
 *   GEMINI_API_KEY="your_key" node scripts/generate-short-tts.mjs short-06
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCRIPTS = {
  'short-05': {
    title: 'Short #05: mAiking the swAitch (WordPress & FTP to Antigravity)',
    outputFile: path.resolve(__dirname, '../public/shorts/short-05-voiceover.wav'),
    prompt:
      '[style: energetic, relatable, conversational] Still thinking about websites like it is 2012 with FTP, cPanel, and WordPress backups? Do not worry—you already know how to use AI coding. That Local Checkout? It is just your working folder on your Mac. That Git Worktree? It is an instant, free local staging site created in one second. Remember panicking when a live FTP edit crashed your site? In Git, your live site sits safely on main while you and the AI build on version 2.0. And in AI, instead of installing 50 bloated WordPress plugins, you use specialized subagents to keep your token bills tiny. Read the complete Rosetta Stone right now at GeminiPulse dot com.',
  },
  'short-06': {
    title: 'Short #06: mAiking the swAitch Part 2 (MySQL & phpMyAdmin to Cloud Firestore)',
    outputFile: path.resolve(__dirname, '../public/shorts/short-06-voiceover.wav'),
    prompt:
      '[style: energetic, clear, developer-friendly] Switching from WordPress to AI coding and wondering where phpMyAdmin and your MySQL tables went? Here is the 45-second Database Rosetta Stone. Instead of scattering one post across 25 rows in wp_postmeta and running slow SQL joins, a Cloud Firestore document is one clean, self-contained JSON object. Worried about seeing your Firebase config in frontend JavaScript? In Firebase, that config is just a public project address—Firestore Security Rules lock every document at Google’s edge. And with real-time onSnapshot listeners, new submissions stream live in milliseconds without ever clicking Purge Cache. Try our interactive SQL-to-Firestore translator at GeminiPulse dot com.',
  },
};

const target = process.argv[2] || 'short-05';
const item = SCRIPTS[target];

if (!item) {
  console.error(`Unknown short ID "${target}". Available: ${Object.keys(SCRIPTS).join(', ')}`);
  process.exit(1);
}

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.log(`[generate-short-tts] Ready to synthesize: ${item.title}`);
  console.log(`[generate-short-tts] Note: GEMINI_API_KEY not set in environment.`);
  console.log(`[generate-short-tts] Interactive browser TTS is active at /shorts/short-05-making-the-switch.html`);
  console.log(`[generate-short-tts] To export a master WAV via gemini-3.8-flash-tts, run:`);
  console.log(`  GEMINI_API_KEY="AIza..." node public/scripts/generate-short-tts.mjs ${target}`);
  process.exit(0);
}

async function run() {
  console.log(`[generate-short-tts] Calling gemini-3.8-flash-tts via Interactions API for ${target}...`);
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'gemini-3.8-flash-tts',
      input: item.prompt,
      generation_config: {
        response_mime_type: 'audio/wav',
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Interactions API HTTP ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const audioOutput = (data.outputs || []).find((o) => o.type === 'audio' || o.data);
  if (!audioOutput || !audioOutput.data) {
    throw new Error('No audio output returned in interaction response.');
  }

  const buffer = Buffer.from(audioOutput.data, 'base64');
  fs.mkdirSync(path.dirname(item.outputFile), { recursive: true });
  fs.writeFileSync(item.outputFile, buffer);
  console.log(`[generate-short-tts] Saved master WAV (${buffer.length} bytes) -> ${item.outputFile}`);
}

run().catch((err) => {
  console.error('[generate-short-tts] Error:', err.message);
  process.exit(1);
});
