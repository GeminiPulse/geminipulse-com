/**
 * GeminiPulse.com — Autonomous Google Cloud Functions (2nd Gen)
 * Powered 100% by the Google Gemini Interactions API (@google/genai) & Cloud Firestore.
 *
 * Models used:
 * - gemini-4-argon: Frontier architectural synthesis & deep technical analysis
 * - gemini-3.8-flash: Fast, real-time moderation, curation, and Google Search grounding
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { GoogleGenAI } = require("@google/genai");
const admin = require("firebase-admin");

admin.initializeApp();

// Initialize the unified Google GenAI SDK
// Reads GEMINI_API_KEY from Google Cloud Secret Manager / environment
const ai = new GoogleGenAI({});

/**
 * 1. Forum AI Moderator & First-Responder Synthesis
 * Triggered whenever a new discussion thread is created in Cloud Firestore (`forum_threads/{threadId}`).
 * Uses `gemini-3.8-flash` via the Interactions API to:
 *  - Verify community safety & high-signal relevance
 *  - Generate an immediate "Gemini First-Responder" technical answer and starter code
 */
exports.moderateForumPost = onDocumentCreated("forum_threads/{threadId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return null;

  const data = snapshot.data();
  const threadText = `Title: ${data.title}\nBody: ${data.body || ""}\nTags: ${(data.tags || []).join(", ")}`;

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      system_instruction:
        "You are the Autonomous Community Moderator and Technical First-Responder for GeminiPulse.com. " +
        "Evaluate the forum post. Return valid JSON with keys: " +
        '"status" ("APPROVED" or "FLAGGED"), "reason" (short string), and "aiFirstResponse" (a concise, helpful 2-3 sentence technical tip or answer addressing the user\'s question using current Gemini 4 / 3.8 best practices).',
      input: threadText,
      response_format: {
        type: "object",
        properties: {
          status: { type: "string" },
          reason: { type: "string" },
          aiFirstResponse: { type: "string" },
        },
        required: ["status", "reason", "aiFirstResponse"],
      },
    });

    const result = JSON.parse(interaction.output_text);
    const isFlagged = result.status === "FLAGGED";

    return snapshot.ref.update({
      isFlagged,
      verifiedByGemini: !isFlagged,
      moderationModel: "gemini-3.8-flash",
      moderationReason: result.reason,
      aiFirstResponse: result.aiFirstResponse,
      moderatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GeminiPulse Moderator] Error moderating thread:", error);
    return null;
  }
});

/**
 * 2. "Built with Gemini" Product Showcase Curator
 * Triggered when a developer submits a new Gemini-powered project (`showcase_projects/{projectId}`).
 * Uses `gemini-3.8-flash` to analyze how the project uses Gemini models and assign structured capability badges.
 */
exports.curateShowcaseProject = onDocumentCreated("showcase_projects/{projectId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) return null;

  const project = snapshot.data();
  const submissionSummary = `Project Name: ${project.name}\nTagline: ${project.tagline}\nModels Used: ${(project.models || []).join(", ")}\nDescription: ${project.description || ""}`;

  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      system_instruction:
        "You are the Lead Architecture Curator for GeminiPulse.com's 'Built with Gemini' Showcase. " +
        "Review the submitted project and return JSON with: " +
        '"approved" (boolean), "architectureHighlight" (1 crisp sentence explaining what makes its use of Gemini compelling), and "recommendedCategory" ("Agents", "Multimodal", "Coding", "Voice & Live", or "Creative Media").',
      input: submissionSummary,
      response_format: {
        type: "object",
        properties: {
          approved: { type: "boolean" },
          architectureHighlight: { type: "string" },
          recommendedCategory: { type: "string" },
        },
        required: ["approved", "architectureHighlight", "recommendedCategory"],
      },
    });

    const review = JSON.parse(interaction.output_text);

    return snapshot.ref.update({
      verifiedByGemini: Boolean(review.approved),
      architectureHighlight: review.architectureHighlight,
      category: project.category || review.recommendedCategory,
      curatedByModel: "gemini-3.8-flash",
      curatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GeminiPulse Showcase Curator] Error reviewing submission:", error);
    return null;
  }
});

/**
 * 3. Scheduled Google Search-Grounded Intelligence Curator
 * Runs every 12 hours via Google Cloud Scheduler.
 * Uses `gemini-3.8-flash` with Grounding with Google Search (`{ type: 'google_search' }`)
 * to discover real, verified updates across blog.google, ai.google.dev, and deepmind.google,
 * then synthesizes a high-signal executive brief with `gemini-4-argon`.
 */
exports.autonomousNewsGenerator = onSchedule("every 12 hours", async () => {
  try {
    // Step 1: Search-grounded discovery using Google Search tool
    const searchInteraction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input:
        "Find the latest official Google Gemini API updates, model releases (Gemini 4, Gemini 3.8, Gemma 4, Omni, Nano Banana, Live API, Antigravity), or Google DeepMind announcements from the past week. Include exact titles, key technical facts, and source URLs.",
      tools: [{ type: "google_search" }],
    });

    // Step 2: Structured synthesis with Gemini 4 Argon
    const synthesisInteraction = await ai.interactions.create({
      model: "gemini-4-argon",
      system_instruction:
        "You are the Chief Intelligence Editor of GeminiPulse.com. Based strictly on the grounded search findings provided, produce a structured JSON news brief for developers.",
      input: searchInteraction.output_text,
      response_format: {
        type: "object",
        properties: {
          title: { type: "string" },
          tldr: { type: "string" },
          summary: { type: "string" },
          tag: { type: "string" },
          modelBadge: { type: "string" },
          sourceUrl: { type: "string" },
          sourceLabel: { type: "string" },
        },
        required: ["title", "tldr", "summary", "tag", "modelBadge", "sourceUrl", "sourceLabel"],
      },
    });

    const articleData = JSON.parse(synthesisInteraction.output_text);
    articleData.date = new Date().toISOString();
    articleData.authoredBy = "Gemini 4 Argon + Google Search Grounding";

    await admin.firestore().collection("pulse_feed").add(articleData);
    console.log(`[GeminiPulse Grounded Curator] Published verified update: ${articleData.title}`);
  } catch (error) {
    console.error("[GeminiPulse Grounded Curator] Error during scheduled run:", error);
  }
});
