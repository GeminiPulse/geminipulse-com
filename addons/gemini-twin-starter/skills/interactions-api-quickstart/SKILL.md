---
name: interactions-api-quickstart
description: Current-SDK Google GenAI Interactions API quickstart blueprints (@google/genai v2.32+ TypeScript & google-genai v2.34+ Python) with Search Grounding, automatic continuation, and Flash vs Argon model routing.
---

# Google GenAI Interactions API Quickstart (Current SDK)

Use this skill whenever writing TypeScript or Python code against the Google Gemini API so you always generate modern **Interactions API** (`client.interactions.create`) code rather than legacy patterns.

## 1. Model Routing Cheat-Sheet
- **`gemini-3.8-flash`** (`$0.75 / $3.75` per 1M tokens): Fast UI loops, Computer Use GA, moderation, classification, and high-frequency agent tools.
- **`gemini-4-argon`** (`$2.00 / $10.00` per 1M tokens, `$0.10/1M` cached input): Deep multi-file software architecture, 1,048,576-token context, and Long Decode (`automatic_continuation: true`).
- **`gemini-3.8-flash-tts`**: Natural 24kHz WAV voiceover synthesis (`[style: energetic, conversational]`).
- **`gemini-nano-banana-2.1`**: 1K/2K/4K grounded visual & infographic generation.
- **`gemini-omni-1.1-flash`**: Conversational video generation, editing & clip extension.

## 2. TypeScript (`@google/genai` v2.32+) — Search-Grounded + Auto-Continuation

```typescript
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const interaction = await client.interactions.create({
  model: 'gemini-4-argon',
  input: 'Compare Cloud Firestore vs relational SQL joins for a real-time developer portal.',
  tools: [{ type: 'google_search' }],
  automatic_continuation: true,
});

console.log(interaction.outputs);
```

## 3. Python (`google-genai` v2.34+)

```python
import os
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input="Verify the latest Google GenAI SDK version using Google Search.",
    tools=[{"type": "google_search"}],
    automatic_continuation=True,
)

print(interaction.outputs)
```
