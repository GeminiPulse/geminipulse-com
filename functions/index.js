const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { GoogleGenAI } = require("@google/genai");
const admin = require("firebase-admin");

admin.initializeApp();

// Initialize the Gemini API client 
// (Requires GEMINI_API_KEY to be set in Firebase secret manager or env)
const ai = new GoogleGenAI({});

exports.moderateForumPost = onDocumentCreated("forum_threads/{threadId}", async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    const data = snapshot.data();
    const contentToModerate = `Title: ${data.title}\n\nTags: ${data.tags?.join(', ')}`;

    try {
        const prompt = `
      You are an expert AI community moderator for 'GeminiPulse'.
      Review the following forum post content. State 'APPROVE' if it is a valid, 
      helpful, or neutral discussion about AI, code, or Google Gemini.
      State 'REJECT' if it contains spam, hate speech, or completely irrelevant 
      solicitation.
      
      Post Content:
      ${contentToModerate}
    `;

        // Use Gemini 1.5 Flash for fast, low-cost moderation
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });

        const decision = response.text.trim().toUpperCase();

        if (decision.includes('REJECT')) {
            console.log(`[Moderation] Post ${event.params.threadId} rejected by AI.`);
            // Flag the post in the database
            return snapshot.ref.update({
                isFlagged: true,
                moderationReason: 'AI Auto-Moderation: Content violates community guidelines.'
            });
        }

        console.log(`[Moderation] Post ${event.params.threadId} approved.`);
        return snapshot.ref.update({ isFlagged: false });

    } catch (error) {
        console.error("Error during AI moderation:", error);
        return null; // Fail open
    }
});

exports.autonomousNewsGenerator = onSchedule("every 12 hours", async (event) => {
    try {
        const prompt = `
      Act as the lead technical writer for 'GeminiPulse'.
      Write a short, engaging, 1-paragraph news article about a fictional but plausible 
      recent update to the Google Gemini ecosystem (e.g. higher context window, new 
      vision capabilities, agentic IDE integration). 
      Format the output in strict JSON:
      {
        "title": "Headline",
        "summary": "1 paragraph summary",
        "tag": "Release" or "Feature" or "Community"
      }
    `;

        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro',
            contents: prompt,
        });

        // Parse the JSON response
        const jsonStr = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const articleData = JSON.parse(jsonStr);

        // Add metadata
        articleData.date = new Date().toISOString();
        articleData.link = "#";

        // Save to Firestore pulse_feed
        await admin.firestore().collection('pulse_feed').add(articleData);
        console.log(`[Auto-Writer] Successfully generated and published article: ${articleData.title}`);

    } catch (error) {
        console.error("Error during autonomous news generation:", error);
    }
});
