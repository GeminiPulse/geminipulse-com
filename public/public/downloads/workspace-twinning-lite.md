# Google Workspace Everyday `(T)winning` Pack — Lite Edition (Free)

**Published by:** [GeminiPulse.com](https://geminipulse.com/#addons)  
**Built for:** Everyday "Joes & Jills", Founders, Operators, Marketers & Agile Teams  
**Stack:** Google Workspace with Gemini (Gmail, Docs, Sheets, Slides, Meet) + Google NotebookLM

---

## Part 1: 10 Copy-Paste Gemini Side-Panel Prompts That Save 5+ Hours/Week

### Gmail (Inbox Triage & Executive Replies)
1. **3-Bullet Thread Decoder:**  
   `Summarize this thread into: (1) What has already been decided, (2) What is waiting on me, and (3) Any deadline mentioned.`
2. **Polite Scope-Boundary Reply:**  
   `Draft a warm, 4-sentence reply confirming we can deliver Phase 1 by Friday, while noting the new custom reporting request belongs in Phase 2.`

### Google Docs (`@File` Grounded Writing)
3. **Discovery Notes → Clean Proposal:**  
   `Using @[Discovery Call Notes], draft a 1-page client proposal with Goals, Deliverables Table, Timeline, and Assumptions.`
4. **Jargon-to-Human Translator ("Rosetta Stone" Pass):**  
   `Rewrite the highlighted technical section so a non-technical small-business owner understands the exact business benefit in 30 seconds.`

### Google Sheets (Formulas & Cleanup Without Guesswork)
5. **Bulletproof `XLOOKUP` Builder:**  
   `Write an XLOOKUP formula matching Column A emails to the "Customers" tab Column C plan tier, returning "Free Tier" if not found, and explain each part.`
6. **Messy CSV Normalizer:**  
   `Give me a single Google Sheets formula to strip extra spaces, Title-Case names in Column B, and extract the domain name from email addresses in Column C.`

### Google Slides & Meet
7. **Doc-to-8-Slide Storyboard:**  
   `Turn @[Quarterly Plan] into an 8-slide executive outline with max 3 punchy bullets per slide and a suggested visual diagram for each.`
8. **Google Meet Action-Item Extractor:**  
   `From this meeting transcript, list every action item as: Owner | Concrete Deliverable | Due Date.`

### Google NotebookLM (`notebooklm.google` — Free Zero-Hallucination Research)
9. **Commute Audio Briefing:**  
   Upload 5–20 PDFs, competitor docs, or YouTube links into a NotebookLM notebook and click **Audio Overview**—then use **Interactive Mode** to ask follow-up questions out loud.
10. **Contradiction & Gap Finder:**  
    `Across all uploaded sources in this notebook, where do two documents disagree on pricing, dates, or assumptions? Cite each exact passage.`

---

## Part 2: 2 Copy-Paste Google Apps Script Automations (Zero Coding Experience Needed)

Open any Google Sheet → **Extensions → Apps Script**, paste either snippet, and click **Run**:

### Helper #1: Auto-Log Starred "Action Needed" Gmail Threads into a Google Sheet
```javascript
function syncStarredThreadsToSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Date', 'From', 'Subject', 'Thread Link']);
  }
  const threads = GmailApp.search('is:starred newer_than:7d', 0, 25);
  threads.forEach((thread) => {
    const msg = thread.getMessages()[0];
    sheet.appendRow([
      msg.getDate(),
      msg.getFrom(),
      thread.getFirstMessageSubject(),
      thread.getPermalink(),
    ]);
  });
}
```

### Helper #2: One-Click Weekly Client Status Doc Generator from Sheet Rows
```javascript
function createWeeklyStatusDoc() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();
  const today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const doc = DocumentApp.create('Weekly Pulse Status — ' + today);
  const body = doc.getBody();
  body.appendParagraph('Weekly Project Pulse (' + today + ')').setHeading(DocumentApp.ParagraphHeading.HEADING1);
  rows.slice(1).forEach((row) => {
    if (row[0]) body.appendListItem(row.join(' — '));
  });
  Logger.log('Created Google Doc: ' + doc.getUrl());
}
```

---

## Need Google Workspace with Gemini for Your Domain? (10% First-Year Reader Perk)

- **Official Google Workspace Trial & Referral Link:** [Start Google Workspace with Gemini](https://sharegoogleworkspace.advocate.impact.com/mzYYGz3) *(Referral disclosure: GeminiPulse is a Google Workspace Referral Partner and may earn a commission at no extra cost to you).*
- **Want a Single-Use 10% First-Year Promo Code?** Visit **[GeminiPulse.com/#get-started](https://geminipulse.com/#get-started)** and click **"Request 10% Promo Code →"** so we can send you an unburned single-use Business Starter, Standard, or Plus code.
- **Want the Full 50-Workflow Pro Department Playbook + Arena Eval Packs?** Unlock **Pro Insider (\$9/mo)** anytime at **[GeminiPulse.com/#addons](https://geminipulse.com/#addons)**.
