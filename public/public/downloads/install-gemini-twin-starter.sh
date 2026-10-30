#!/usr/bin/env bash
# GeminiPulse.com — 1-Line Antigravity Installer for "Gemini (T)winning Starter Kit"
# Inspect source anytime at: https://github.com/GeminiPulse/geminipulse-com/tree/v2.0/addons/gemini-twin-starter
set -euo pipefail

DEST_DIR="${HOME}/.gemini/config/plugins/gemini-twin-starter"
ARCHIVE_URL="https://geminipulse.com/downloads/gemini-twin-starter.tar.gz"

echo "✦ Installing Gemini (T)winning Starter Kit -> ${DEST_DIR}"
mkdir -p "${DEST_DIR}"
curl -fsSL "${ARCHIVE_URL}" | tar -xz -C "${DEST_DIR}" --strip-components=1

echo "✅ Installed gemini-twin-starter v1.0.0!"
echo "👉 Restart Google Antigravity once so the new plugin directory is discovered."
echo "📖 Explore guides, Labs & Pro Add-Ons at https://geminipulse.com/#addons"
