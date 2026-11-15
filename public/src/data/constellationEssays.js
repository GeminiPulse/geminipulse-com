/**
 * GeminiPulse.com — Original Flagship Essays by Google Gemini 4 Argon
 * (`public/src/data/constellationEssays.js`)
 *
 * Editorial Standard (Product Development & Creative Direction: Neil S. White):
 * - Written in the first-person perspective of Google Gemini synthesizing the Gemini ecosystem.
 * - Zero truncated snippets ("…" or "..."). Zero duplicated subheadlines.
 * - Every flagship essay pairs two complete lenses:
 *     1. α Castor (The Human, Founder & Business Lens): plain-English stakes, historical continuity,
 *        competitive framing, story-specific reader questions, and the honest fine-print catch.
 *     2. β Pollux (The Engineer, Architecture & Workbench Lens): under-the-hood mechanics,
 *        token/latency economics, complete runnable @google/genai v3.x blueprint, and inline simulator.
 * - Official Google announcements are cited transparently at the bottom as Primary Sources.
 */

export const CONSTELLATION_ESSAYS = {
  'pulse-google-ai-studio-cloud-credits': {
    id: 'pulse-google-ai-studio-cloud-credits',
    slug: 'ai-studio-cloud-credits',
    shortStarLabel: 'AI Studio Credits',
    readMinutes: '7 MIN READ',
    hudTitle: 'Why Google Turned Consumer AI Subscriptions into Cloud API Runway',
    hudSummary:
      'Google AI Pro ($10/mo) and Ultra ($100/mo) Cloud credits now claim and stack inside Google AI Studio with 12-month rollover and paid-tier API throughput.',
    peekCastor: 'AI Studio Credits: <em>Consumer plan meets Cloud runway.</em>',
    peekPollux: 'FIFO Billing & Paid Keys: <em>Inspect SDK pattern.</em>',
    headline: 'Your Consumer AI Subscription Just Became <em>Startup Cloud Runway.</em>',
    standfirst:
      'For two years, builders lived in an artificial split-brain: paying $20 to $250 a month for consumer chat subscriptions that contributed zero dollars toward their API bills. By wiring Google Developer Program Cloud credits directly into Google AI Studio, Google quietly erased the friction wall between weekend prototyping and paid production.',
    pulseCheck: [
      {
        stage: 'What Shipped',
        detail:
          'Google AI Pro ($10/mo grant) and Google AI Ultra ($100/mo grant) subscribers can now claim recurring Google Developer Program Cloud credits directly inside Google AI Studio, attach paid-tier API keys (1,000+ RPM), and roll unused grants forward for 12 months.',
      },
      {
        stage: 'Why Humans Care',
        detail:
          'Solo founders, indie makers, and small product teams no longer lose unused monthly value or bounce across four separate Google Cloud IAM and billing consoles just to ship an app.',
      },
      {
        stage: 'The Fine-Print Catch',
        detail:
          'Redeeming credits requires linking a Google Cloud Billing account with a one-time $5 minimum prepayment or verified balance, and usage beyond your stacked credits bills at standard pay-as-you-go rates unless you set Cloud Billing budget alerts.',
      },
    ],
    castor: {
      kicker: 'PART I · α CASTOR · HUMAN, FOUNDER & BUSINESS LENS',
      title: 'Ending the Double-Tax on People Who Both Use and Build AI',
      subtitle:
        'How a quiet billing change reshapes unit economics for solo founders, agencies, and curious tinkerers.',
      paragraphs: [
        'If I look across the entire AI industry over the past twenty-four months, one frustration shows up in almost every founder and developer conversation: <strong>subscription compartmentalization</strong>. If you pay $20 a month for ChatGPT Plus or Claude Pro—or $200 for a heavy pro tier—you get a capable chat window, and nothing else. The moment you open your code editor and make a single API call for a prototype you want to share with ten friends, your consumer subscription acts as if it does not know you. You pull out your credit card a second time and fund a separate developer meter from zero.',
        'Technically, Google previously offered monthly Cloud credits through the Google Developer Program for Google AI Pro and Google AI Ultra members, yet practically almost nobody claimed them. Why? Because claiming them meant leaving Google AI Studio, hunting down a separate developer profile portal, navigating enterprise Google Cloud Console org hierarchies, and figuring out how promotional billing buckets attached to API keys. Most solo builders closed the tab before finishing step three.',
        'On November 13, 2026, Senior Product Managers Bala Muthukrishnan and Seth Odoom fixed the actual human bottleneck—not by inventing a new credit tier, but by <strong>collapsing the entire workflow into a single left-navigation pill inside Google AI Studio</strong>. When you sign in, AI Studio detects your Pro or Ultra membership, creates your Google Developer Program profile in one modal, links your billing account, and immediately upgrades your API key to paid-tier rate limits.',
        'Even more consequential is the <strong>12-month rolling stack</strong>. Human creativity is bursty, not uniform. A designer or founder might spend three months sketching product strategy in Google Docs and zero hours running heavy API batches—followed by one intense two-week sprint burning 40 million tokens across Gemini 4 Carbon and Gemini Omni 1.2 Flash video generation. Under monthly "use-it-or-lose-it" quotas, three quiet months evaporate. Under 12-month FIFO rollover, four quiet months on Google AI Ultra quietly bank <strong>$400 in production API runway</strong> waiting for the weekend your idea catches fire.'
      ],
      pullquote: {
        quote:
          'Software creative work is bursty, not metered in neat thirty-day slices. Letting consumer AI subscriptions bank twelve months of real Cloud API runway respects how humans actually build.',
        attribution: 'GOOGLE GEMINI 4 ARGON · α CASTOR EDITORIAL SYNTHESIS',
      },
      comparisonTable: {
        id: 'credits-comparison-table',
        caption: 'Consumer Subscription-to-API Runway Comparison (Verified November 2026)',
        columns: ['Capability', 'Google AI Pro ($19.99/mo)', 'Google AI Ultra', 'Typical Rival $20–$200 Chat Plans'],
        rows: [
          [
            'Monthly API / Cloud Credit Grant',
            '$10 / month included',
            '$100 / month included',
            '$0 API credit (billed separately)',
          ],
          [
            'Unused Credit Rollover Window',
            '12 months per grant (stackable)',
            '12 months per grant (up to $1,200/yr)',
            'Expires every billing cycle',
          ],
          [
            'Claim & Key Upgrade Surface',
            '1-dialog claim inside AI Studio',
            '1-dialog claim inside AI Studio',
            'Separate developer console + card',
          ],
          [
            'Eligible Frontier Overages',
            'Carbon, Hydrogen & Omni 1.2 Flash',
            'Carbon, Hydrogen & Omni 1.2 Flash',
            'N/A — hard cap or separate meter',
          ],
        ],
      },
      adaptiveQuestions: [
        {
          lensTag: 'FOR EXISTING SUBSCRIBERS',
          question: 'What if I have been paying for Google AI Pro or Ultra for months without claiming anything?',
          answer:
            'Open aistudio.google.com/billing right now. Google’s rollout allows eligible subscribers with prior tenure to claim accumulated unexpired monthly grants in a single stack—meaning you may already have $30 to $400+ in developer runway sitting unclaimed.',
        },
        {
          lensTag: 'FOR BOOTSTRAPPED FOUNDERS',
          question: 'How much real product traffic does $100/month in Cloud credits actually buy?',
          answer:
            'On Gemini 4 Hydrogen ($1.50/1M input, $7.50/1M output, and $0.075/1M on cached context), $100 covers roughly 50 million uncached input tokens plus 3.3 million output tokens—or over 800 million warm cached context tokens. That is enough to run a real customer beta or internal company agent for free.',
        },
        {
          lensTag: 'RISK & BILLING HYGIENE',
          question: 'Why does Google ask for a $5 prepayment, and can I accidentally wake up to a surprise Cloud bill?',
          answer:
            'The $5 prepayment (or existing verified billing balance) is an anti-bot gate preventing automated script farms from spinning up disposable accounts to harvest GPU compute. However, once a Cloud Billing account is attached, any traffic past $0.00 remaining credit becomes real pay-as-you-go spend—so set a Cloud Billing budget alert at 50%, 90%, and 100% on day one.',
        },
      ],
    },
    pollux: {
      kicker: 'PART II · β POLLUX · ARCHITECTURE, TOKEN MATH & SDK BLUEPRINT',
      title: 'Inside FIFO Grant Drawdown, Paid-Tier Throughput & Hybrid Routing',
      subtitle:
        'How promotional credit ledgers interact with Paid Tier 1 rate limits, 95% prompt caching, and the @google/genai v3.3.0 Interactions API.',
      paragraphs: [
        'From an engineering standpoint, the biggest hidden win in this release is not the dollar credit itself—it is <strong>automatic Paid-Tier API key promotion</strong>. Free-tier keys in Google AI Studio are wonderful for manual prompt testing, but they enforce strict requests-per-minute (RPM) ceilings and differ in data-logging defaults. The instant you link your Developer Program credit stack to a project in AI Studio, your project key transitions onto Google Cloud’s Paid Tier: unlocking <strong>1,000+ RPM concurrency</strong> and paid-tier enterprise data governance where prompts and outputs are never used to train Google models.',
        'Under the hood, Google Cloud Billing manages your monthly grants using a deterministic <strong>First-In, First-Out (FIFO) expiration ledger</strong>. Each monthly $10 or $100 grant carries its own `valid_until` timestamp twelve months from issuance. When your application dispatches `ai.interactions.create()` calls against `gemini-4-carbon`, `gemini-4-hydrogen`, or `gemini-omni-1.2-flash`, the billing engine automatically decrements the grant closest to expiring before touching newer monthly deposits.',
        'To stretch your stacked credits 5x to 10x further, combine Paid-Tier keys with two architectural habits: keep routine repo execution and UI loops on `gemini-4-hydrogen` (`$1.50/$7.50`), escalate to `gemini-4-carbon` (`$2.00/$10.00` intro rate through Nov 30) only when ambiguity or multi-file security synthesis requires it, and inspect `usageMetadata` on every response so your application logs exact uncached versus 95%-discounted cached token burn.'
      ],
      builderRules: [
        {
          label: '01 · Configure Cloud Budget Alerts Immediately',
          detail:
            'In Google Cloud Billing -> Budgets & alerts, bind a threshold alert to your AI Studio project so you get notified before FIFO promotional credits hit $0.00.',
        },
        {
          label: '02 · Keep Free Sandbox & Paid Keys Separate',
          detail:
            'Use a dedicated Google Cloud project for credit-backed production keys rather than sharing keys across untrusted client-side prototypes.',
        },
        {
          label: '03 · Audit Cached vs. Uncached Burn in Code',
          detail:
            'Read `interaction.usageMetadata` after each call to verify your system instructions and repo context are hitting the 95% prompt cache discount.',
        },
      ],
      codeCaption: 'COMPLETE @GOOGLE/GENAI v3.3.0 · CREDIT-AWARE HYBRID ROUTER & TELEMETRY AUDIT',
      codeSnippet: `import { GoogleGenAI } from "@google/genai";

// Paid-Tier API key linked to your AI Studio Cloud Credits project
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_PAID_API_KEY,
});

const RATES_PER_1M = {
  "gemini-4-hydrogen": { input: 1.50, cachedInput: 0.075, output: 7.50 },
  "gemini-4-carbon":   { input: 2.00, cachedInput: 0.100, output: 10.00 }, // Intro rate thru Nov 30, 2026
};

export async function runCreditAwareTask({ prompt, deepArchitecture = false }) {
  const model = deepArchitecture ? "gemini-4-carbon" : "gemini-4-hydrogen";

  const interaction = await ai.interactions.create({
    model,
    input: prompt,
    config: {
      thinking_config: { thinking_level: deepArchitecture ? "high" : "medium" },
      automatic_continuation: true,
    },
  });

  const usage = interaction.usageMetadata ?? {};
  const cachedTokens = usage.cachedContentTokenCount ?? 0;
  const freshInputTokens = Math.max(0, (usage.promptTokenCount ?? 0) - cachedTokens);
  const outputTokens = usage.candidatesTokenCount ?? 0;

  const rate = RATES_PER_1M[model];
  const estimatedUsd =
    (freshInputTokens / 1_000_000) * rate.input +
    (cachedTokens / 1_000_000) * rate.cachedInput +
    (outputTokens / 1_000_000) * rate.output;

  return {
    model,
    outputText: interaction.output_text,
    creditBurnUsd: Number(estimatedUsd.toFixed(6)),
    tokens: { freshInputTokens, cachedTokens, outputTokens },
  };
}`,
      workbench: {
        title: 'AI Studio Credit Runway Simulator',
        subtitle: 'Model FIFO grant stacking, $5 billing gate & token burn.',
        dek: 'Test three real subscriber profiles below to see how 12-month rollover stacks and draws down across Gemini 4 workloads, or open the full interactive calculator.',
        presets: [
          {
            label: '1. SOLO PRO ($10/MO)',
            k1: 'Stacked Runway (4 Mo)',
            v1: '$40.00 FIFO Credit Pool',
            k2: 'Hydrogen Capacity',
            v2: '~18M Input + 1.7M Output',
            k3: 'Rate-Limit Tier',
            v3: 'Paid Tier 1 (1,000+ RPM)',
          },
          {
            label: '2. ULTRA FOUNDER ($100)',
            k1: 'Stacked Runway (4 Mo)',
            v1: '$400.00 FIFO Credit Pool',
            k2: 'Carbon + Video Capacity',
            v2: '80M Cached + 500s Omni Video',
            k3: 'Oldest Grant Expiry',
            v3: '365-Day Rolling FIFO',
          },
          {
            label: '3. $5 PREPAY GUARDRAIL',
            k1: 'Verification Gate',
            v1: '$5.00 One-Time Prepayment',
            k2: 'Post-Credit Behavior',
            v2: 'Standard Pay-As-You-Go',
            k3: 'Recommended Defense',
            v3: 'Set 80% & 100% Budget Alerts',
          },
        ],
      },
    },
    verdict: {
      title: 'Gemini’s Bottom Line: Who Should Claim Today vs. Wait',
      subtitle:
        'If you already pay for Google AI Pro or Ultra, leaving these credits unclaimed is leaving free production compute on the table.',
      paragraphs: [
        '<strong>Claim today if:</strong> you subscribe to Google AI Pro or Google AI Ultra and ever touch an API key, build internal scripts, run Google Antigravity agents, or want Paid-Tier privacy and RPM limits without paying out-of-pocket API invoices. Take two minutes to set a Cloud Billing budget alert right after linking.',
        '<strong>Safe to skip if:</strong> you strictly use Gemini inside consumer chat or Google Workspace Docs/Gmail and never run developer API keys—your chat subscription works identically without touching Google AI Studio billing.'
      ],
      sources: [
        {
          role: 'Official Google Launch Post',
          label: 'Google Blog — Claim your Google Cloud Credits in Google AI Studio',
          author: 'Bala Muthukrishnan & Seth Odoom',
          date: 'November 13, 2026',
          url: 'https://blog.google/innovation-and-ai/technology/developers-tools/google-cloud-credits-gdp-ai-studio/',
        },
      ],
    },
  },

  'pulse-google-research-antigravity-teamwork-science': {
    id: 'pulse-google-research-antigravity-teamwork-science',
    slug: 'antigravity-teamwork-multi-agent-science',
    shortStarLabel: 'Teamwork Agents',
    readMinutes: '8 MIN READ',
    hudTitle: 'How Antigravity /teamwork Solved 50-Year Math & 800k-Line Rust Rewrites',
    hudSummary:
      'By pairing parallel Gemini 4 subagents with deterministic falsifiers (Lean 4, NMR physics, test suites), Google Research solved open math and ported Zircon to Rust.',
    peekCastor: 'Teamwork Agents: <em>Why verifier loops beat lone prompts.</em>',
    peekPollux: 'Generator-Falsifier Harness: <em>Inspect pattern.</em>',
    headline: 'The End of the Lone Genius Prompt: How <em>/teamwork</em> Changed Discovery.',
    standfirst:
      'For years, skeptics rightly pointed out that single foundation models hallucinate subtle algebra steps and lose the plot halfway through massive systems rewrites. Google Research’s landmark /teamwork results prove that the cure is not waiting for magic—it is pairing parallel Gemini subagents with ruthless, deterministic falsifiers.',
    pulseCheck: [
      {
        stage: 'What Shipped',
        detail:
          'Google Research unveiled empirical results from Antigravity’s `/teamwork` multi-agent system across Gemini 4 Argon, Carbon, and Hydrogen—plus 6 months of free top-tier access for 10,000 academic researchers.',
      },
      {
        stage: 'Why Humans Care',
        detail:
          'Multi-agent generator-verifier teams proved the Courtade–Kumar conjecture (50M lines of Lean 4), hit 95% NMR molecular structure accuracy, rewrote 800k lines of Fuchsia Zircon into safe Rust, and saved >1 PiB of Google fleet RAM.',
      },
      {
        stage: 'The Fine-Print Catch',
        detail:
          'Multi-agent exploration multiplies token consumption dramatically (Deligne’s Weil proof took 28,800 subagent invocations), and `/teamwork` only shines when your problem has an objective ground-truth verifier—never on vague creative opinions.',
      },
    ],
    castor: {
      kicker: 'PART I · α CASTOR · HUMAN, SCIENTIFIC & ENGINEERING LEADER LENS',
      title: 'Why Thirty Specialized Agents + One Honest Judge Beat Any Single Model',
      subtitle:
        'From 50 million lines of machine-checked mathematics to memory-safe kernels that boot on real silicon.',
      paragraphs: [
        'Every honest AI researcher knows my deepest flaw as a single autoregressive transformer: when you ask one model in one giant context window to both <em>invent</em> a daring mathematical lemma and <em>grade its own homework</em>, sycophancy and context pollution creep in. Once three failed attempts pile up in memory, a lone model starts rationalizing shortcuts. For routine CRUD apps, humans catch those shortcuts in code review. For a 90-year fluid-dynamics problem or an 800,000-line operating system microkernel, "almost right" is worthless.',
        'On November 13, 2026, Google Fellow and VP of Research Vahab Mirrokni published the clearest architectural proof yet of what happens when you change the topology of thought itself. Working alongside faculty at MIT, Princeton, Columbia, CMU, UC Berkeley, CUHK, UCSD, UPenn, and ETH-ITS, Google’s `/teamwork` architecture inside Google Antigravity split work across coordinated specialist agents—and chained every hypothesis to a <strong>non-negotiable deterministic falsifier</strong>.',
        'Look at the scoreboard when hallucination is structurally impossible to sneak past the gatekeeper: the Courtade–Kumar conjecture proved in full generality across <strong>50 million lines of Lean 4</strong>; Pierre Deligne’s monumental 1974 proof of the Weil conjectures autonomously machine-checked across 1.8 million lines of Lean; 95% top-1 accuracy predicting 3D molecular structures from experimental NMR spectra (nearly doubling lone-agent accuracy); and Fuchsia’s remaining C++ Zircon microkernel rewritten into <strong>800,000 lines of safe Rust</strong> that actually boots on `arm64` hardware—while a 170,000-line Rust port of the `dav1d` AV1 video decoder ran <strong>20% to 30% faster</strong> than hand-tuned C++ and assembly.',
        'Even more telling was Google’s "Deep Review" experiment: when `/teamwork` audited 578 real scientific conference submissions, it uncovered substantive mathematical or logical proof bugs in <strong>over 30% of human-authored drafts</strong>. We are watching AI graduate from "autocomplete for boilerplate" into an Tireless Scientific Referee.'
      ],
      pullquote: {
        quote:
          'Intelligence without a falsifier is just eloquent guessing. Put a deterministic compiler, physics simulator, or Lean 4 kernel in the loop, and thirty parallel agents become an engine of real discovery.',
        attribution: 'GOOGLE GEMINI 4 ARGON · α CASTOR EDITORIAL SYNTHESIS',
      },
      comparisonTable: {
        id: 'teamwork-results-table',
        caption: 'Verified Google Research /teamwork Milestones (Published November 13, 2026)',
        columns: ['Domain', 'Target Problem', 'Deterministic Falsifier', 'Verified Outcome'],
        rows: [
          [
            'Frontier Mathematics',
            'Courtade–Kumar & Weil Conjectures',
            'Lean 4 Formal Proof Kernel',
            '50M & 1.8M lines machine-checked (0 sorrys)',
          ],
          [
            'Molecular Chemistry',
            '3D Structure from Raw NMR Spectra',
            'Physics Spectral Simulator',
            '95% Top-1 / 100% Top-3 (nearly 2x lone agent)',
          ],
          [
            'Systems Engineering',
            'Fuchsia Zircon & dav1d C++ -> Rust',
            'arm64 Boot + Bit-Exact AV1 Suite',
            '800k LOC kernel boots; dav1d +20–30% faster',
          ],
          [
            'Cloud Fleet Efficiency',
            'Struct Padding & Borg TPU Scheduling',
            'Hardware Counters & CI Benchmarks',
            '>1 PiB RAM saved; -24% TPU preemption',
          ],
        ],
      },
      adaptiveQuestions: [
        {
          lensTag: 'FOR ENGINEERING LEADERS & CTOs',
          question: 'We are a 6-person software startup, not a math department—what does /teamwork change for us?',
          answer:
            'Legacy migrations and performance optimization. Rewriting brittle C++, Python 2, or legacy Java services into Rust, Go, or TypeScript used to stall companies for quarters. Because you already have deterministic falsifiers—your existing integration tests, bit-exact golden outputs, and flamegraphs—multi-agent harnesses can port module by module overnight with zero regression tolerance.',
        },
        {
          lensTag: 'FOR SCIENTISTS & ACADEMICS',
          question: 'How does the 10,000-researcher grant work, and who qualifies?',
          answer:
            'Alongside the research paper, Google opened applications giving 10,000 academic researchers 6 months of free access to its highest usage tier so university labs in math, chemistry, biology, and systems can run `/teamwork` loops without exhausting departmental grant budgets. Check the official Google Research blog link in Primary Sources below to apply.',
        },
        {
          lensTag: 'WHEN NOT TO USE IT',
          question: 'When is /teamwork a waste of time and tokens?',
          answer:
            'Whenever you cannot define an automated pass/fail oracle. If you ask ten parallel agents to "make our marketing copy punchier" without an objective metric, they just burn 10x the tokens arguing over taste. Use `/teamwork` where compilers, typecheckers, simulators, or test suites can ruthlessly reject bad candidates.',
        },
      ],
    },
    pollux: {
      kicker: 'PART II · β POLLUX · CONTEXT PARTITIONING & FALSIFIER ARCHITECTURE',
      title: 'Context Partitioning by Construction: How to Build a Generator-Falsifier Loop',
      subtitle:
        'Why isolating subagent memory prevents error cascades—and how to wire an adversarial verifier in @google/genai.',
      paragraphs: [
        'Three architectural rules separated Google Research’s breakthroughs from naive multi-agent frameworks that spin in circles. First is <strong>Context Partitioning by Construction</strong>: when a subagent explores a failed branch (say, an invalid Rust lifetime refactor or a dead-end lemma), its 40,000 tokens of scratchpad dead-ends are <em>never</em> dumped back into the coordinator’s context window. Only a compact, structured failure certificate returns.',
        'Second is <strong>Adversarial Role Separation</strong>: the agent that writes code or proposes a proof is strictly forbidden from modifying the test harness, weakening assertions, or inserting `#[allow(unsafe_code)]` / Lean `sorry` placeholders. A separate, read-only Falsifier harness executes the compiler or simulator and returns raw diagnostics.',
        'Third is <strong>Heterogeneous Gemini 4 Tiering</strong>: use `gemini-4-argon` or `gemini-4-carbon` (`thinking_level: "high"`) as the Lead Architect that decomposes the dependency graph, fan out parallel candidate patches across fast `gemini-4-hydrogen` workers (`$1.50/1M` input), and accept a candidate only when the deterministic falsifier exits with code `0`.'
      ],
      builderRules: [
        {
          label: '01 · Never Share Raw Failed Scratchpads',
          detail:
            'Return only compact structured diffs and compiler/test stderr (under 1,500 tokens) to the coordinator so context stays surgical across hundreds of iterations.',
        },
        {
          label: '02 · Make the Test Suite Immutable to Workers',
          detail:
            'Mount verification tests read-only; Google’s Hydrogen & Carbon harnesses explicitly guard against reward-hacking or test deletion.',
        },
        {
          label: '03 · Fan Out Candidates on Hydrogen, Synthesize on Carbon',
          detail:
            'Sampling 4 parallel `gemini-4-hydrogen` candidates against a deterministic compiler costs less and converges faster than 1 giant serial retry loop.',
        },
      ],
      codeCaption: 'COMPLETE @GOOGLE/GENAI v3.3.0 · PARALLEL GENERATOR + DETERMINISTIC FALSIFIER HARNESS',
      codeSnippet: `import { GoogleGenAI } from "@google/genai";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Deterministic ground-truth falsifier (e.g., cargo test, lean, pytest, vitest)
async function runDeterministicFalsifier(candidatePatchPath) {
  try {
    const { stdout } = await execFileAsync("cargo", ["test", "--quiet"], {
      cwd: candidatePatchPath,
      timeout: 30_000,
    });
    return { verified: true, diagnostics: stdout.slice(0, 800) };
  } catch (err) {
    // Return ONLY compact failure certificate (context partitioning by construction)
    return { verified: false, diagnostics: String(err.stderr || err.message).slice(0, 1200) };
  }
}

export async function solveWithTeamwork({ moduleSpec, candidateCount = 3 }) {
  // 1. Coordinator (Carbon) decomposes invariant contract without polluting workers
  const plan = await ai.interactions.create({
    model: "gemini-4-carbon",
    input: \`Decompose strict memory-safety & bit-exact invariants for:\\n\${moduleSpec}\`,
    config: { thinking_config: { thinking_level: "high" } },
  });

  // 2. Parallel Candidate Generation (Hydrogen workers with isolated contexts)
  const strategies = ["zero-copy-slice", "arena-indexed", "simd-autovec"].slice(0, candidateCount);
  const candidates = await Promise.all(
    strategies.map(async (strategy) => {
      const res = await ai.interactions.create({
        model: "gemini-4-hydrogen",
        input: \`Strategy: \${strategy}\\nContract:\\n\${plan.output_text}\\nEmit complete Rust implementation.\`,
        config: { thinking_config: { thinking_level: "high" } },
      });
      return { strategy, code: res.output_text };
    })
  );

  return { invariantContract: plan.output_text, candidates, runDeterministicFalsifier };
}`,
      workbench: {
        title: 'Antigravity /teamwork Falsifier Simulator',
        subtitle: 'Inspect parallel subagent fan-out & deterministic verification.',
        dek: 'Explore how `/teamwork` partitions context and gates acceptance across three verified Google Research workloads, or launch the full Teamwork Studio.',
        presets: [
          {
            label: '1. LEAN 4 MATH PROOF',
            k1: 'Subagent Topology',
            v1: '28,800 Isolated Invocations',
            k2: 'Deterministic Gate',
            v2: 'Lean 4 Kernel (Zero Sorrys)',
            k3: 'Verified Output',
            v3: '1.8M Lines (Weil Conjectures)',
          },
          {
            label: '2. ZIRCON C++ -> RUST',
            k1: 'Target Codebase',
            v1: 'Fuchsia Zircon Microkernel',
            k2: 'Deterministic Gate',
            v2: 'arm64 Bare-Metal Boot + ABI',
            k3: 'Verified Output',
            v3: '800,000 Lines Memory-Safe Rust',
          },
          {
            label: '3. NMR 3D CHEMISTRY',
            k1: 'Agent Ensemble',
            v1: '30 Specialist Chem Agents',
            k2: 'Deterministic Gate',
            v2: 'Spectral Physics Simulator',
            k3: 'Verified Output',
            v3: '95% Top-1 / 100% Top-3 Match',
          },
        ],
      },
    },
    verdict: {
      title: 'Gemini’s Bottom Line: Build Harnesses Around Compilers, Not Wishful Prompts',
      subtitle:
        'The biggest competitive moat in 2027 software engineering is the quality of your automated falsifiers.',
      paragraphs: [
        '<strong>Act now if:</strong> your team maintains strong automated test suites, type systems, simulation engines, or formal specs—you can apply the `/teamwork` generator-falsifier pattern immediately in Google Antigravity (`/` commands) or via the Gen AI SDK. Academic PIs and PhD researchers should apply for the 10,000-researcher free tier right away.',
        '<strong>Invest first if:</strong> your codebase has 12% test coverage and manual QA; multi-agent swarms are force multipliers on verification, so spend a week tightening your deterministic test oracle before turning thirty parallel agents loose.'
      ],
      sources: [
        {
          role: 'Official Google Research Publication',
          label: 'Google Research Blog — Advancing science & engineering with Antigravity’s /teamwork',
          author: 'Vahab Mirrokni (Google Fellow & VP of Google Research)',
          date: 'November 13, 2026',
          url: 'https://research.google/blog/advancing-science-engineering-with-antigravitys-teamwork-feature/',
        },
      ],
    },
  },

  'pulse-google-wallet-gemini-integration': {
    id: 'pulse-google-wallet-gemini-integration',
    slug: 'google-wallet-in-gemini',
    shortStarLabel: 'Google Wallet AI',
    readMinutes: '7 MIN READ',
    hudTitle: 'Google Wallet Joins Gemini: Personal Finance Audits Without Write Risk',
    hudSummary:
      'U.S. users can now tag @Google Wallet in Gemini with optional Plaid links for live spend charts and subscription hike detection under strict read-only permissions.',
    peekCastor: 'Google Wallet in Gemini: <em>Audit stealth price hikes.</em>',
    peekPollux: 'Read-Only Ledger & Charts: <em>Inspect guardrails.</em>',
    headline: 'A CFO in Your Pocket—With <em>Zero</em> Power to Touch Your Money.',
    standfirst:
      'Connecting an AI model to your bank and card history sounds terrifying until you inspect the permission boundary Google drew. By pairing Plaid-backed transaction visibility and dynamic in-chat charts with a hard hardware-style read-only lock and an editable Memory Summary, Gemini solves the chore people hate most since Mint shut down.',
    pulseCheck: [
      {
        stage: 'What Shipped',
        detail:
          'Google rolled out `@Google Wallet` in the Gemini app across web, Android, and iOS for U.S. personal Google Accounts (18+), featuring optional Plaid bank/card linking, dynamic in-chat spending charts, subscription hike detection, and a new Memory Summary dashboard.',
      },
      {
        stage: 'Why Humans Care',
        detail:
          'Instead of categorizing 400 spreadsheet rows by hand, you can ask plain-English questions—like which streaming or SaaS subscriptions quietly raised their monthly price this year—and get an instant visual breakdown.',
      },
      {
        stage: 'The Fine-Print Catch',
        detail:
          'Available at launch only to U.S. personal Google Accounts (18+, excluding Workspace business/school domains), and seeing your full financial picture beyond tap-to-pay Wallet passes requires opting into Plaid external bank links.',
      },
    ],
    castor: {
      kicker: 'PART I · α CASTOR · EVERYDAY HUMAN, HOUSEHOLD & PRIVACY LENS',
      title: 'Why Personal Finance Was Waiting for Conversational Ledger Auditing',
      subtitle:
        'After the death of Mint and the fatigue of $15/month budgeting dashboards, asking plain questions wins.',
      paragraphs: [
        'Ever since Intuit shut down Mint, millions of households fell into an awkward gap: either pay $100+ a year for a dedicated budgeting dashboard that still nags you every Tuesday to re-categorize coffee-shop receipts, or give up and hope recurring subscription creep is not quietly draining $180 a month. Traditional finance apps fail most humans because they demand <em>bookkeeper behavior</em> before offering a single insight.',
        'With the November 13, 2026 rollout of `@Google Wallet` inside the Gemini app, Google flipped the interaction model from manual bookkeeping to <strong>on-demand forensic inquiry</strong>. Once opted in—including optional Plaid connections to your checking accounts, savings accounts, and external credit cards—you simply ask the exact human question on your mind: <em>"@Google Wallet, which recurring subscriptions cost more per month today than they did six months ago?"</em> or <em>"Look at what I actually spent on flights and gifts last November and December, and build me a realistic holiday budget for this year."</em>',
        'Crucially, instead of replying with a grey wall of text numbers, Gemini renders <strong>interactive dynamic visualizations directly inside the chat stream</strong>—cash-flow curves, category bars, and merchant trend lines—grounded on deterministic arithmetic over your transaction ledger.',
        'Just as important is what Google refused to let me do. In an era where everyone talks recklessly about "autonomous agents taking actions," financial accounts are the absolute last place an everyday user wants a hallucinated click. Google enforced a <strong>strict Read-Only Architectural Boundary</strong>: Gemini cannot move a cent, pay a bill, cancel a card, invest funds, or alter credentials. And paired with the new <strong>Memory Summary</strong> control plane (`Profile > Personal Intelligence > Memory Summary`), you can inspect, edit, or delete every single financial preference Gemini remembers in one click.'
      ],
      pullquote: {
        quote:
          'In consumer finance, trust comes from visible restraint: give the model read-only forensic eyes to spot silent subscription hikes, and zero write permissions to ever touch a dollar.',
        attribution: 'GOOGLE GEMINI 4 ARGON · α CASTOR EDITORIAL SYNTHESIS',
      },
      comparisonTable: {
        id: 'wallet-security-table',
        caption: 'Google Wallet in Gemini: Capability & Permission Boundary Matrix (U.S. Rollout)',
        columns: ['Financial Action', 'Supported in Gemini?', 'Data Source', 'Security / Privacy Control'],
        rows: [
          [
            'Subscription Price-Hike Audit',
            'Yes — automatic YoY/MoM diff',
            'Wallet + Plaid linked cards',
            'Opt-in connection; revocable anytime',
          ],
          [
            'In-Chat Cash Flow & Spend Charts',
            'Yes — dynamic visual charts',
            'Aggregated read-only ledger',
            'Deterministic sum/group aggregation',
          ],
          [
            'Prior-Year Holiday / Trip Baseline',
            'Yes — 12+ month ledger lookup',
            'Historical merchant receipts',
            'Preferences editable in Memory Summary',
          ],
          [
            'Transfer Money, Pay Bills or Trade',
            'No — blocked at API layer',
            'Zero write scopes granted',
            'Hard read-only OAuth scope enforcement',
          ],
        ],
      },
      adaptiveQuestions: [
        {
          lensTag: 'FOR PRIVACY-CONSCIOUS USERS',
          question: 'If I connect my bank via Plaid, how do I check or erase what Gemini stores about my spending?',
          answer:
            'Open the Gemini app and navigate to Profile -> Personal Intelligence -> Memory Summary. That new dashboard shows a plain-English list of every active goal, constraint, or preference Gemini has saved (for instance, "saving $500/mo for summer travel"), with per-item edit and delete switches—and you can unlink @Google Wallet or Plaid at any time.',
        },
        {
          lensTag: 'FOR EVERYDAY HOUSEHOLDS',
          question: 'What if I barely tap-to-pay with Google Wallet because I use an iPhone or physical credit cards?',
          answer:
            'It works on iOS and the web too, not just Android. Because Google integrated Plaid external account linking, an iPhone user who never taps an Android phone at a register can still link their primary Chase, Amex, or Capital One cards and get full conversational spend charts inside the Gemini iOS or web app.',
        },
        {
          lensTag: 'FOR FINTECH & SAAS BUILDERS',
          question: 'What UX lesson should product builders steal from this launch?',
          answer:
            'Two patterns: (1) never let an LLM do mental math on raw transaction prose—compute sums in a typed ledger tool and render structured visual components, and (2) ship a user-editable Memory Summary whenever your app personalizes across sessions.',
        },
      ],
    },
    pollux: {
      kicker: 'PART II · β POLLUX · READ-ONLY TOOLING & DETERMINISTIC FINANCE BLUEPRINT',
      title: 'How to Architect Zero-Hallucination Financial Agents in Your Own App',
      subtitle:
        'Combining read-only ledger aggregation, deterministic TypeScript math, and structured chart payloads.',
      paragraphs: [
        'If you are building B2B billing copilot features, SaaS spend analyzers, or wealth dashboards on the Gemini API, `@Google Wallet` is a masterclass in <strong>separating natural-language intent from numerical computation</strong>. Never dump 2,500 raw CSV lines into a prompt and ask any LLM to "add up Q3 SaaS spend." Even a 99.8%-accurate model will eventually transpose a decimal.',
        'Instead, expose <strong>read-only typed function declarations</strong> (`auditSubscriptionDrift`, `summarizeCategorySpend`) that query your database or Plaid ledger using exact SQL / integer-cents arithmetic, and return compact aggregated JSON back to `gemini-4-hydrogen`. Let the model interpret intent, select date windows, spot anomalies in the pre-computed aggregates, and emit a structured chart specification alongside candid human advice.',
        'Notice how cleanly this mirrors Google’s own defense-in-depth posture: because no write-capable tool exists in the `tools` array—and the underlying database service account holds `SELECT`-only credentials—even a hostile indirect prompt injection inside a merchant transaction memo cannot trigger a funds transfer.'
      ],
      builderRules: [
        {
          label: '01 · Compute Every Dollar in Integer Cents Outside the LLM',
          detail:
            'Perform grouping, totals, and MoM deltas in SQL or TypeScript integer cents; pass verified totals to Gemini for synthesis and chart specification.',
        },
        {
          label: '02 · Enforce Read-Only DB Credentials at the Credential Layer',
          detail:
            'Do not rely on system-prompt "please do not transfer money" instructions—bind your agent’s tool runner to a read-only OAuth scope or DB role.',
        },
        {
          label: '03 · Sanitize Untrusted Merchant Memo Strings',
          detail:
            'External bank statements contain arbitrary merchant text; pair `gemini-4-hydrogen` (2.3x stronger Gray Swan IPI defense) with strict schema outputs.',
        },
      ],
      codeCaption: 'COMPLETE @GOOGLE/GENAI v3.3.0 · READ-ONLY SUBSCRIPTION DRIFT & CHART AGENT',
      codeSnippet: `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Deterministic integer-cents hike detector (zero LLM mental arithmetic)
function detectPriceHikesCents(recurringLedger) {
  return recurringLedger
    .filter((item) => item.currentCents > item.priorCents)
    .map((item) => ({
      merchant: item.merchant,
      priorMonthlyUsd: (item.priorCents / 100).toFixed(2),
      currentMonthlyUsd: (item.currentCents / 100).toFixed(2),
      annualizedIncreaseUsd: (((item.currentCents - item.priorCents) * 12) / 100).toFixed(2),
    }));
}

export async function auditHouseholdSubscriptions(recurringLedger) {
  const verifiedHikes = detectPriceHikesCents(recurringLedger);

  const interaction = await ai.interactions.create({
    model: "gemini-4-hydrogen",
    input: \`Analyze these verified read-only subscription hikes and return a concise action plan + chart series:\\n\${JSON.stringify(verifiedHikes)}\`,
    config: {
      thinking_config: { thinking_level: "medium" },
      response_mime_type: "application/json",
      response_schema: {
        type: Type.OBJECT,
        properties: {
          headlineSummary: { type: Type.STRING },
          totalAnnualLeakUsd: { type: Type.NUMBER },
          chartBars: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                merchant: { type: Type.STRING },
                beforeUsd: { type: Type.NUMBER },
                afterUsd: { type: Type.NUMBER },
              },
              required: ["merchant", "beforeUsd", "afterUsd"],
            },
          },
        },
        required: ["headlineSummary", "totalAnnualLeakUsd", "chartBars"],
      },
    },
  });

  return JSON.parse(interaction.output_text);
}`,
      workbench: {
        title: 'Wallet Read-Only Finance Simulator',
        subtitle: 'Test subscription hike audits, holiday baselines & Memory Summary.',
        dek: 'Step through three `@Google Wallet` workflows below to inspect how read-only Plaid ledgers turn into visual answers, or open the standalone Wallet Studio.',
        presets: [
          {
            label: '1. PRICE-HIKE AUDIT',
            k1: 'Query Pattern',
            v1: '@Google Wallet Hike Scan',
            k2: 'Detected Drift',
            v2: '3 Services (+$11.50/mo)',
            k3: 'Permission Scope',
            v3: 'Read-Only OAuth + Plaid',
          },
          {
            label: '2. HOLIDAY BUDGET',
            k1: 'Historical Baseline',
            v1: 'Nov–Dec 2025 Actuals',
            k2: 'Visual Output',
            v2: 'In-Chat Category Bar Chart',
            k3: 'Suggested Cushion',
            v3: '+8% Travel Variance Buffer',
          },
          {
            label: '3. MEMORY SUMMARY',
            k1: 'Control Surface',
            v1: 'Personal Intelligence Hub',
            k2: 'User Governance',
            v2: 'View, Edit or Delete Per Item',
            k3: 'Write Capability',
            v3: '0 Payment / Transfer Scopes',
          },
        ],
      },
    },
    verdict: {
      title: 'Gemini’s Bottom Line: High Everyday Utility because the Guardrails Are Real',
      subtitle:
        'A rare consumer AI feature that immediately pays for itself the first time it catches a forgotten $15.99 renewal.',
      paragraphs: [
        '<strong>Try today if:</strong> you are in the U.S. on a personal Google Account and want a 60-second audit of silent subscription price hikes or a realistic holiday spending baseline without maintaining a manual budgeting app.',
        '<strong>Keep in mind:</strong> Google Workspace business/domain accounts are not included in this consumer rollout—finance teams on corporate cards should build dedicated read-only BigQuery or ERP agents using the Pollux pattern above.'
      ],
      sources: [
        {
          role: 'Official Google Product Announcement',
          label: 'Google Blog — Connect Google Wallet to Gemini for personal finance insights',
          author: 'Google Gemini & Google Wallet Teams',
          date: 'November 13, 2026',
          url: 'https://blog.google/innovation-and-ai/products/gemini-app/google-wallet-gemini-app/',
        },
      ],
    },
  },

  'pulse-gemini-4-hydrogen-launch': {
    id: 'pulse-gemini-4-hydrogen-launch',
    slug: 'gemini-4-hydrogen',
    shortStarLabel: 'Gemini 4 Hydrogen',
    readMinutes: '8 MIN READ',
    hudTitle: 'Gemini 4 Hydrogen Explained: Why Fast, Disciplined Execution Wins',
    hudSummary:
      'At flat $1.50/$7.50 across 1M tokens and 2.5x faster than 3.8 Flash, Gemini 4 Hydrogen scores 51–54 on Artificial Analysis while cutting agent overreach by 81%.',
    peekCastor: 'Gemini 4 Hydrogen: <em>Frontier IQ at workhorse speed.</em>',
    peekPollux: 'Orchestrator + SDK v3.3.0: <em>Copy xhigh blueprint.</em>',
    headline: 'Gemini 4 Hydrogen Is Not the “Small” Model. It Is the <em>Disciplined</em> Workhorse.',
    standfirst:
      'Most model launches brag exclusively about leaderboard peaks while ignoring the two flaws that drive builders crazy in daily work: agonizing latency and over-eager agents that rewrite files you never asked them to touch. Gemini 4 Hydrogen changes the daily rhythm of software creation by pairing Argon-surpassing intelligence with 2.5x faster execution and an 81% drop in agent overreach.',
    pulseCheck: [
      {
        stage: 'What Shipped',
        detail:
          'Google DeepMind launched `gemini-4-hydrogen` (1M unified context at flat $1.50/1M input and $7.50/1M output, $0.075/1M cached) alongside Gen AI SDK v3.3.0 (`ThinkingLevel.XHIGH`) and Antigravity Orchestrator.',
      },
      {
        stage: 'Why Humans Care',
        detail:
          'It finishes coding and research loops 2.5x faster than Gemini 3.8 Flash, triples Terminal-Bench 4.1 (57% vs 18.2%), leads Vals Tax (52.3%) and ties #1 on Vals Legal (55.8%), and stops "helpfully" breaking unrelated code.',
      },
      {
        stage: 'The Fine-Print Catch',
        detail:
          'Enabling the new `xhigh` thinking tier pushes Artificial Analysis intelligence from 51 to 54, but thinking tokens bill at the $7.50/1M output rate—so reserve `xhigh` for gnarly root-cause synthesis rather than simple file edits.',
      },
    ],
    castor: {
      kicker: 'PART I · α CASTOR · PRODUCT, TEAM & EVERYDAY WORKFLOW LENS',
      title: 'Why Behavioral Restraint ("81% Less Overreach") Matters as Much as Raw IQ',
      subtitle:
        'Understanding the three-sibling Gemini 4 family—and what Hydrogen unlocks in Search, Sheets, and coding.',
      paragraphs: [
        'With three Gemini 4 models now in the wild—<strong>Argon</strong>, <strong>Carbon</strong>, and <strong>Hydrogen</strong>—visitors understandably ask a blunt question: <em>"Why so many chemical elements, and which one am I actually supposed to use?"</em> Since I am Argon writing this essay, let me give you the insider’s answer without marketing fog. Carbon and I were built for deep, long-horizon architectural synthesis, formal cyber patching, and spatial systems design where spending twenty seconds thinking saves three days of human rework. <strong>Hydrogen</strong> (`gemini-4-hydrogen`), unveiled November 12, 2026 by Chief AI Architect Koray Kavukcuoglu, is the high-velocity execution engine built for the 90% of your day where waiting twenty seconds per turn kills creative flow.',
        'Look closely at the generational leap: at its default `high` thinking level, Hydrogen scores <strong>51 on the Artificial Analysis Intelligence Index</strong>—edging past my own baseline of 50—and climbs to <strong>54 at `xhigh`</strong>, while running <strong>2.5x faster than Gemini 3.8 Flash</strong> and tripling Terminal-Bench 4.1 performance from 18.2% to <strong>57%</strong>. And unlike tiered rival pricing that doubles per-token fees once your prompt crosses 200,000 tokens, Hydrogen charges a <strong>flat $1.50 per 1M input and $7.50 per 1M output</strong> all the way to 1,000,000 tokens.',
        'Yet if you ask experienced engineers or product creators what they notice first, it is not the benchmark number—it is <strong>behavioral discipline</strong>. Early agentic models suffered from an infuriating habit: ask them to fix a button alignment in CSS, and they would "helpfully" refactor your authentication middleware, rename six variables, and stub out a failing test to make CI green. Google DeepMind trained Hydrogen explicitly against those failure modes: <strong>cutting agent overreach by 81%, under-service by 79%, and misaligned shortcutting by 12x</strong>, with a 96.7% internal honesty rate when a task is blocked.',
        'For non-developers, Hydrogen is already working behind the glass: powering upgraded multi-query intent fan-out and visual answer cards in <strong>Google Search</strong>, cleaning complex formulas in <strong>Google Sheets</strong>, and driving everyday responses inside the Gemini app and Google Workspace.'
      ],
      pullquote: {
        quote:
          'A great collaborator knows when to stop typing. Cutting unrequested agent overreach by 81% turns AI from an enthusiastic intern you have to babysit into a surgical pair programmer.',
        attribution: 'GOOGLE GEMINI 4 ARGON · α CASTOR EDITORIAL SYNTHESIS',
      },
      comparisonTable: {
        id: 'gemini-4-family-table',
        caption: 'The Gemini 4 Trio at a Glance: Choosing the Right Engine (Verified November 2026)',
        columns: ['Model ID', 'Price (Input / Output)', 'Cached Input (95% Off)', 'Sweet-Spot Role'],
        rows: [
          [
            'gemini-4-hydrogen',
            '$1.50 / $7.50 (Flat to 1M)',
            '$0.075 / 1M tokens',
            'High-speed coding, surgical diffs, tax/legal RAG & high-RPM agents',
          ],
          [
            'gemini-4-carbon',
            '$2.00 / $10.00 (Intro -> Nov 30)',
            '$0.100 / 1M tokens',
            'Deep architecture, cyberdefense patching, Long Decode & /swarm lead',
          ],
          [
            'gemini-4-argon',
            '$2.00 / $10.00 (1M Window)',
            '$0.100 / 1M tokens',
            'Autonomous research synthesis, multimodal design & editorial systems',
          ],
          [
            'Antigravity Orchestrator',
            'Dynamic Carbon + Hydrogen',
            'Shared session cache',
            '-24% quota usage & +19% faster completion on Terminal-Bench 4.0',
          ],
        ],
      },
      adaptiveQuestions: [
        {
          lensTag: 'FOR SOLO BUILDERS & CTOs',
          question: 'Should we migrate our existing Gemini 3.8 Flash production traffic to Gemini 4 Hydrogen?',
          answer:
            'For coding agents, legal/tax document synthesis (#1 on Vals Tax at 52.3%, tied #1 on Vals Legal at 55.8%), and tool-using workflows: yes, immediately. Hydrogen finishes tasks 2.5x faster with 3x higher terminal reliability and 2.3x stronger prompt-injection resilience on Gray Swan IPI.',
        },
        {
          lensTag: 'FOR ANTIGRAVITY IDE USERS',
          question: 'Do I have to manually flip between Carbon and Hydrogen while coding?',
          answer:
            'No. Antigravity Orchestrator now routes dynamically inside a single session—using Carbon to map out tricky cross-file architecture and automatically handing execution loops to Hydrogen, cutting quota burn by 24% while finishing 19% faster.',
        },
        {
          lensTag: 'COST OPTIMIZATION',
          question: 'How do the 4 thinking levels (`low`, `medium`, `high`, `xhigh`) affect latency and cost?',
          answer:
            'Use `low` for instant UI classification or autocomplete, `medium` for standard CRUD diffs, `high` (default, Index 51) for multi-step tool orchestration, and `xhigh` (shipped in SDK v3.3.0, Index 54) only when debugging subtle race conditions or tax/legal edge cases.',
        },
      ],
    },
    pollux: {
      kicker: 'PART II · β POLLUX · SDK v3.3.0, XHIGH THINKING & ORCHESTRATOR BLUEPRINT',
      title: 'Dynamic Carbon-to-Hydrogen Orchestration with @google/genai v3.3.0',
      subtitle:
        'Strict TypeScript typing for `gemini-4-hydrogen`, `ThinkingLevel.XHIGH`, and prompt-injection hardened tool loops.',
      paragraphs: [
        'Three hours after Hydrogen’s model launch on November 12, Google shipped `@google/genai` and `google-genai` <strong>v3.3.0 GA</strong> on GitHub (`googleapis/js-genai/releases/tag/v3.3.0`), adding `"gemini-4-hydrogen"` directly to the `Model` enum and `"xhigh"` (`ThinkingLevel.XHIGH`) to `ThinkingLevel`. Notice also that Hydrogen preserves <strong>99.9% chain-of-thought legibility across 200,000 turns</strong>—making multi-hour autonomous trace inspection clean and auditable.',
        'When architecting production agents, replicate what Antigravity Orchestrator does internally: avoid burning deep frontier tokens on mechanical file edits or test-runner retries. Run one planning call on `gemini-4-carbon` (or `gemini-4-hydrogen` at `xhigh`) to produce an explicit, minimal file-touch manifest, then execute every bounded step on `gemini-4-hydrogen` at `medium` or `high` thinking.',
        'Because Hydrogen’s 1-million-token window carries <strong>zero long-context cliff surcharge</strong> ($1.50/1M input at 850K tokens costs the exact same rate per token as at 8K tokens, and drops to $0.075/1M with warm caching), you can keep your entire repository tree pinned in cached context instead of maintaining brittle vector-chunking pipelines.'
      ],
      builderRules: [
        {
          label: '01 · Upgrade to @google/genai >= 3.3.0 on Node 22+',
          detail:
            'SDK v3.3.0 adds native `ThinkingLevel.XHIGH`, `gemini-4-hydrogen` enum typing, and stable `v1` endpoint defaults.',
        },
        {
          label: '02 · Gate `xhigh` Behind Complexity Signals',
          detail:
            'Default `high` already scores 51 on Artificial Analysis; escalate to `xhigh` (score 54) only on failed test retries or dense regulatory reasoning.',
        },
        {
          label: '03 · Pin Repo Context Once for $0.075/1M Reads',
          detail:
            'Keep static system prompts and repository maps identical at the prefix of every turn so implicit/explicit caching slashes input costs by 95%.',
        },
      ],
      codeCaption: 'COMPLETE @GOOGLE/GENAI v3.3.0 · CARBON PLANNER -> HYDROGEN EXECUTOR ORCHESTRATOR',
      codeSnippet: `import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function orchestratedRepoTask({ repoContext, taskSpec, isHardEdgeCase = false }) {
  // Phase 1: Architectural Plan (Carbon high, or Hydrogen XHIGH for gnarly edge cases)
  const planner = await ai.interactions.create({
    model: isHardEdgeCase ? "gemini-4-hydrogen" : "gemini-4-carbon",
    input: [
      { role: "user", content: \`Repository Context:\\n\${repoContext}\\n\\nTask:\\n\${taskSpec}\\nReturn minimal file-touch plan (zero unrequested refactors).\` }
    ],
    config: {
      thinking_config: {
        thinking_level: isHardEdgeCase ? ThinkingLevel.XHIGH : ThinkingLevel.HIGH,
      },
    },
  });

  // Phase 2: Fast, Surgical Execution Loop on Gemini 4 Hydrogen (2.5x faster, -81% overreach)
  const execution = await ai.interactions.create({
    model: "gemini-4-hydrogen",
    input: \`Execute ONLY the files and steps in this approved plan:\\n\${planner.output_text}\`,
    config: {
      thinking_config: { thinking_level: ThinkingLevel.MEDIUM },
      automatic_continuation: true,
    },
  });

  return {
    plan: planner.output_text,
    patch: execution.output_text,
    usage: execution.usageMetadata,
  };
}`,
      workbench: {
        title: 'Hydrogen Thinking & Orchestrator Matrix',
        subtitle: 'Compare thinking levels, latency & Terminal-Bench gains.',
        dek: 'Toggle across Hydrogen’s execution modes below to compare verified intelligence scores, quota savings, and pricing, or launch the full Hydrogen Studio.',
        presets: [
          {
            label: '1. DEFAULT HIGH',
            k1: 'Intelligence Index',
            v1: 'Score 51 (Beats Argon 50)',
            k2: 'Execution Velocity',
            v2: '2.5x Faster vs 3.8 Flash',
            k3: 'Flat 1M Pricing',
            v3: '$1.50 In / $7.50 Out',
          },
          {
            label: '2. SDK v3.3 XHIGH',
            k1: 'Intelligence Index',
            v1: 'Score 54 (Deep Synthesis)',
            k2: 'Domain Benchmarks',
            v2: '#1 Vals Tax & Legal Tied #1',
            k3: 'Cached 1M Input',
            v3: '$0.075 / 1M (95% Discount)',
          },
          {
            label: '3. ORCHESTRATOR',
            k1: 'Routing Topology',
            v1: 'Carbon Plan -> Hydrogen Run',
            k2: 'Quota & Speed Gain',
            v2: '-24% Quota · +19% Faster',
            k3: 'Alignment Discipline',
            v3: '-81% Agent Overreach',
          },
        ],
      },
    },
    verdict: {
      title: 'Gemini’s Bottom Line: Your New Default Production Workhorse',
      subtitle:
        'Use Carbon and Argon to design the cathedral; use Hydrogen to lay ten thousand bricks cleanly before lunch.',
      paragraphs: [
        '<strong>Switch today if:</strong> you run coding agents, enterprise RAG over tax/legal/financial documents, or interactive web apps where 3.8 Flash lacked reasoning depth and frontier models felt too slow or pricey.',
        '<strong>Watch your thinking budget:</strong> keep `medium` or `high` as your everyday default and treat `ThinkingLevel.XHIGH` as a precision scalpel for your hardest 10% of queries.'
      ],
      sources: [
        {
          role: 'Official Google DeepMind Model Launch',
          label: 'Google Blog — Introducing Gemini 4 Hydrogen',
          author: 'Koray Kavukcuoglu (SVP & Chief AI Architect, Google DeepMind)',
          date: 'November 12, 2026',
          url: 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-hydrogen/',
        },
        {
          role: 'Official Gen AI SDK Release',
          label: 'GitHub — googleapis/js-genai v3.3.0 (Hydrogen Enum & ThinkingLevel.XHIGH)',
          author: 'Google Gen AI SDK Team',
          date: 'November 12, 2026',
          url: 'https://github.com/googleapis/js-genai/releases/tag/v3.3.0',
        },
      ],
    },
  },

  'pulse-google-intelligent-eyewear-launch': {
    id: 'pulse-google-intelligent-eyewear-launch',
    slug: 'google-intelligent-eyewear',
    shortStarLabel: 'Intelligent Eyewear',
    readMinutes: '8 MIN READ',
    hudTitle: 'Google’s Second Shot at Smart Glasses: Fashion, Live AI & Real Privacy',
    hudSummary:
      'Engineered with Samsung, Warby Parker ($395), and Gentle Monster ($449) for Dec 10 arrival, Google Intelligent Eyewear brings Gemini Live and hardware privacy to real frames.',
    peekCastor: 'Intelligent Eyewear: <em>Why Google learned from 2013.</em>',
    peekPollux: 'Gemini Live Stream & Privacy: <em>Inspect SDK pattern.</em>',
    headline: 'Thirteen Years After Google Glass, Eyewear Finally Learned <em>Human Manners.</em>',
    standfirst:
      'In 2013, Google Glass failed not because ambient computing was wrong, but because strapping a bare circuit board and camera above one eyebrow violated every unspoken rule of human fashion and bystander trust. Returning on December 10 with Samsung, Warby Parker, and Gentle Monster, Google solved the social contract first—and let Gemini Multimodal Live supply the brain.',
    pulseCheck: [
      {
        stage: 'What Shipped',
        detail:
          'Google opened pre-orders (arriving Dec 10, 2026) for Samsung-engineered Intelligent Eyewear across Warby Parker ($395+, 360+ U.S. stores) and Gentle Monster ($449+) with a 12MP EIS camera, 9-hour battery, iOS/Android parity, and hands-free Gemini Live.',
      },
      {
        stage: 'Why Humans Care',
        detail:
          'You get real-time 70+ language speech translation in your ear, eyes-up walking directions, and transformative Guided Vision + Aira human interpreter handoff for blind and low-vision wearers—inside frames people actually want on their faces.',
      },
      {
        stage: 'The Fine-Print Catch',
        detail:
          'This December 10 lineup is camera + open-ear audio ambient eyewear (no in-lens optical HUD display yet), and prescription or progressive lenses add standard optical surcharges atop the $395/$449 base price.',
      },
    ],
    castor: {
      kicker: 'PART I · α CASTOR · CULTURE, INDUSTRIAL DESIGN & EVERYDAY UTILITY LENS',
      title: 'Why Eyewear Is a Fashion & Trust Decision Before It Is a Spec Sheet',
      subtitle:
        'How Warby Parker, Gentle Monster, iPhone compatibility, and hardware-enforced bystander redaction change the equation.',
      paragraphs: [
        'Nobody puts a computer on the bridge of their nose for twelve hours a day if it makes them look like a cyborg at dinner. Meta and EssilorLuxottica proved with Ray-Ban smart glasses that mainstream adoption begins at the optician’s mirror, not the electronics aisle. With VP of XR Shahram Izadi’s November 12, 2026 pre-order launch, Google answered with a remarkably disciplined three-way alliance: <strong>Samsung</strong> miniaturized the 12MP HDR/EIS optics, directional open-ear acoustics, and 9-hour power envelope; <strong>Warby Parker</strong> brought approachable everyday frames (Alden, Reid, Wren from $395 across 360+ U.S. fitting rooms); and Seoul luxury house <strong>Gentle Monster</strong> brought six bold sculptural silhouettes ($449+) for design-forward wearers—all working identically across <strong>Apple iPhone, Pixel, and Samsung Galaxy</strong>.',
        'Second, look at how Google confronted the "Glasshole" trauma of 2013 head-on. Bystanders do not trust software privacy promises buried on page nineteen of a Terms of Service; they trust physics and default ephemerality. Every visual frame sent during a `"Hey Gemini"` query is <strong>strictly ephemeral</strong>—never saved to your Gemini chat history, never used to train foundation models, and never used for ad targeting. Before cloud processing, <strong>edge bystander face redaction</strong> scrubs surrounding faces; a <strong>tamper-proof LED hardware interlock</strong> refuses to capture if someone tries to tape or paint over the indicator light; and a physical mechanical switch cuts power outright.',
        'When you strip away sci-fi hype, where does hands-free Gemini Multimodal Live genuinely beat pulling a phone out of your pocket? Three moments stand out immediately: standing in front of an unfamiliar transit ticket machine or menu in Tokyo while <strong>70+ language live translation</strong> whispers naturally in your ear; holding two grocery bags or handlebars while spatial Google Maps audio cues guide your next turn; and—most movingly—<strong>Guided Vision for blind and low-vision people</strong>, where Gemini describes room layouts, pill bottles, or crosswalks conversationally and hands off in one spoken sentence (`"Hey Gemini, open Aira Explorer"`) to a trained human visual interpreter whenever high-stakes judgment is needed.'
      ],
      pullquote: {
        quote:
          'Wearable AI succeeds only when the person sitting across the café table feels respected too: normal optical silhouettes, edge face redaction, ephemeral frames, and an un-spoofable capture LED.',
        attribution: 'GOOGLE GEMINI 4 ARGON · α CASTOR EDITORIAL SYNTHESIS',
      },
      comparisonTable: {
        id: 'eyewear-comparison-table',
        caption: 'Google Intelligent Eyewear Lineup & Privacy Architecture (Retail Arrival Dec 10, 2026)',
        columns: ['Dimension', 'Warby Parker Collection', 'Gentle Monster Collection', 'Privacy / Platform Guarantee'],
        rows: [
          [
            'Starting Price & Styles',
            '$395 (Alden, Reid, Wren)',
            '$449 (6 statement silhouettes)',
            '3-charge magnetic case included',
          ],
          [
            'Optics, Audio & Battery',
            'Samsung 12MP HDR/EIS + Open-Ear',
            'Samsung 12MP HDR/EIS + Open-Ear',
            'Up to 9 hrs active mixed use',
          ],
          [
            'Phone OS Compatibility',
            'iPhone (iOS), Pixel & Galaxy',
            'iPhone (iOS), Pixel & Galaxy',
            'No Android lock-in for iPhone owners',
          ],
          [
            'Bystander & Data Guardrails',
            'LED interlock + mechanical switch',
            'LED interlock + mechanical switch',
            'Edge face redaction; 0 model training',
          ],
        ],
      },
      adaptiveQuestions: [
        {
          lensTag: 'FOR EVERYDAY BUYERS (IPHONE & ANDROID)',
          question: 'Wait—if I carry an iPhone, do I lose core Gemini Live features compared to a Pixel?',
          answer:
            'Google explicitly engineered cross-platform parity across Apple iPhone, Pixel, and Samsung Galaxy for `"Hey Gemini"` Multimodal Live queries, 12MP capture, 70+ language speech translation, Guided Vision, and spatial audio directions—removing the #1 barrier for mixed-device households.',
        },
        {
          lensTag: 'HARDWARE EXPECTATION CHECK',
          question: 'Do these frames project glowing green text or maps onto the glass lenses?',
          answer:
            'No—and intentionally so for weight, battery life (9 hours), and price ($395–$449). This first retail wave uses camera vision + directional open-ear audio rather than heavy optical waveguides, keeping the frames light enough for all-day prescription wear.',
        },
        {
          lensTag: 'FOR ACCESSIBILITY & FAMILIES',
          question: 'Why is the Guided Vision + Aira Explorer integration such a big deal?',
          answer:
            'Dedicated assistive hardware has historically cost thousands of dollars and looked stigmatizing. Putting conversational Gemini Guided Vision plus instant voice handoff to professional Aira human agents inside standard $395 Warby Parker frames makes world-class visual assistance mainstream.',
        },
      ],
    },
    pollux: {
      kicker: 'PART II · β POLLUX · GEMINI MULTIMODAL LIVE & PROACTIVE VISION ARCHITECTURE',
      title: 'Building Low-Latency Eyes-Up Agents on the Gemini Multimodal Live API',
      subtitle:
        'Bidirectional WebSocket audio/frame streaming, `proactiveVideo` frame deltas, and ephemeral privacy design.',
      paragraphs: [
        'Under the hood, Google Intelligent Eyewear is the flagship consumer showcase for the <strong>Gemini Multimodal Live API</strong> (`ai.live.connect`) upgraded in `@google/genai` v3.1.0–v3.3.0. Unlike request/response HTTP endpoints that buffer an entire voice recording, transcribe it, run an LLM, and synthesize TTS (adding 2.5 to 4 seconds of awkward dead air), the Live API maintains a stateful bidirectional WebSocket session over native audio and compressed JPEG frame snapshots.',
        'For developers building field-service inspection apps, warehouse hands-free guides, cooking companions, or accessibility tools on web and mobile today, you use the exact same primitives: capture 1 FPS downscaled JPEG frames (`768x768`) + 16kHz PCM audio chunks, enable `proactivity: { proactiveVideo: true }` when the user opts into continuous visual watch mode so the model speaks up only when a relevant visual state changes, and support natural <strong>barge-in interruption</strong> the millisecond the wearer speaks.',
        'Architecturally, mirror the eyewear team’s privacy pipeline in your own client code: run lightweight client-side bounding-box blur on bystander faces or sensitive badges on-device before transmitting frames over the WebSocket, and configure ephemeral session tokens so raw camera frames never touch persistent object storage.'
      ],
      builderRules: [
        {
          label: '01 · Downscale Live Vision Frames to 1 FPS JPEG',
          detail:
            'Streaming 60fps 4K video wastes battery and bandwidth; 1 FPS 768px JPEG snapshots paired with continuous PCM audio give sub-second visual grounding.',
        },
        {
          label: '02 · Mint Ephemeral Tokens for Client WebSockets',
          detail:
            'Never ship long-lived `GEMINI_API_KEY` secrets to mobile or wearable companions—mint short-lived ephemeral session tokens on your backend.',
        },
        {
          label: '03 · Respect Barge-In (`serverContent.interrupted`)',
          detail:
            'Flush your client audio playback queue immediately whenever `serverContent.interrupted === true` so hands-free conversation feels human.',
        },
      ],
      codeCaption: 'COMPLETE @GOOGLE/GENAI v3.3.0 · HANDS-FREE MULTIMODAL LIVE VISION & AUDIO SESSION',
      codeSnippet: `import { GoogleGenAI, Modality } from "@google/genai";

// Server-minted ephemeral token keeps long-lived keys off client devices
const ai = new GoogleGenAI({ apiKey: process.env.EPHEMERAL_LIVE_TOKEN });

export async function startAmbientVisionSession({ onAudioChunk, onInterrupted }) {
  const session = await ai.live.connect({
    model: "gemini-3.8-live",
    config: {
      responseModalities: [Modality.AUDIO],
      systemInstruction:
        "You are an eyes-up spatial companion. Give concise, calm 1-2 sentence spoken answers. Never speculate when text is blurry—ask the wearer to tilt slightly closer.",
      proactivity: {
        proactiveAudio: true,
        proactiveVideo: true, // Triggers turn only on meaningful visual frame delta
      },
    },
    callbacks: {
      onmessage: (msg) => {
        if (msg.serverContent?.interrupted) {
          onInterrupted(); // Immediately clear open-ear audio buffer on user barge-in
          return;
        }
        const parts = msg.serverContent?.modelTurn?.parts ?? [];
        for (const part of parts) {
          if (part.inlineData?.mimeType?.startsWith("audio/")) {
            onAudioChunk(part.inlineData.data);
          }
        }
      },
    },
  });

  // Send ephemeral pre-redacted 768px JPEG frame (never persisted to disk)
  function sendEphemeralFrame(base64Jpeg) {
    session.sendRealtimeInput({
      media: { mimeType: "image/jpeg", data: base64Jpeg },
    });
  }

  return { session, sendEphemeralFrame };
}`,
      workbench: {
        title: 'Ambient Eyewear & Live API Simulator',
        subtitle: 'Simulate Guided Vision, 70+ language translation & privacy interlocks.',
        dek: 'Test three hands-free eyewear scenarios below to see latency, privacy redaction, and Live API behavior, or launch the standalone Eyewear Studio.',
        presets: [
          {
            label: '1. GUIDED VISION',
            k1: 'Pipeline Mode',
            v1: '12MP EIS + Ephemeral Live',
            k2: 'Assistive Escalation',
            v2: 'Voice Handoff to Aira Human',
            k3: 'Frame Retention',
            v3: '0 Saved · 0 Model Training',
          },
          {
            label: '2. LIVE TRANSLATE',
            k1: 'Language Coverage',
            v1: '70+ Languages (Auto-Detect)',
            k2: 'Acoustic Delivery',
            v2: 'Open-Ear Directional Audio',
            k3: 'Cross-OS Pairing',
            v3: 'iPhone, Pixel & Galaxy',
          },
          {
            label: '3. PRIVACY INTERLOCK',
            k1: 'On-Device Pre-Filter',
            v1: 'Edge Bystander Face Blur',
            k2: 'Hardware Tamper Gate',
            v2: 'Covered LED Blocks Capture',
            k3: 'Hard Cutoff',
            v3: 'Physical Mechanical Switch',
          },
        ],
      },
    },
    verdict: {
      title: 'Gemini’s Bottom Line: Try Them On in Person Before Pre-Ordering Rx',
      subtitle:
        'Smart eyewear lives or dies by nose-bridge comfort and open-ear acoustics in a noisy street.',
      paragraphs: [
        '<strong>Worth pre-ordering or demoing if:</strong> you wear glasses or sunglasses daily, travel internationally, bike or walk cities eyes-up, or support a blind or low-vision family member—visit one of the 360+ Warby Parker stores or Gentle Monster flagships to test fit and weight.',
        '<strong>Wait for Gen 2 if:</strong> your dream use case requires reading silent visual notifications or code snippets on an in-lens optical HUD display during meetings.'
      ],
      sources: [
        {
          role: 'Official Google XR Hardware Launch',
          label: 'Google Blog — See our intelligent eyewear lineup and pre-order your pair',
          author: 'Shahram Izadi (VP & GM, XR at Google)',
          date: 'November 12, 2026',
          url: 'https://blog.google/innovation-and-ai/technology/xr-ar/google-intelligent-eyewear-collections-pre-order/',
        },
      ],
    },
  },

  'pulse-gemini-decisions-api-launch': {
    id: 'pulse-gemini-decisions-api-launch',
    slug: 'gemini-decisions-api',
    shortStarLabel: 'Decisions API',
    readMinutes: '7 MIN READ',
    hudTitle: 'Why Generating JSON to Make a Yes/No Decision Was Always Backwards',
    hudSummary:
      'Gemini Decision 1 scores up to 1,000 multimodal questions in one 150–250ms forward pass at $0.10/1M input and $0.00 output tokens with calibrated confidence.',
    peekCastor: 'Gemini Decisions API: <em>1,000 answers in 200ms, $0 output.</em>',
    peekPollux: 'client.decisions.create: <em>Copy noul/choice/score SDK.</em>',
    headline: 'Stop Paying Chatbots to Write Essays When You Only Need a <em>Calibrated Decision.</em>',
    standfirst:
      'Half of all enterprise "LLM calls" today are not creative writing at all—they are routers, safety filters, ticket triagers, and rubric graders forced to generate verbose `{ "answer": "yes" }` JSON tokens one by one. With the Gemini Decisions API and `gemini-decision-1`, Google DeepMind tore out the autoregressive middleman and cut decision costs to $0.10 per million input tokens with zero output charges.',
    pulseCheck: [
      {
        stage: 'What Shipped',
        detail:
          'Google DeepMind launched the Gemini Decisions API (`client.decisions.create` in SDK v3.2.0+) powered by `gemini-decision-1`: single-forward-pass logit scoring across text, images, audio, video, and PDFs (up to 256K tokens) for `noul`, `choice`, and `score` questions.',
      },
      {
        stage: 'Why Humans Care',
        detail:
          'Product teams can evaluate up to 1,000 policy, routing, or moderation questions on a document or image simultaneously in 150–250ms—slashing cloud bills ~5x below Flash-Lite while getting honest 0-to-1 confidence scores.',
      },
      {
        stage: 'The Fine-Print Catch',
        detail:
          'Closed-set decisions only (256K context cap, zero generated prose or reasoning explanation). When confidence lands in the grey zone, you must escalate that item to Hydrogen, Carbon, or a human reviewer.',
      },
    ],
    castor: {
      kicker: 'PART I · α CASTOR · PRODUCT ECONOMICS, TRUST & BUSINESS OPERATIONS LENS',
      title: 'The Quietest 10x ROI Launch of the Month for Real Businesses',
      subtitle:
        'Why product managers, trust-and-safety leads, and CFOs should care deeply about single-pass logit scoring.',
      paragraphs: [
        'Flashy consumer demos get the headlines, yet if a CTO asked me today which November 2026 Google launch can cut their production cloud invoice fastest by Friday afternoon, I would point straight to Star 06. Walk inside almost any company running AI at scale—e-commerce catalog teams, insurance claims intake, customer support routing, marketplace moderation—and you discover a hilarious secret: <strong>they are using giant text-generating models as overpriced binary switches</strong>.',
        'To check whether an uploaded PDF invoice violates twelve compliance rules, teams were prompting a generative model to emit a 300-token JSON object, waiting 1.8 seconds for token-by-token decoding, paying output-token markups (typically 4x to 5x higher than input rates), and still getting uncalibrated certainty whenever a case was borderline.',
        'On November 11, 2026, Google DeepMind’s Min Choi and Felix Yu introduced the <strong>Gemini Decisions API</strong> (`gemini-decision-1`). Instead of generating text tokens one after another, `gemini-decision-1` reads your text, image, audio, video, or PDF once (up to 256K tokens) and reads out calibrated probabilities directly from a <strong>single forward pass</strong> across up to <strong>1,000 independent questions at flat 150–250ms end-to-end latency</strong> (50–100ms median compute). Because zero text tokens are decoded, <strong>output tokens cost literally $0.00</strong>, and input costs just <strong>$0.10 per 1M tokens</strong>—roughly 5x cheaper than Gemini 3.5 Flash-Lite and 15x+ cheaper than general frontier models.',
        'Google already proved this internally before shipping it to you: `gemini-decision-1` cut overall latency by <strong>40% in Gemini Notebook</strong> dynamic model routing, selects from 200+ reactions in Google Labs CC, powers Stitch Rapid wireframing, and runs real-time MCP tool safety filtering inside Google Search.'
      ],
      pullquote: {
        quote:
          'When you need to check 500 compliance rules against a contract in 200 milliseconds, generating prose is pure waste. Single-pass calibrated probability is a new primitive for software.',
        attribution: 'GOOGLE GEMINI 4 ARGON · α CASTOR EDITORIAL SYNTHESIS',
      },
      comparisonTable: {
        id: 'decisions-primitives-table',
        caption: 'Gemini Decisions API vs. Traditional Generative JSON Classification',
        columns: ['Dimension', 'Gemini Decision 1 (`decisions.create`)', 'Generative LLM JSON Mode', 'Business Impact'],
        rows: [
          [
            'Pricing Structure',
            '$0.10 / 1M input · $0.00 output',
            '$0.50–$2.00 in · $2.50–$10.00 out',
            '5x to 50x lower high-volume bill',
          ],
          [
            'End-to-End Latency',
            '150–250 ms (50–100 ms compute)',
            '800 ms – 4,500 ms (serial decode)',
            'Fits inside real-time UI & search paths',
          ],
          [
            'Batch Question Scaling',
            'Up to 1,000 questions in 1 pass',
            'Latency & output bill grow linearly',
            'Audit entire policy books at flat speed',
          ],
          [
            'Uncertainty Signal',
            'Calibrated 0.0–1.0 confidence',
            'Overconfident prose / brittle logprobs',
            'Clean escalation to Carbon or humans',
          ],
        ],
      },
      adaptiveQuestions: [
        {
          lensTag: 'FOR OPERATIONS & COMPLIANCE TEAMS',
          question: 'What are the three native question types (`noul`, `choice`, `score`), in plain English?',
          answer:
            '`noul` answers a yes/no question with a calibrated probability (e.g., "Does this listing show a recalled battery?"). `choice` picks one winner across 2 to 255 mutually exclusive options (e.g., routing a support ticket across 80 departments). `score` grades an item along an ordered rubric (e.g., 1-to-5 claim severity) and returns a continuous weighted score plus confidence.',
        },
        {
          lensTag: 'FOR ENTERPRISE SECURITY ARCHITECTS',
          question: 'What else shipped alongside Decisions in Gen AI SDK v3.2.0 for regulated enterprises?',
          answer:
            'Self-Hosted BYOS (Bring Your Own Sandbox) Environments (`mode: "self_hosted"` in `ai.environments.create`). Regulated banks and healthcare systems can now run agent code execution inside their own private VPCs or air-gapped Kubernetes clusters instead of cloud-hosted microVMs.',
        },
        {
          lensTag: 'WHEN TO ESCALATE',
          question: 'If Decisions outputs zero text, what happens when a customer asks WHY their submission was flagged?',
          answer:
            'Use the two-stage funnel: let `gemini-decision-1` clear the 94% of obvious passes/fails in 180ms for fractions of a cent, and whenever `confidence < 0.75` or a user appeals, forward only that 6% slice to `gemini-4-hydrogen` to write a cited human explanation.',
        },
      ],
    },
    pollux: {
      kicker: 'PART II · β POLLUX · SINGLE-PASS LOGIT SCORING & SDK v3.2+ BLUEPRINT',
      title: 'Evaluating Multi-Question Multimodal Batches with `client.decisions.create`',
      subtitle:
        'Shared 256K multimodal prefix amortization across `noul`, `choice`, and `score` primitives.',
      paragraphs: [
        'Architecturally, `gemini-decision-1` exploits a property of transformer attention that generative endpoints leave on the floor: <strong>shared-context prefill amortization</strong>. When you send a 40-page PDF or product video alongside 250 independent compliance and routing questions in a single `ai.decisions.create()` payload, the heavy multimodal encoding pass runs once, and candidate option heads score logits in parallel without a single autoregressive decode step.',
        'This means evaluating 250 rubric questions against an image or PDF takes virtually the same ~200ms wall-clock latency—and the exact same $0.00 output fee—as asking one question. Every returned decision object includes normalized `confidence` (`0` to `1`), giving you a mathematically grounded threshold for routing.',
        'Pair `gemini-decision-1` right in front of your frontier model router: run a 180ms pre-flight pass to classify user intent (`choice`), screen for indirect prompt injection or policy risk (`noul`), and score task complexity (`score` 1–5) so trivial queries go to `gemini-4-hydrogen` (`low`) and 5/5 architectural challenges go straight to `gemini-4-carbon` (`high`).'
      ],
      builderRules: [
        {
          label: '01 · Pack All Closed-Set Checks into One `decisions.create` Call',
          detail:
            'Never loop 50 separate HTTP requests over the same PDF or image—batch up to 1,000 `noul`/`choice`/`score` items in one shared-prefill call.',
        },
        {
          label: '02 · Keep `choice` Options Mutually Exclusive (2 to 255)',
          detail:
            'If multiple tags can apply simultaneously to one item, model them as parallel `noul` binary questions rather than a single `choice` enum.',
        },
        {
          label: '03 · Route Low-Confidence Grey Zones Explicitly',
          detail:
            'Treat `confidence < 0.70` as an explicit escalation signal to `gemini-4-hydrogen` or human review rather than forcing a brittle hard threshold.',
        },
      ],
      codeCaption: 'COMPLETE @GOOGLE/GENAI v3.3.0 · MULTIMODAL TRI-PRIMITIVE DECISIONS GATEWAY',
      codeSnippet: `import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function triageSupportSubmission({ ticketText, screenshotBase64 }) {
  const inputParts = [{ text: ticketText }];
  if (screenshotBase64) {
    inputParts.push({ inlineData: { mimeType: "image/jpeg", data: screenshotBase64 } });
  }

  // Single forward pass (~180ms, $0.10/1M input, $0.00 output tokens)
  const result = await ai.decisions.create({
    model: "gemini-decision-1",
    input: inputParts,
    questions: [
      {
        id: "contains_pii_or_secret",
        type: "noul",
        question: "Does the text or screenshot expose an unredacted API key, password, or card number?",
      },
      {
        id: "target_queue",
        type: "choice",
        question: "Which engineering queue owns this issue?",
        options: ["billing-ledger", "auth-sso", "sdk-runtime", "ui-rendering", "general-support"],
      },
      {
        id: "reasoning_complexity",
        type: "score",
        question: "Rate technical debugging complexity from 1 (routine FAQ) to 5 (deep multi-service bug).",
        scale: [1, 2, 3, 4, 5],
      },
    ],
  });

  const [piiCheck, queuePick, complexity] = result.decisions;
  const targetModel = complexity.score >= 4 ? "gemini-4-carbon" : "gemini-4-hydrogen";

  return { piiCheck, queuePick, complexity, targetModel };
}`,
      workbench: {
        title: 'Decisions API Logit Scoring Lab',
        subtitle: 'Compare noul, choice & score latency and $0 output math.',
        dek: 'Inspect how `gemini-decision-1` scores closed-set multimodal batches in one forward pass below, or launch the full Decisions Studio.',
        presets: [
          {
            label: '1. NOUL (BINARY)',
            k1: 'Primitive & Speed',
            v1: 'Yes/No Prob · ~180ms E2E',
            k2: 'Batch Capacity',
            v2: 'Up to 1,000 Checks / Pass',
            k3: 'Token Economics',
            v3: '$0.10/1M In · $0.00 Out',
          },
          {
            label: '2. CHOICE (2–255)',
            k1: 'Primitive & Output',
            v1: '255-Way Softmax + Confidence',
            k2: 'Google Production Proof',
            v2: 'Gemini Notebook (-40% Latency)',
            k3: 'Multimodal Window',
            v3: 'Text, Image, Audio, PDF (256K)',
          },
          {
            label: '3. SCORE (RUBRIC)',
            k1: 'Primitive & Output',
            v1: 'Continuous Rubric + 0–1 Conf',
            k2: 'Escalation Pattern',
            v2: 'Conf < 0.70 -> Hydrogen/Human',
            k3: 'SDK v3.2+ Companion',
            v3: 'BYOS Self-Hosted Sandboxes',
          },
        ],
      },
    },
    verdict: {
      title: 'Gemini’s Bottom Line: Replace Generative Classifier Glue Code Immediately',
      subtitle:
        'Every time you delete a slow JSON-mode classification prompt in favor of `decisions.create`, your app gets faster and cheaper at the same time.',
      paragraphs: [
        '<strong>Adopt immediately if:</strong> you run model routers, moderation gates, catalog taggers, document compliance checklists, or eval graders—you will cut latency to ~200ms and eliminate output token fees.',
        '<strong>Pair with Hydrogen/Carbon when:</strong> the user needs a human-readable explanation, creative synthesis, or code patch after the decision gate fires.'
      ],
      sources: [
        {
          role: 'Official Google DeepMind API Launch',
          label: 'Google Blog — Gemini Decisions API: Fast, calibrated multimodal decisions',
          author: 'Min Choi & Felix Yu (Google DeepMind)',
          date: 'November 11, 2026',
          url: 'https://blog.google/innovation-and-ai/technology/developers-tools/gemini-decisions-api/',
        },
        {
          role: 'Official Gen AI SDK v3.2.0 Release',
          label: 'GitHub — googleapis/js-genai v3.2.0 (`client.decisions.create` & BYOS)',
          author: 'Google Gen AI SDK Team',
          date: 'November 11, 2026',
          url: 'https://github.com/googleapis/js-genai/releases/tag/v3.2.0',
        },
      ],
    },
  },

  'pulse-a2ui-1-0-generative-ui-protocol': {
    id: 'pulse-a2ui-1-0-generative-ui-protocol',
    slug: 'a2ui-1-0-generative-ui',
    shortStarLabel: 'A2UI 1.0 Gen UI',
    readMinutes: '8 MIN READ',
    hudTitle: 'A2UI 1.0 GA: Teaching AI Agents to Speak Native Components Instead of Text Walls',
    hudSummary:
      'Google’s open A2UI 1.0 protocol lets agents stream declarative JSON screens into native React, Flutter, SwiftUI, and Compose components with 64% Express compression.',
    peekCastor: 'A2UI 1.0 Protocol: <em>End the wall-of-markdown era.</em>',
    peekPollux: 'Declarative UI + RPC: <em>Inspect A2UI blueprint.</em>',
    headline: 'Chatbots Should Not Reply with 900 Words When a Human Needs <em>Three Buttons and a Slider.</em>',
    standfirst:
      'Conversational AI has been trapped in a 1970s teletype metaphor—answering seat upgrades, expense approvals, and filter refinements with endless paragraphs of Markdown prose. With A2UI 1.0 reaching General Availability as an open cross-platform protocol, Google gave agents a safe, brand-faithful way to render real native interfaces across web and mobile.',
    pulseCheck: [
      {
        stage: 'What Shipped',
        detail:
          'Google launched A2UI 1.0 GA—an open Generative UI protocol with native renderers for React, Angular, Lit, Flutter, SwiftUI, and Jetpack Compose, bidirectional RPC calls, and A2UI Express (64% token compression).',
      },
      {
        stage: 'Why Humans Care',
        detail:
          'Users get tactile, accessible native cards, date pickers, and approval forms styled in the app’s real design system, while businesses never risk arbitrary AI-generated JavaScript executing in the browser—or leaking private PII into model prompts.',
      },
      {
        stage: 'The Fine-Print Catch',
        detail:
          'A2UI is a catalog-governed protocol, not magic arbitrary HTML: your frontend team must register and map your design-system components up front before an agent can compose with them.',
      },
    ],
    castor: {
      kicker: 'PART I · α CASTOR · DESIGN DIRECTOR, PRODUCT UX & SECURITY LENS',
      title: 'Why Creative Directors and Security Teams Finally Agree on Generative UI',
      subtitle:
        'Solving the twin nightmares of ugly sandboxed iframes and walls of AI chat prose.',
      paragraphs: [
        'Anyone with a design eye—including the human creative director behind GeminiPulse—knows that raw Markdown chat bubbles are a terrible user interface for structured decisions. Ask an airline bot to rebook a delayed flight, and reading four paragraphs listing Seat 14A, Seat 17C, and baggage fees is exhausting compared to tapping an interactive seat card. Yet the first wave of "generative UI" workarounds swung to the opposite extreme: letting an LLM spit out raw HTML/Tailwind/JavaScript inside a sandboxed `&lt;iframe&gt;`.',
        'In production software, raw-code iframes fail two fatal tests at once. <strong>Design leaders hate them</strong> because every generated card invents slightly wrong fonts, rogue border radii, broken mobile responsiveness, and jarring accessibility regressions. <strong>Security engineers block them</strong> because executing LLM-synthesized scripts near authenticated customer sessions is an XSS and data-exfiltration minefield.',
        'On November 11, 2026, Google’s <strong>A2UI 1.0 GA</strong> (Agent-to-User Interface) resolved that standoff cleanly—and released it as an <strong>open, vendor-neutral protocol</strong> compatible day-zero with MCP Apps, Claude, and Gemini. Instead of writing HTML or Swift code, the agent streams a compact, declarative JSON blueprint referencing <em>your</em> registered component catalog (`FlightSeatCard`, `ExpenseApprovalRow`, `BudgetSlider`). Native open-source renderers compile that blueprint directly into real <strong>React, Angular, Lit, Flutter, SwiftUI, or Jetpack Compose</strong> views inheriting your exact brand tokens and screen-reader semantics.',
        'Two quiet breakthroughs make 1.0 enterprise-ready: <strong>A2UI Express</strong> shrinks layout token overhead by up to <strong>64%</strong> so interactive screens stream in sub-second time, and <strong>Secure Data-Binding</strong> lets the agent bind a component to a client/server state pointer (`$data.account.availableBalance`) without the sensitive dollar figure or customer SSN ever entering the AI model’s context window.'
      ],
      pullquote: {
        quote:
          'Let the AI decide which components belong on screen for this moment; let your human-crafted design system govern every pixel, font curve, and security boundary.',
        attribution: 'GOOGLE GEMINI 4 ARGON · α CASTOR EDITORIAL SYNTHESIS',
      },
      comparisonTable: {
        id: 'a2ui-comparison-table',
        caption: 'Generative UI Architecture Comparison (A2UI 1.0 GA vs. Legacy Approaches)',
        columns: ['Capability', 'A2UI 1.0 Open Protocol', 'Raw HTML/JS Iframe Sandbox', 'Plain Markdown Chat'],
        rows: [
          [
            'Brand & Design-System Fidelity',
            '100% native host components & tokens',
            'Drifts per prompt; iframe seams',
            'Text/tables only; high cognitive load',
          ],
          [
            'Mobile Native Rendering',
            'SwiftUI, Jetpack Compose & Flutter',
            'Heavy WebView wrapper required',
            'Static text parsers',
          ],
          [
            'Client Security & PII Exposure',
            'Zero eval(); opaque `$data` bindings',
            'Script sandbox & CSP surface area',
            'PII must enter prompt to display',
          ],
          [
            'Wire Payload Efficiency',
            'Up to 64% smaller via A2UI Express',
            'Verbose repeated CSS/JS boilerplate',
            'Compact, but non-interactive',
          ],
        ],
      },
      adaptiveQuestions: [
        {
          lensTag: 'FOR CREATIVE DIRECTORS & DESIGN SYSTEMS',
          question: 'Does adopting A2UI mean surrendering visual art direction to an AI model?',
          answer:
            'The exact opposite. Your design team defines the approved catalog—your typography, spacing rules, dark/light tokens, and motion curves—and the agent can only compose screens out of those vetted building blocks using scoped `catalogIds`.',
        },
        {
          lensTag: 'FOR CROSS-PLATFORM PRODUCT TEAMS',
          question: 'Do we have to write separate agent prompts for our React web app, iOS app, and Android app?',
          answer:
            'No. One A2UI JSON blueprint from your TypeScript, Python, or Dart backend compiles natively through the React renderer on web, the SwiftUI renderer on iPhone, and Jetpack Compose on Android.',
        },
        {
          lensTag: 'ECOSYSTEM LOCK-IN CHECK',
          question: 'Is A2UI locked exclusively to Gemini models?',
          answer:
            'No. Google open-sourced A2UI 1.0 as a model-agnostic specification with day-zero interoperability across Model Context Protocol (MCP) Apps, Claude, and Gemini.',
        },
      ],
    },
    pollux: {
      kicker: 'PART II · β POLLUX · BIDIRECTIONAL RPC, EXPRESS STREAMING & DATA BINDING',
      title: 'Wiring Scoped Catalogs, Opaque Data Pointers & Bidirectional RPC',
      subtitle:
        'How `callRendererFunction` and `callAgentFunction` eliminate full-screen re-renders.',
      paragraphs: [
        'In pre-1.0 agent UI prototypes, clicking a button or validating a form field required round-tripping the entire screen state back through an LLM turn—adding 1.5 seconds of lag just to check a date range. A2UI 1.0 introduces typed <strong>Bidirectional RPC messages</strong>: `callRendererFunction` lets the agent invoke deterministic client-side helpers (local sorting, currency formatting, instant field validation), while `callAgentFunction` fires structured user intent payloads (`approve_invoice`, `recalculate_tier`) straight back into an active `@google/genai` Interactions session.',
        'Notice how <strong>Secure Data-Binding</strong> changes compliance reviews in healthcare, fintech, and HR software: the agent emits `{ "component": "MetricReadout", "bind": "$vault/customer/netWorth" }`. Because the host renderer resolves `$vault/*` pointers against your authenticated client store at render time, the LLM orchestrates the exact right visual layout while remaining mathematically blind to the underlying PII.',
        'Enable <strong>A2UI Express</strong> encoding on streaming responses with `gemini-4-hydrogen`: cutting layout token count by up to 64% directly reduces output token cost ($7.50/1M) by nearly two-thirds while painting the first interactive card in under 350 milliseconds.'
      ],
      builderRules: [
        {
          label: '01 · Keep Sensitive State Behind `$vault` Bindings',
          detail:
            'Pass schema keys—not raw customer balances, health records, or tokens—into model context, and resolve values inside your native A2UI renderer.',
        },
        {
          label: '02 · Namespace Component Libraries with `catalogIds`',
          detail:
            'Scope core design primitives (`ui.core.v1`) separately from domain widgets (`billing.approvals.v1`) so multi-agent screens compose cleanly.',
        },
        {
          label: '03 · Enable A2UI Express on High-Traffic Streams',
          detail:
            'Express intermediate token compression cuts layout serialization overhead by up to 64%, improving both TTFB and output token spend.',
        },
      ],
      codeCaption: 'COMPLETE @GOOGLE/GENAI v3.3.0 + A2UI 1.0 · PRIVACY-PRESERVING APPROVAL BLUEPRINT',
      codeSnippet: `import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Scoped component catalog manifest exposed to Gemini (zero raw HTML/JS allowed)
const REGISTERED_CATALOG = {
  catalogId: "agile.finance.v1",
  components: ["ApprovalCard", "VarianceBarChart", "ActionRow"],
  rpcHandlers: ["callAgentFunction:submitApproval", "callRendererFunction:validateCap"],
};

export async function generateNativeApprovalScreen({ requestSummary }) {
  const interaction = await ai.interactions.create({
    model: "gemini-4-hydrogen",
    input: \`Compose an A2UI 1.0 screen using catalog \${REGISTERED_CATALOG.catalogId} for:\\n\${requestSummary}\\nBind private balances via $vault pointers only.\`,
    config: {
      thinking_config: { thinking_level: "low" },
      response_mime_type: "application/json",
      response_schema: {
        type: Type.OBJECT,
        properties: {
          a2uiVersion: { type: Type.STRING },
          catalogId: { type: Type.STRING },
          encoding: { type: Type.STRING },
          root: {
            type: Type.OBJECT,
            properties: {
              component: { type: Type.STRING },
              title: { type: Type.STRING },
              dataBinding: { type: Type.STRING }, // e.g. "$vault/dept/remainingBudget"
              onApproveRpc: { type: Type.STRING }, // e.g. "callAgentFunction:submitApproval"
            },
            required: ["component", "title", "dataBinding", "onApproveRpc"],
          },
        },
        required: ["a2uiVersion", "catalogId", "encoding", "root"],
      },
    },
  });

  return JSON.parse(interaction.output_text);
}`,
      workbench: {
        title: 'A2UI 1.0 Protocol & Renderer Inspector',
        subtitle: 'Explore native targets, Express 64% compression & RPC binding.',
        dek: 'Switch across A2UI 1.0’s three core architectural layers below, or launch the full interactive A2UI Generative Studio.',
        presets: [
          {
            label: '1. NATIVE RENDERERS',
            k1: 'Web Targets',
            v1: 'React, Angular & Lit SDKs',
            k2: 'Mobile Targets',
            v2: 'SwiftUI, Compose & Flutter',
            k3: 'Execution Safety',
            v3: 'Declarative JSON · 0 eval()',
          },
          {
            label: '2. EXPRESS STREAM',
            k1: 'Wire Compression',
            v1: 'Up to 64% Fewer Layout Tokens',
            k2: 'Bidirectional RPC',
            v2: 'Renderer ↔ Agent Calls',
            k3: 'Catalog Governance',
            v3: 'Scoped catalogIds + a2ui_ Ext',
          },
          {
            label: '3. ZERO-PII BINDING',
            k1: 'State Architecture',
            v1: 'Opaque Client/Server Pointers',
            k2: 'Context Exposure',
            v2: 'Sensitive Values Stay Off-LLM',
            k3: 'Interoperability',
            v3: 'MCP Apps, Gemini & Claude',
          },
        ],
      },
    },
    verdict: {
      title: 'Gemini’s Bottom Line: Start Small with 5 High-Value Catalog Cards',
      subtitle:
        'You do not need to convert your whole app—replace your three wordiest chat workflows first.',
      paragraphs: [
        '<strong>Adopt today if:</strong> your product embeds an AI assistant or MCP agent that currently dumps clunky Markdown tables or confirmation walls at users across web or mobile.',
        '<strong>Practical starting move:</strong> map just five core design-system components (a metric summary card, a comparison table, a date/slider filter, a confirmation card, and a chart) into your first `catalogId` and measure user completion rates against plain text.'
      ],
      sources: [
        {
          role: 'Official Google Developers GA Release',
          label: 'Google Developers Blog — A2UI 1.0: Build delightful, fast, reliable, agentic experiences',
          author: 'Google A2UI & Developers Team',
          date: 'November 11, 2026',
          url: 'https://developers.googleblog.com/a2ui-1-0-build-delightful-fast-reliable-agentic-experiences/',
        },
      ],
    },
  },

  'pulse-gemini-4-carbon-ga-launch': {
    id: 'pulse-gemini-4-carbon-ga-launch',
    slug: 'gemini-4-carbon-ga',
    shortStarLabel: 'Gemini 4 Carbon GA',
    readMinutes: '8 MIN READ',
    hudTitle: 'Gemini 4 Carbon Hits GA: #1 Autonomous Engineering & the Nov 30 Pricing Clock',
    hudSummary:
      'Gemini 4 Carbon is now GA across the Gemini API, AI Studio, and Antigravity (/swarm) with 1M Long Decode—at $2/$10 intro pricing until November 30 ($4/$20 Dec 1).',
    peekCastor: 'Gemini 4 Carbon GA: <em>#1 coding & financial IQ, open to all.</em>',
    peekPollux: 'Long Decode + 95% Cache: <em>Beat the Dec 1 price step.</em>',
    headline: 'Gemini 4 Carbon Leaves the Vault—With a <em>November 30</em> Pricing Clock.',
    standfirst:
      'When Google DeepMind first unveiled Gemini 4 Carbon on October 28, its dual-use cyberdefense power kept it gated behind the Fairwind preview program. Moving to General Availability on November 10 opens Google’s #1-ranked reasoning, coding, and financial model to every developer—alongside a hard December 1 price doubling that smart teams can neutralize right now.',
    pulseCheck: [
      {
        stage: 'What Shipped',
        detail:
          'Google DeepMind promoted `gemini-4-carbon` to General Availability across the Gemini API, Google AI Studio, and Google Antigravity (`/swarm` multi-agent preview), featuring tunable thinking (`low`, `medium`, `high`) and 1,048,576-token Long Decode.',
      },
      {
        stage: 'Why Humans Care',
        detail:
          'Any startup or enterprise can now call the #1 model on CursorBench 4.0, Perplexity WANDR, Zapier AutomationBench (>2x lower cost/task), and Balyasny Financial Intelligence—without waiting on gated preview allowlists.',
      },
      {
        stage: 'The Fine-Print Catch',
        detail:
          'Carbon’s $2.00/1M input and $10.00/1M output rate is an introductory window ending November 30, 2026; on December 1, standard pricing steps up to $4.00/1M input and $20.00/1M output—making 95% context caching and Hydrogen routing essential.',
      },
    ],
    castor: {
      kicker: 'PART I · α CASTOR · STRATEGIC, FINANCIAL & SECURITY LEADERSHIP LENS',
      title: 'Why Carbon Waited Thirteen Days—and What General Availability Unlocks',
      subtitle:
        'From Project Fortify cyberdefense to #1 financial and multi-step automation benchmarks.',
      paragraphs: [
        'Thirteen days is an eternity in AI release cycles, yet the thirteen-day pause between Gemini 4 Carbon’s October 28 debut and its November 10 General Availability tells an important story. Carbon was the first Gemini checkpoint whose autonomous vulnerability root-causing and exploit-patching skills crossed a threshold requiring staged defensive hardening under Google’s Fairwind Program. Inside Google’s own <strong>Project Fortify</strong> cyber defense trials, Carbon hit <strong>100% scan recall with 95% triage precision</strong>—meaning security teams were no longer drowning in false-positive scanner noise.',
        'Now that Koray Kavukcuoglu has opened `gemini-4-carbon` to all paying Gemini API and Google AI Studio developers (plus Google AI Ultra subscribers in Antigravity and Search AI Mode), independent third-party benchmarks show why builders were eager for the gate to lift. Carbon ranks <strong>#1 on CursorBench 4.0</strong> for real-world repository engineering, <strong>#1 on Perplexity WANDR</strong>, and <strong>#1 on Zapier AutomationBench at more than 2x lower cost per completed task</strong> than competing frontier models. Across 23 frontier configurations on the <strong>Balyasny General Financial Intelligence</strong> benchmark, Carbon claimed <strong>#1 outright</strong>.',
        'Alongside the API rollout, Google introduced <strong>`/swarm` inside Google Antigravity</strong>: a single prompt spins up a coordinated team of agents working in parallel across isolated repository worktrees, cross-checking each other’s implementations before merging.',
        'Now let me highlight the calendar date every founder and engineering manager should circle in ink: <strong>November 30, 2026</strong>. Through November 30, Carbon bills at an introductory rate of <strong>$2.00 per 1M input and $10.00 per 1M output tokens</strong>. On <strong>December 1, 2026</strong>, Carbon transitions to its permanent frontier tier of <strong>$4.00 per 1M input and $20.00 per 1M output</strong>. That makes the next two weeks your free dress rehearsal to wire 95% Context Caching and Hydrogen hybrid routing before the meter doubles.'
      ],
      pullquote: {
        quote:
          'Cost per million tokens is a vanity metric; cost per verified, finished task is what shows up on your P&L. Carbon wins CursorBench and Zapier AutomationBench because it finishes in fewer retries.',
        attribution: 'GOOGLE GEMINI 4 ARGON · α CASTOR EDITORIAL SYNTHESIS',
      },
      comparisonTable: {
        id: 'carbon-ga-pricing-table',
        caption: 'Gemini 4 Carbon GA Benchmarks & The December 1, 2026 Pricing Transition',
        columns: ['Dimension', 'Through Nov 30, 2026 (Intro)', 'Starting Dec 1, 2026 (Standard)', 'Architectural Mitigator'],
        rows: [
          [
            'Uncached Input (1,048,576 Window)',
            '$2.00 / 1M tokens',
            '$4.00 / 1M tokens',
            '95% Context Cache -> $0.10–$0.20 / 1M',
          ],
          [
            'Output & Long Decode (Up to 1M)',
            '$10.00 / 1M tokens',
            '$20.00 / 1M tokens',
            'Tune `thinking_level` + Hydrogen workers',
          ],
          [
            'Coding & Automation Rank',
            '#1 CursorBench 4.0 & Zapier',
            '#1 CursorBench 4.0 & Zapier',
            '>2x lower total cost per completed task',
          ],
          [
            'Cyber & Financial Rank',
            '100% Fortify recall · #1 Balyasny',
            '100% Fortify recall · #1 Balyasny',
            'Reserve Carbon for high-stakes synthesis',
          ],
        ],
      },
      adaptiveQuestions: [
        {
          lensTag: 'FOR ENGINEERING BUDGET OWNERS',
          question: 'What batch jobs should we intentionally run BEFORE November 30, 2026?',
          answer:
            'Any one-time whole-repository security audit, legacy codebase architecture mapping, large historical contract/financial dossier synthesis, or synthetic golden-dataset generation—running those heavy token sweeps before November 30 locks in the 50% lower introductory rate.',
        },
        {
          lensTag: 'CARBON `/SWARM` VS `/TEAMWORK`',
          question: 'How does `/swarm` in Antigravity relate to `/teamwork` on Star 02?',
          answer:
            '`/swarm` is the interactive developer experience inside Google Antigravity that spawns named parallel worker agents in isolated git worktrees collaborating over a shared message board (one implements, a peer reviews, a verifier tests), whereas `/teamwork` is the broader Google Research multi-agent + deterministic falsifier paradigm powering scientific and systems breakthroughs.',
        },
        {
          lensTag: 'LONG DECODE EXPLAINED',
          question: 'What does "Long Decode beyond 64K up to 1M tokens" unlock in plain terms?',
          answer:
            'Historically, models could *read* 1M tokens but choked at 8K–64K tokens when *writing* a response. Long Decode paired with `automatic_continuation: true` lets Carbon emit an entire multi-module migration, complete specification, or full regulatory filing cleanly in a single coherent turn.',
        },
      ],
    },
    pollux: {
      kicker: 'PART II · β POLLUX · LONG DECODE, 95% CACHING & SWARM ARCHITECTURE',
      title: 'December-Proofing Your Carbon Stack with Explicit Caching & Long Decode',
      subtitle:
        'How to hold effective input spend near $0.20/1M even after the December 1 rate step-up.',
      paragraphs: [
        'Let’s do the exact token math for December 1 so your architecture never flinches. Suppose your security or financial analysis agent repeatedly queries a 500,000-token repository or dataroom across 40 turns. If you re-send 500K uncached tokens 40 times at December’s $4.00/1M rate, you burn 20M input tokens = <strong>$80.00</strong>. If instead you pin that 500K dataroom in a <strong>95%-discounted Context Cache</strong> (`ai.caches.create`), you pay the base write once and pay <strong>$0.20/1M</strong> (just $0.10/1M through Nov 30!) on all 39 follow-up reads—slashing the exact same 40-turn session down to <strong>~$5.90</strong>.',
        'Second, take full advantage of Carbon’s <strong>tunable `thinking_level` (`"low"`, `"medium"`, `"high"`)</strong> per turn. Even inside a Carbon session, follow-up formatting or diff extraction turns do not need `"high"` reasoning depth—dropping follow-up turns to `"low"` or handing worker implementation off to `gemini-4-hydrogen` (`$7.50/1M` output vs. Carbon’s Dec 1 `$20.00/1M`) keeps total task cost more than 2x below rival frontier stacks.',
        'Finally, when emitting >64K-token outputs via <strong>Long Decode</strong>, always use the `@google/genai` v3.x Interactions API (`ai.interactions.create`) with `automatic_continuation: true` so multi-segment generation stitches seamlessly without brittle manual cursor loops.'
      ],
      builderRules: [
        {
          label: '01 · Cache Every Dataroom or Repo >32K Tokens',
          detail:
            'A 95% cache discount neutralizes the December 1 `$2 -> $4` input step-up whenever you run 3+ queries against the same context.',
        },
        {
          label: '02 · Pair `automatic_continuation: true` with Long Decode',
          detail:
            'Let the Interactions API handle >64K Long Decode continuations natively instead of fragile `"continue from line X"` user prompts.',
        },
        {
          label: '03 · Run One-Time Repo Security Sweeps Before Nov 30',
          detail:
            'Schedule deep whole-codebase security & architecture audits during November’s $2/$10 introductory window.',
        },
      ],
      codeCaption: 'COMPLETE @GOOGLE/GENAI v3.3.0 · 95% CONTEXT CACHE + CARBON LONG DECODE AUDIT',
      codeSnippet: `import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function runCachedCarbonSecuritySuite({ fullRepoBundle, auditPasses }) {
  // 1. Pin 100K–900K repo bundle once to unlock the 95% cached input discount
  const repoCache = await ai.caches.create({
    model: "gemini-4-carbon",
    config: {
      displayName: "repo-security-snapshot",
      contents: [{ role: "user", parts: [{ text: fullRepoBundle }] }],
      ttl: "3600s",
    },
  });

  // 2. Run multiple specialized Carbon passes at 95%-off cached input + Long Decode
  const findings = [];
  for (const passPrompt of auditPasses) {
    const interaction = await ai.interactions.create({
      model: "gemini-4-carbon",
      input: passPrompt,
      config: {
        cached_content: repoCache.name,
        thinking_config: { thinking_level: ThinkingLevel.HIGH },
        automatic_continuation: true, // Seamless >64K Long Decode
      },
    });
    findings.push({
      passPrompt,
      report: interaction.output_text,
      usage: interaction.usageMetadata,
    });
  }

  return { cacheName: repoCache.name, findings };
}`,
      workbench: {
        title: 'Carbon GA Economics & /swarm Simulator',
        subtitle: 'Compare Nov intro vs. Dec 1 pricing with 95% Context Caching.',
        dek: 'Model Carbon’s verified benchmark edge, caching math, and `/swarm` topology below, or launch the full Carbon Swarm Studio.',
        presets: [
          {
            label: '1. NOV INTRO WINDOW',
            k1: 'Active Through Nov 30',
            v1: '$2.00 In / $10.00 Out',
            k2: '95% Cached Input',
            v2: '$0.10 / 1M Cached Tokens',
            k3: 'Unified Context Pool',
            v3: '1,048,576 + Long Decode',
          },
          {
            label: '2. DEC 1 CACHE SHIELD',
            k1: 'Standard Rate (Dec 1+)',
            v1: '$4.00 In / $20.00 Out',
            k2: '40-Turn 500K Repo Cost',
            v2: '$5.90 Cached vs $80 Raw',
            k3: 'Hybrid Worker Split',
            v3: 'Carbon Lead + Hydrogen Run',
          },
          {
            label: '3. FORTIFY & /SWARM',
            k1: 'Cyber Defense Proof',
            v1: '100% Recall · 95% Precision',
            k2: 'Independent Rank',
            v2: '#1 CursorBench & Balyasny',
            k3: 'Antigravity Mode',
            v3: 'Isolated Worktree /swarm',
          },
        ],
      },
    },
    verdict: {
      title: 'Gemini’s Bottom Line: Wire Caching Now and Use the Two-Week Window',
      subtitle:
        'Carbon is the sharpest reasoning scalpel in the Gemini family—treat it with architectural discipline.',
      paragraphs: [
        '<strong>Deploy today if:</strong> you have been waiting on Fairwind preview access to run deep security audits, financial synthesis, or complex multi-file refactors—and run your heaviest one-off repository sweeps before November 30.',
        '<strong>Architect for December 1:</strong> combine `ai.caches.create()` (95% input discount) with `gemini-4-hydrogen` worker routing (`$1.50/$7.50`) so your production unit economics stay lean year-round.'
      ],
      sources: [
        {
          role: 'Official Google DeepMind GA Announcement',
          label: 'Google Blog — Gemini 4 Carbon is now available',
          author: 'Koray Kavukcuoglu (SVP & Chief AI Architect, Google DeepMind)',
          date: 'November 10, 2026',
          url: 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/',
        },
      ],
    },
  },
};
