# GeminiPulse.com — 3-Minute Read-Only GA4 & Search Console Setup Guide

- **Target GCP / Firebase Project:** `geminipulse-com` (`643794480842`)
- **Target GA4 Stream:** `G-1BWMQWZJQ5` (`https://geminipulse.com`)
- **Target Search Console Property:** `sc-domain:geminipulse.com` (or `https://geminipulse.com/`)
- **Recurring Monthly Cost:** **`$0.00/mo`** (all three Google APIs operate strictly within standard free read quotas; no Firebase Blaze upgrade required)
- **Consumer Script:** [`public/scripts/pull-daily-analytics.mjs`](../public/scripts/pull-daily-analytics.mjs) (`cd public && npm run telemetry:pull`)

---

## Why This Architecture Exists (Least-Privilege & Zero Repo Secrets)

Sitewide client telemetry (`pulse-analytics.js` -> `G-1BWMQWZJQ5`) records real human visits, outbound UTM campaigns (`post_001_neon_gauntlet`), active reading dwell (`engaged_read` at `15s`/`45s`/`120s`), scroll depth (`50%`/`90%`), and authoring provenance (`authored_model`, `thinking_effort`, `content_surface`), while automatically suppressing `HeadlessChrome` and `Lighthouse` synthetic runs.

To let Gemini pull real visitor numbers, channel conversion funnels, and Model × Effort ROI tables into [`docs/daily-telemetry-report.md`](./daily-telemetry-report.md) without ever touching project secrets or write permissions:
1. The service account holds **zero GCP IAM roles** (cannot read Firestore, Hosting, Storage, or Billing).
2. The JSON key lives **outside the repository** at `~/.config/geminipulse/analytics-reader.json` (`0600` permissions; additionally blocked in [`.gitignore`](../.gitignore)).
3. `pull-daily-analytics.mjs` signs short-lived `RS256` OAuth2 tokens using Node 22's built-in `node:crypto` module (**zero npm dependencies**).

---

## Step 1: Enable the 3 Free Read-Only APIs (`~30 seconds` · `$0.00/mo`)

Enable **Google Analytics Data API**, **Google Analytics Admin API** (used once to auto-discover and cache the numeric GA4 Property ID for `G-1BWMQWZJQ5`), and **Google Search Console API** in project `geminipulse-com` (`643794480842`):

### Option A — One-Line `gcloud` Command
```bash
gcloud services enable \
  analyticsdata.googleapis.com \
  analyticsadmin.googleapis.com \
  searchconsole.googleapis.com \
  --project=geminipulse-com
```

### Option B — Direct Google Cloud Console Links
1. [Enable Google Analytics Data API (`geminipulse-com`)](https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com?project=geminipulse-com)
2. [Enable Google Analytics Admin API (`geminipulse-com`)](https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=geminipulse-com)
3. [Enable Google Search Console API (`geminipulse-com`)](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com?project=geminipulse-com)

---

## Step 2: Create a Zero-Role Service Account & Local JSON Key (`~60 seconds`)

Create a dedicated service account with **no GCP IAM project roles** and store its JSON key at `~/.config/geminipulse/analytics-reader.json`:

### Option A — Copy-Paste Terminal Block
```bash
mkdir -p ~/.config/geminipulse && chmod 700 ~/.config/geminipulse

gcloud iam service-accounts create analytics-reader \
  --display-name="GeminiPulse Read-Only Analytics & GSC Puller" \
  --project=geminipulse-com

SA_EMAIL="$(gcloud iam service-accounts list \
  --project=geminipulse-com \
  --filter='displayName:GeminiPulse Read-Only Analytics' \
  --format='value(email)')"

gcloud iam service-accounts keys create ~/.config/geminipulse/analytics-reader.json \
  --iam-account="$SA_EMAIL" \
  --project=geminipulse-com

chmod 600 ~/.config/geminipulse/analytics-reader.json
echo "Copy this client_email for Steps 3 & 4: $SA_EMAIL"
```

