# DRAFT: "I Tried to Use My Whole Week. The Week Ended Early."

*Draft for geminipulse.com, not yet published. Data: 30 timestamped screenshots of the Antigravity Models & Usage panel (Nov 10-13, 2026) plus server error messages. Full sheet: [gemini_quota_log.csv](./gemini-quota-log.csv)*

> [!NOTE]
> **Fun fact for the intro:** this post was supposed to be written by Gemini. But Gemini was locked out by the very quota problem this post is about, so Claude, running inside Antigravity, did the analysis and the draft. Make of that what you will.

---

## The setup

On a Google AI Ultra plan, Gemini in Antigravity has two usage limits:

- **A 5-hour limit** (a small gas tank that refills every 5 hours)
- **A weekly limit** (a big tank that refills once a week)

Every request takes gas out of **both tanks** at once.

I check the usage panel a lot: before chats, during them, after them. So when things look off, I have screenshots.

## What the week was supposed to look like

From **Tuesday Nov 10** through **Friday Nov 13 at 12:56 PM**, every screenshot I took pointed to the same weekly reset: **Friday, Nov 13, around 7:25 PM**. The countdown went 3 days → 2 days → 22 hours → 6 hours → 1 hour 40 minutes, always toward the same time.

By Friday afternoon I still had **74% of my week left**. It was use-it-or-lose-it, so I did what any paying customer would do. I opened a bunch of agent conversations and got to work.

## The plan

| Time (Fri) | Weekly left | Weekly resets in | 5-hr left | 5-hr resets in |
|---|---|---|---|---|
| 12:56 PM | 74% | 6h 28m | 99% | - |
| 4:11 PM | 69% | 3h 13m | 85% | 1h 34m |
| 5:45 PM | 55% | **1h 40m** | 23% | <1 min |

At 5:46 PM my 5-hour tank refilled to 100%. I still had **55% of the week** and **1 hour 40 minutes** before it expired.

The math was simple. Across every day of data, emptying a full 5-hour tank costs **about 25% of the weekly tank**. So I could burn a whole fresh 5-hour window and **still** have about 30% of the week left to throw away at 7:25. Nothing I did in that window should have touched next week.

## What actually happened

| Time (Fri) | Weekly left | Weekly resets in | 5-hr left | 5-hr resets in |
|---|---|---|---|---|
| 6:00 PM | 42% | 1h 25m (→ 7:25 PM) | 54% | 4h 45m (→ 10:45 PM) |
| **6:11 PM** | **84%** | **6 days, 23 hours** | 35% | 4h 40m (→ **10:51 PM**) |
| 6:17 PM | 77% | 6d 23h | 8% | 4h 34m |
| 6:19 PM | - | - | **BLOCKED** | "Resets in 4h32m32s" |
| 6:20 PM | 74% | - | 0% | 4h 31m |

Here's what went wrong:

1. **The week ended about 93 minutes early.** At 6:00 PM the panel still said 7:25 PM. Eleven minutes later, a brand-new 7-day week had started.
2. **The new week was backdated.** Working back from the new countdowns and the exact time in the server's error message (10:51:39 PM), both new windows start at **5:51:39 PM**. But at 6:00 PM the panel was still showing the *old* week. The switch was made after the fact.
3. **My usage was charged to next week.** The old week had **42% left**, and that was simply thrown away. Everything I ran after 5:52 came out of the *new* week instead. **26% of next week was gone in about 28 minutes**, spent on work the old week had more than enough room to cover.
4. **The 5-hour finish line moved later.** At 6:00 the window ended at 10:45 PM. By 6:11 it ended at 10:51 PM. That's six extra minutes of waiting I never agreed to.

Bonus: the panel doesn't update by itself. It still showed **8%** a full minute after the server had cut me off. It only showed 0% after I clicked refresh. So if you're managing your time by watching that gauge, you're working from old numbers.

## Why this matters, even if it's "only" a few percent

Do the money math and 26% of a week sounds small. Spread across the month, it's a few dollars of the subscription. But that's not the real cost. The real cost is **running out sooner** later in the week, when you're in the middle of a project and need it. I pay for Claude, ChatGPT and Gemini, and I budget my work around each one's limits. A limit I can plan around is fine. A limit whose finish line moves isn't something you can plan around.

## Glitch or design?

I honestly don't know, and I'd love for it to be a glitch. Here's what the data does and doesn't show:

- ✅ The weekly reset time was **stable for three days**, then the reset came **93 minutes early**.
- ✅ The new windows were **backdated** to a time when the panel still showed the old week.
- ✅ Every one of these changes worked against the user, not for them.
- ❓ One evening isn't proof of a pattern. I've *felt* this before ("5 days left" on Tuesday, "6 days left" on Wednesday), but this is the first time I've documented it end to end.

**Google, if you're reading this:** I'd love an explanation, and I'd love those 26 points back. The error ID is below.

**Readers:** if you've seen your Gemini weekly limit jump, reset early, or move its countdown, send me screenshots *with timestamps*. If this is a pattern, a pile of evidence will show it.

---

## Appendix: short email to Google support

> **Subject:** Antigravity weekly quota reset early and was backdated - Error ID fb8e3453-6aef-4c5f-8f08-5770a6a66356-1
>
> Hi,
>
> On Fri Nov 13, 2026 (Google AI Ultra, Antigravity), my Gemini weekly limit reset about 93 minutes before the time shown in Models & Usage.
>
> - From Nov 10 to Nov 13 at 6:00 PM ET, the panel consistently showed a weekly reset at about 7:25 PM ET on Nov 13. At 6:00 PM it showed 42% remaining with 1h25m left.
> - At 6:11 PM it showed a new week (6d 23h) already at 84%. Both the new weekly and 5-hour windows appear to start at 5:51:39 PM ET, which is earlier than the 6:00 PM reading that still showed the old week.
> - The 5-hour reset moved from about 10:45 PM to 10:51:39 PM after that window had already started.
> - Result: 42% of the old week was forfeited, and 26% of the new week was used by 6:20 PM. Error "Individual quota reached" at 6:19:07 PM ET (ID above).
>
> Please explain the early reset and restore the usage that was charged to the new week. I have timestamped screenshots if you need them.
>
> Thanks,
> Neil White
