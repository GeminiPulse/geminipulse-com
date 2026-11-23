# Gemini quota timeline: Nov 13, 2026

Sheet (opens in Numbers or Excel): [gemini_quota_log.csv](./gemini-quota-log.csv)

> [!NOTE]
> Uploaded copies don't keep their timestamps. I got the capture times by matching each upload to its original original macOS timestamped screenshot file by pixel size. The two JPGs were resized, so I matched those by aspect ratio. I also added 3 related screenshots that you didn't upload (4:11, 6:19:26 and 6:19:49) because they help explain what happened. "Implied reset" = capture time + the countdown. The panel rounds to the minute, so these are ±1 min.

| Time | Weekly % | Weekly countdown → reset | 5-hr % | 5-hr countdown → reset |
|---|---|---|---|---|
| 4:11:38 PM* | 69 | 3h13m → **~7:25 PM** | 85 | 1h34m → **~5:46 PM** |
| 5:37:50 PM | 59 | 1h47m → ~7:25 PM | 42 | 8m → ~5:46 PM |
| 5:41:00 PM | 58 | 1h44m → ~7:25 PM | 36 | 4m → ~5:45 PM |
| 5:45:08 PM | 55 | 1h41m → ~7:26 PM | 27 | 1m → ~5:46 PM |
| 5:45:53 PM | 55 | 1h40m → ~7:26 PM | 23 | <1m → ~5:46 PM |
| 6:00:11 PM | 42 | 1h25m → ~7:25 PM | **54** | 4h45m → **~10:45 PM** |
| 6:11:24 PM | **84** | **6d23h** → Nov 20 | 35 | 4h40m → **~10:51 PM** |
| 6:13:31 PM | 82 | 6d23h | 26 | 4h38m → ~10:51 PM |
| 6:17:24 PM | 77 | 6d23h | 8 | 4h34m → ~10:51 PM |
| 6:19:07 PM* | - | - | **BLOCKED** | "Resets in 4h32m30s" → **10:51:40 PM** |
| 6:19:26 PM* | 77 | 6d23h | 8 | 4h34m (frozen) |

\* = not uploaded, taken from local timestamped screenshots or the error in this chat.

## What's wrong (the pattern)

1. **You got blocked while the panel still showed 8% left.** At 6:19:07 this chat failed with "Individual quota reached". The 6:19:26 panel still showed **8%**, with exactly the same numbers and countdown as at 6:17:24, two minutes earlier. So the panel was showing stale data, or the cutoff happens before 0%, or both. You can't trust it near the bottom.

2. **The weekly limit reset about 90 minutes early, and the new week didn't start at 100%.** From 4:11 to 6:00, all six countdowns point to the same weekly reset at **~7:25 PM**. Between 6:00 and 6:11 the panel switched to a new 7-day window. By 6:11 it already showed 84%.

3. **The 5-hour deadline moved after the window reset.** The old window ended on time at ~5:46. At 6:00 the new window was due to end at **~10:45**. By 6:11 that had moved to **~10:51**, and the error message confirms **10:51:40 PM**. Counting back 5h and 7d from that gives a start of **~5:51:40 PM** for both windows. That matches the weekly countdown too. So it looks like both windows were re-anchored to the same backdated start when the weekly one rolled over.

4. **A fresh 5-hour window lasted about 25 minutes.** After resetting to 100% at ~5:46, it was down to 54% by 6:00. Using the 5:51:40 start, it went 100 → 8% in about 26 min. You burned 5-hr quota faster as the evening went on:

   | Interval | 5-hr pts/min |
   |---|---|
   | 4:11 → 5:37 | 0.5 |
   | 5:37 → 5:45 | ~2.3 |
   | 5:46 → 6:00 | 3.3 |
   | 6:11 → 6:17 | 4.5 |

   This lines up with running many agent conversations in parallel.

5. **The weekly limit is only about 4 full 5-hour windows.** In every interval, using **~4 points of the 5-hr bar costs ~1 point of the weekly bar** (measured 3.5-4.75, average ~4.1). So a full 5-hr window costs about **25% of your week**. That means:
   - The weekly limit allows only **~4 full 5-hour windows per week**.
   - Whichever limit you're using, at your current pace that's roughly **1.5-2 hours of heavy use per week**.

## Things to report to Google

- Error ID `fb8e3453-6aef-4c5f-8f08-5770a6a66356-1` (6:19:07 PM, panel showed 8%).
- The weekly countdown pointed to 7:25 PM, but the reset happened by 6:11 PM, and the new week started at 84%.
- The 5-hr reset time moved from 10:45 to 10:51:40 PM after the window had already started.