### Option B — Cloud Console UI
1. Open [IAM & Admin -> Service Accounts (`geminipulse-com`)](https://console.cloud.google.com/iam-admin/serviceaccounts?project=geminipulse-com) -> **+ Create Service Account**.
2. Name it `analytics-reader`, skip **Grant this service account access to project** (leave roles empty), and click **Done**.
3. Open the new service account -> **Keys** tab -> **Add Key** -> **Create new key** -> **JSON**.
4. Move the downloaded file to `~/.config/geminipulse/analytics-reader.json` and lock permissions:
   ```bash
   mkdir -p ~/.config/geminipulse && chmod 700 ~/.config/geminipulse
   mv ~/Downloads/geminipulse-com-*.json ~/.config/geminipulse/analytics-reader.json
   chmod 600 ~/.config/geminipulse/analytics-reader.json
   ```
5. Print the `client_email` to paste into GA4 and Search Console:
   ```bash
   node -e "const fs=require('node:fs'),os=require('node:os'),p=require('node:path');console.log(JSON.parse(fs.readFileSync(p.join(os.homedir(),'.config/geminipulse/analytics-reader.json'),'utf8')).client_email)"
   ```

---

## Step 3: Grant GA4 `Viewer` Access + Register the 3 Provenance Custom Dimensions (`~60 seconds`)

1. Open [Google Analytics](https://analytics.google.com/) and select the **GeminiPulse** property (`Measurement ID: G-1BWMQWZJQ5`).
2. **Grant Read-Only Viewer Access:**
   - Go to **Admin** (bottom-left gear) -> **Property** -> **Property access management**.
   - Click **+** (**Add users**), paste the service account `client_email`, select the **`Viewer`** role (uncheck *"Notify new users by email"*), and click **Add**.
3. **Register the 3 Event-Scoped Custom Dimensions** so both GA4 UI Explorations and the GA4 Data API slice human engagement by Gemini model and thinking effort permanently:
   - Go to **Admin** -> **Data display** -> **Custom definitions** -> **Create custom dimension** and add these three entries:

| Dimension Name | Scope | Description | Event Parameter (Exact Match) |
| :--- | :---: | :--- | :--- |
| `Authored Model` | **Event** | Gemini model that authored the page/artifact (`gemini-4-carbon`, `gemini-4-argon`, `gemini-4-neon`) | `authored_model` |
| `Thinking Effort` | **Event** | Reasoning tier (`low`, `medium`, `high`, `xhigh`) | `thinking_effort` |
| `Content Surface` | **Event** | Page surface (`constellation_home`, `flagship_essay`, `empirical_arena`, `interactive_lab`, `release_series`, `workbench_spa`) | `content_surface` |

> [!NOTE]
> GA4 takes **24–48 hours** to backfill newly registered custom dimensions into Data API queries. During that warmup window, `pull-daily-analytics.mjs` automatically detects empty custom dimensions and falls back to mapping `pagePath` against `CONSTELLATION_ESSAYS` and static surface routes so Model × Effort dwell telemetry works on Day 1.

---

## Step 4: Grant Search Console `Restricted` Access & Verify Live Pull (`~30 seconds`)

1. Open [Google Search Console](https://search.google.com/search-console) and select `geminipulse.com`.
2. Go to **Settings** (bottom-left) -> **Users and permissions** -> **Add user**.
3. Paste the same service account `client_email`, select **`Restricted`** permission (strictly read-only), and click **Add**.
4. **Run the Telemetry Puller:**
   ```bash
   cd public && npm run telemetry:pull
   ```

### Expected Output on First Authenticated Run
- Auto-discovers the numeric GA4 Property ID matching `G-1BWMQWZJQ5` and caches it in `~/.config/geminipulse/analytics-config.json` (`0600`).
- Updates Section `00` (`<!-- LIVE-ANALYTICS-PULSE-START --> ... <!-- LIVE-ANALYTICS-PULSE-END -->`) at the top of [`docs/daily-telemetry-report.md`](./daily-telemetry-report.md) with:
  1. **24h / 7d / 28d Human Traffic Baseline** (with explicit cold-start/zero-traffic calibration),
  2. **Channel & Post #001 UTM Campaign Funnel** (`x`, `linkedin`, `linkedin_neil`, `youtube_shorts`, `google / organic`, `direct`),
  3. **Model × Thinking Effort Efficiency Matrix** + concrete **Editorial Takeaway for Today's Curation**, and
  4. **7-Day Google Search Console Queries & Landing Pages**.

### Optional Overrides (`~/.config/geminipulse/analytics-config.json`)
If you ever manage multiple GA4 streams or Search Console URL-prefix properties, you can pin them explicitly in `~/.config/geminipulse/analytics-config.json`:
```json
{
  "ga4PropertyId": "123456789",
  "ga4MeasurementId": "G-1BWMQWZJQ5",
  "gscSiteUrl": "sc-domain:geminipulse.com"
}
```
