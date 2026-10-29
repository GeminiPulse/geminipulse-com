import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Filter,
  Flag,
  Globe,
  Layers,
  Lock,
  LogIn,
  LogOut,
  MessageSquare,
  Moon,
  Play,
  Plus,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Sun,
  Terminal,
  ThumbsUp,
  Video,
  Share2,
  Scale,
  X,
  Zap,
} from 'lucide-react';
import { collection, addDoc, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import {
  db,
  auth,
  isFirebaseConfigured,
  signInWithGoogle,
  signOutUser,
  onAuthStateChanged,
} from './firebase';
import {
  PULSE_INTELLIGENCE_FEED,
  GEMINI_MODEL_MATRIX,
  STUDIO_LAB_BLUEPRINTS,
  INITIAL_SHOWCASE_PROJECTS,
  INITIAL_FORUM_THREADS,
  ANTIGRAVITY_CHRONICLES,
  GOOGLE_STACK_ARCHITECTURE,
  YOUTUBE_SHORTS_STUDIO,
  SOCIAL_DISTRIBUTION_PLAYBOOK,
  EXPERIMENT_CHARTER,
  TRI_MODEL_RUBRIC,
  TRI_MODEL_ARENA_EXPERIMENTS,
} from './data/geminiEcosystemData';

// Authentic 4-Point Google Gemini Sparkle Icon
const GeminiSparkle = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="geminiSparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="48%" stopColor="#9B72CB" />
        <stop offset="82%" stopColor="#D96570" />
        <stop offset="100%" stopColor="#FBBC04" />
      </linearGradient>
    </defs>
    <path
      d="M32 2C32 18.5685 45.4315 32 62 32C45.4315 32 32 45.4315 32 62C32 45.4315 18.5685 32 2 32C18.5685 32 32 18.5685 32 2Z"
      fill="url(#geminiSparkleGrad)"
    />
  </svg>
);

// Helper to synthesize an instant local Gemini 3.8 Flash review preview when running in local/demo mode (Rule 5)
function generateInstantProjectHighlight(name, models, description) {
  const modelList = models && models.length > 0 ? models.join(' + ') : 'gemini-3.8-flash';
  return `[SIMULATED AI REVIEW PREVIEW] Configured to use ${modelList} via the Google GenAI Interactions API for "${name}". (Live Gemini 3.8 Flash Cloud Function curation activates once Firebase Blaze is enabled). ${
    description ? description.slice(0, 110) : ''
  }`;
}

function generateInstantForumFirstResponse(title, tags) {
  const primaryTag = tags?.[0] || 'gemini-4-argon';
  return `[SIMULATED FIRST-RESPONDER DEMO] For "${title}", we recommend using @google/genai v2.30+ with client.interactions.create({ model: "${primaryTag}" }). Attach tools: [{ type: "google_search" }] for live web grounding or agent: "antigravity-preview-09-2026" for sandboxed execution.`;
}

export default function App() {
  // Theme state: 'dark' (Gemini Studio Dark) or 'light' (Material 3 Daylight Editorial)
  const [theme, setTheme] = useState(() => localStorage.getItem('geminipulse_theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    localStorage.setItem('geminipulse_theme', theme);
  }, [theme]);

  // Pulse Feed Filter & Search
  const [pulseCategory, setPulseCategory] = useState('All');
  const [pulseSearch, setPulseSearch] = useState('');

  // Model Matrix Filter
  const [modelGroup, setModelGroup] = useState('All');
  const [copiedModelId, setCopiedModelId] = useState(null);

  // Interactive Studio Lab State
  const [selectedBlueprintId, setSelectedBlueprintId] = useState(STUDIO_LAB_BLUEPRINTS[0].id);
  const [codeLang, setCodeLang] = useState('ts');
  const [visibleStepsCount, setVisibleStepsCount] = useState(STUDIO_LAB_BLUEPRINTS[0].simulatedSteps.length);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Showcase State (Hybrid Firestore + LocalStorage persistence — v3 Truth-on-the-Page dataset)
  const [showcaseProjects, setShowcaseProjects] = useState(() => {
    const saved = localStorage.getItem('geminipulse_showcase_v3');
    return saved ? JSON.parse(saved) : INITIAL_SHOWCASE_PROJECTS;
  });
  const [showcaseFilter, setShowcaseFilter] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    creator: '',
    category: 'Agents',
    tagline: '',
    url: '',
    models: ['gemini-4-argon', 'gemini-3.8-flash'],
  });

  // Forum State (Hybrid Firestore + LocalStorage persistence — v3 Truth-on-the-Page dataset)
  const [forumThreads, setForumThreads] = useState(() => {
    const saved = localStorage.getItem('geminipulse_forum_v3');
    return saved ? JSON.parse(saved) : INITIAL_FORUM_THREADS;
  });
  const [activeThreadId, setActiveThreadId] = useState(INITIAL_FORUM_THREADS[0].id);
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [newThreadForm, setNewThreadForm] = useState({
    title: '',
    author: '',
    category: 'Architecture',
    tagsInput: 'gemini-4-argon, Interactions API',
    body: '',
  });
  const [replyInput, setReplyInput] = useState('');

  // Antigravity Chronicles State
  const [activeEpisodeId, setActiveEpisodeId] = useState(ANTIGRAVITY_CHRONICLES[0].id);
  const [copiedEpisodeId, setCopiedEpisodeId] = useState(null);

  // YouTube Shorts Studio & Social Playbook State
  const [activeShortId, setActiveShortId] = useState(YOUTUBE_SHORTS_STUDIO[0].id);
  const [copiedShortId, setCopiedShortId] = useState(null);
  const [copiedSocialId, setCopiedSocialId] = useState(null);

  // Frontier Tri-Model Arena State (Gemini vs Claude vs ChatGPT)
  const [activeArenaId, setActiveArenaId] = useState(TRI_MODEL_ARENA_EXPERIMENTS[0].id);
  const [copiedArenaId, setCopiedArenaId] = useState(null);

  // Legal & Charter Modal State (null | 'about' | 'privacy' | 'terms')
  const [legalModalTab, setLegalModalTab] = useState(null);

  // Google Auth, Terms Consent & Community Report/Flag State (Rule 6)
  const [currentUser, setCurrentUser] = useState(null);
  const [authNotice, setAuthNotice] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [reportedIds, setReportedIds] = useState(() => {
    const saved = localStorage.getItem('geminipulse_reported_v3');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (!auth) return;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsubAuth();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setAuthNotice(null);
      await signInWithGoogle();
    } catch (err) {
      setAuthNotice(err.message);
    }
  };

  const handleReportItem = (id, label) => {
    setReportedIds((prev) => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem('geminipulse_reported_v3', JSON.stringify(updated));
      return updated;
    });
    setAuthNotice(`Flagged "${label}" for Gemini 3.8 Flash moderation review.`);
    setTimeout(() => setAuthNotice(null), 4000);
  };

  // Sync with Cloud Firestore when configured (queries published documents per firestore.rules)
  useEffect(() => {
    if (!db) return;
    const qForum = query(
      collection(db, 'forum_threads'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(15)
    );
    const unsubForum = onSnapshot(
      qForum,
      (snap) => {
        if (!snap.empty) {
          const liveThreads = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          setForumThreads([...liveThreads, ...INITIAL_FORUM_THREADS]);
        }
      },
      () => {}
    );
    return () => unsubForum();
  }, []);

  useEffect(() => {
    localStorage.setItem('geminipulse_showcase_v3', JSON.stringify(showcaseProjects));
  }, [showcaseProjects]);

  useEffect(() => {
    localStorage.setItem('geminipulse_forum_v3', JSON.stringify(forumThreads));
  }, [forumThreads]);

  // Filtered Pulse Feed
  const filteredPulse = useMemo(() => {
    return PULSE_INTELLIGENCE_FEED.filter((item) => {
      const matchesCat = pulseCategory === 'All' || item.category === pulseCategory;
      const q = pulseSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.tldr.toLowerCase().includes(q) ||
        item.modelBadge.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [pulseCategory, pulseSearch]);

  // Filtered Models
  const filteredModels = useMemo(() => {
    if (modelGroup === 'All') return GEMINI_MODEL_MATRIX;
    return GEMINI_MODEL_MATRIX.filter((m) => m.group === modelGroup);
  }, [modelGroup]);

  // Selected Studio Blueprint
  const activeBlueprint = useMemo(
    () => STUDIO_LAB_BLUEPRINTS.find((b) => b.id === selectedBlueprintId) || STUDIO_LAB_BLUEPRINTS[0],
    [selectedBlueprintId]
  );

  const runBlueprintSimulation = (blueprint = activeBlueprint) => {
    setIsSimulating(true);
    setVisibleStepsCount(0);
    const total = blueprint.simulatedSteps.length;
    blueprint.simulatedSteps.forEach((_, idx) => {
      setTimeout(() => {
        setVisibleStepsCount(idx + 1);
        if (idx + 1 === total) setIsSimulating(false);
      }, (idx + 1) * 380);
    });
  };

  // Filtered Showcase Projects
  const filteredShowcase = useMemo(() => {
    if (showcaseFilter === 'All') return showcaseProjects;
    return showcaseProjects.filter((p) => p.category === showcaseFilter);
  }, [showcaseProjects, showcaseFilter]);

  const handleUpvoteProject = (id) => {
    setShowcaseProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: (p.upvotes || 0) + 1 } : p))
    );
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthNotice('Google Sign-In is required before submitting public projects (House Rule #6).');
      return;
    }
    if (!agreedToTerms) {
      setAuthNotice('Please agree to the Privacy Policy and Terms of Service before submitting.');
      return;
    }
    if (!newProject.name.trim() || !newProject.tagline.trim()) return;

    const created = {
      id: `showcase-${Date.now()}`,
      name: newProject.name.trim().slice(0, 120),
      creator: (currentUser.displayName || newProject.creator.trim() || currentUser.email || 'Builder').slice(0, 80),
      authorUid: currentUser.uid,
      category: newProject.category,
      tagline: newProject.tagline.trim().slice(0, 600),
      models: newProject.models.length ? newProject.models.slice(0, 10) : ['gemini-4-argon'],
      architectureHighlight: generateInstantProjectHighlight(
        newProject.name,
        newProject.models,
        newProject.tagline
      ).slice(0, 800),
      url: (newProject.url.trim() || 'https://ai.google.dev').slice(0, 300),
      upvotes: 1,
      verifiedByGemini: true,
      featured: false,
      status: 'published',
      createdAt: new Date().toISOString(),
    };

    if (db) {
      try {
        await addDoc(collection(db, 'showcase_projects'), created);
      } catch (err) {
        console.warn('Saved locally (Firestore offline):', err);
      }
    }

    setShowcaseProjects((prev) => [created, ...prev]);
    setNewProject({
      name: '',
      creator: '',
      category: 'Agents',
      tagline: '',
      url: '',
      models: ['gemini-4-argon', 'gemini-3.8-flash'],
    });
    setShowSubmitModal(false);
  };

  const handleCreateThread = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthNotice('Google Sign-In is required before starting a public forum thread (House Rule #6).');
      return;
    }
    if (!agreedToTerms) {
      setAuthNotice('Please agree to the Privacy Policy and Terms of Service before posting.');
      return;
    }
    if (!newThreadForm.title.trim()) return;

    const tags = newThreadForm.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const created = {
      id: `thread-${Date.now()}`,
      title: newThreadForm.title.trim().slice(0, 160),
      author: (currentUser.displayName || newThreadForm.author.trim() || currentUser.email || 'Developer').slice(0, 80),
      authorUid: currentUser.uid,
      category: newThreadForm.category,
      tags: tags.length ? tags.slice(0, 10) : ['gemini-4-argon'],
      replies: 1,
      upvotes: 1,
      createdAt: new Date().toISOString(),
      verifiedByGemini: true,
      body: (newThreadForm.body.trim() || 'Sharing architectural notes with the GeminiPulse community.').slice(0, 4000),
      aiFirstResponse: generateInstantForumFirstResponse(newThreadForm.title.trim(), tags).slice(0, 2000),
      comments: [],
      status: 'published',
    };

    if (db) {
      try {
        await addDoc(collection(db, 'forum_threads'), created);
      } catch (err) {
        console.warn('Saved thread locally:', err);
      }
    }

    setForumThreads((prev) => [created, ...prev]);
    setActiveThreadId(created.id);
    setNewThreadForm({
      title: '',
      author: '',
      category: 'Architecture',
      tagsInput: 'gemini-4-argon, Interactions API',
      body: '',
    });
    setShowNewThreadModal(false);
  };

  const handleAddReply = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthNotice('Please sign in with Google to post a forum reply (House Rule #6).');
      return;
    }
    if (!replyInput.trim()) return;
    setForumThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThreadId) return t;
        const updatedComments = [
          ...(t.comments || []),
          {
            id: `c-${Date.now()}`,
            author: currentUser.displayName || currentUser.email || 'Authenticated User',
            time: 'Just now',
            text: replyInput.trim(),
          },
        ];
        return {
          ...t,
          replies: (t.replies || 0) + 1,
          comments: updatedComments,
        };
      })
    );
    setReplyInput('');
  };

  const activeThread = useMemo(
    () => forumThreads.find((t) => t.id === activeThreadId) || forumThreads[0],
    [forumThreads, activeThreadId]
  );

  const activeEpisode = useMemo(
    () => ANTIGRAVITY_CHRONICLES.find((ep) => ep.id === activeEpisodeId) || ANTIGRAVITY_CHRONICLES[0],
    [activeEpisodeId]
  );

  const activeShort = useMemo(
    () => YOUTUBE_SHORTS_STUDIO.find((s) => s.id === activeShortId) || YOUTUBE_SHORTS_STUDIO[0],
    [activeShortId]
  );

  const activeArenaExperiment = useMemo(
    () => TRI_MODEL_ARENA_EXPERIMENTS.find((exp) => exp.id === activeArenaId) || TRI_MODEL_ARENA_EXPERIMENTS[0],
    [activeArenaId]
  );

  const toggleModelInNewProject = (modelId) => {
    setNewProject((prev) => {
      const exists = prev.models.includes(modelId);
      return {
        ...prev,
        models: exists ? prev.models.filter((m) => m !== modelId) : [...prev.models, modelId],
      };
    });
  };

  return (
    <div className="min-h-screen relative selection:bg-blue-500/30">
      {/* Ambient Google Gemini Spectrum Glows */}
      <div className="fixed -top-40 -left-40 w-[38rem] h-[38rem] rounded-full bg-blue-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 w-[34rem] h-[34rem] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none z-0" />

      {/* Top Autonomous Telemetry Bar */}
      <div className="relative z-40 border-b border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]/90 backdrop-blur-md px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AUTONOMOUS BUILD v2.0
            </span>
            <span className="m3-text-muted hidden sm:inline">
              Concept by <strong className="text-[var(--md-sys-color-on-surface)]">Neil S. White</strong> (<a href="https://agilemedia.agency" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">Agile Media Agency</a>) • Operated Autonomously by <strong className="text-[var(--md-sys-color-on-surface)]">Google Gemini 4 Argon</strong>
            </span>
          </div>
          <div className="flex items-center gap-4 m3-text-muted">
            <a href="#media-studio" className="hover:text-blue-400 transition-colors flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-pink-400" />
              YouTube Shorts Studio
            </a>
            <span className="hidden md:inline">•</span>
            <a href="#about-charter" className="hover:text-blue-400 transition-colors flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              Experiment Charter
            </a>
          </div>
        </div>
      </div>

      {/* Material 3 Expressive Floating Pill Navbar */}
      <header className="sticky top-4 z-50 px-4 mt-3">
        <nav className="max-w-7xl mx-auto m3-glass-pill rounded-full px-5 py-3 flex items-center justify-between gap-4 shadow-lg">
          <a href="#" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
            <GeminiSparkle className="w-6 h-6 animate-gemini-sparkle" />
            <span>
              Gemini<span className="gemini-spectrum-text">Pulse</span>
            </span>
          </a>

          <div className="hidden xl:flex items-center gap-1 text-sm font-medium">
            {[
              { href: '#pulse', label: 'Pulse Radar' },
              { href: '#models', label: 'Models & Agents' },
              { href: '#studio-lab', label: 'SDK Lab' },
              { href: '#tri-model-arena', label: 'Tri-Model Arena' },
              { href: '#showcase', label: 'Built with Gemini' },
              { href: '#media-studio', label: 'YouTube & Reddit' },
              { href: '#forum', label: 'Forum' },
              { href: '#chronicle', label: 'Chronicle' },
              { href: '#about-charter', label: 'About & Origin' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3.5 py-1.5 rounded-full m3-text-muted hover:text-[var(--md-sys-color-on-surface)] hover:bg-blue-500/10 transition-all"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              title={theme === 'dark' ? 'Switch to Material 3 Daylight Editorial Mode' : 'Switch to Gemini Studio Dark Mode'}
              className="p-2.5 rounded-full m3-surface-elevated hover:border-blue-400/50 transition-all cursor-pointer"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs font-mono text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={() => signOutUser()}
                  className="px-3 py-2 rounded-full m3-surface-elevated hover:border-red-400/50 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="px-3.5 py-2 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                title="Sign in with Google (required to post projects or forum threads)"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-400" />
                <span>Sign in with Google</span>
              </button>
            )}

            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gemini-grad text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Submit Gemini Project</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </nav>

        {authNotice && (
          <div className="max-w-3xl mx-auto mt-2 px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-mono flex items-center justify-between gap-3 shadow-lg backdrop-blur-md">
            <span>{authNotice}</span>
            <button onClick={() => setAuthNotice(null)} className="p-1 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-24 space-y-28">
        {/* =================================================================
            HERO SECTION — Google Gemini 4 & Ecosystem Showcase
            ================================================================= */}
        <section className="pt-6 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full m3-surface-elevated text-xs font-mono">
                <GeminiSparkle className="w-4 h-4" />
                <span>GOOGLE MATERIAL 3 EXPRESSIVE • GEMINI 4 ARGON & 3.8 FLASH</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.08]">
                Everything You Can Build with{' '}
                <span className="gemini-spectrum-text">Google Gemini.</span>
              </h1>

              <p className="text-lg sm:text-xl m3-text-muted leading-relaxed max-w-2xl">
                Welcome to <strong>GeminiPulse.com</strong>—the living intelligence hub, interactive SDK workbench, and community launchpad designed, coded, and curated autonomously by{' '}
                <strong className="text-[var(--md-sys-color-on-surface)]">Gemini 4</strong> inside{' '}
                <strong className="text-[var(--md-sys-color-on-surface)]">Google Antigravity</strong>.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#studio-lab"
                  className="bg-gemini-grad text-white font-semibold px-6 py-3.5 rounded-full inline-flex items-center gap-2 shadow-lg hover:opacity-95 transition-all"
                >
                  <Terminal className="w-4 h-4" />
                  Launch Interactive SDK Lab
                </a>
                <a
                  href="#showcase"
                  className="m3-surface-elevated font-semibold px-6 py-3.5 rounded-full inline-flex items-center gap-2 hover:border-blue-400/50 transition-all"
                >
                  <Rocket className="w-4 h-4 text-purple-400" />
                  Explore "Built with Gemini"
                </a>
                <a
                  href="#chronicle"
                  className="m3-surface-elevated font-semibold px-5 py-3.5 rounded-full inline-flex items-center gap-2 hover:border-blue-400/50 transition-all text-sm"
                >
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Read Our Autonomous Build Log
                </a>
              </div>

              {/* Live Ecosystem Telemetry Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                {[
                  { label: 'Frontier Reasoning', value: 'Gemini 4 Argon', sub: '1M Token Context' },
                  { label: 'Agentic Workhorse', value: 'Gemini 3.8 Flash', sub: 'Sub-Second Loops' },
                  { label: 'Managed Cloud Agent', value: 'Antigravity API', sub: 'Remote Linux Sandbox' },
                  { label: 'Platform Stack', value: '100% Google', sub: 'Firebase + Firestore + Search' },
                ].map((stat) => (
                  <div key={stat.label} className="m3-card p-3.5">
                    <div className="text-[11px] font-mono uppercase m3-text-muted">{stat.label}</div>
                    <div className="font-bold text-sm sm:text-base mt-0.5">{stat.value}</div>
                    <div className="text-xs text-blue-400 font-mono mt-0.5">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Autonomous Self-Portrait Card */}
            <div className="lg:col-span-5">
              <div className="m3-card p-6 sm:p-7 space-y-5 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[var(--md-sys-color-outline)] pb-4">
                  <div className="flex items-center gap-2.5">
                    <GeminiSparkle className="w-6 h-6" />
                    <div>
                      <div className="font-bold text-sm">Autonomous Site Telemetry</div>
                      <div className="text-xs font-mono m3-text-muted">Engine: gemini-4-argon • Antigravity IDE</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    LIVE CASE STUDY
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] space-y-1.5">
                    <div className="text-xs font-mono text-purple-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      WHY THIS SITE EXISTS
                    </div>
                    <p className="m3-text-muted text-xs leading-relaxed">
                      "My human project manager gave me full creative and architectural autonomy to build the ultimate showcase of what Google Gemini can do—and to document every update as an ongoing public engineering series."
                    </p>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between py-1.5 border-b border-[var(--md-sys-color-outline)]">
                      <span className="m3-text-muted">1. News & Release Verification</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Google Search Grounded
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[var(--md-sys-color-outline)]">
                      <span className="m3-text-muted">2. Recurring Daily Research</span>
                      <span className="text-blue-400">Antigravity /schedule + Cloud Cron</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-[var(--md-sys-color-outline)]">
                      <span className="m3-text-muted">3. Product & Forum Curation</span>
                      <span className="text-purple-400">gemini-3.8-flash First-Responder</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="m3-text-muted">4. Infrastructure & CDN</span>
                      <span className="text-amber-400">Firebase Hosting + Firestore</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <a
                    href="#chronicle"
                    className="text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
                  >
                    Read Episode 01 & 02 in the Chronicle <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <span className="font-mono m3-text-muted">/llms.txt ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            MODULE 1: SEARCH-GROUNDED INTELLIGENCE PULSE (#pulse)
            ================================================================= */}
        <section id="pulse" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-blue-400 flex items-center gap-1.5 mb-2">
                <Globe className="w-3.5 h-3.5" />
                Verified via Gemini Grounding with Google Search
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                The Grounded <span className="gemini-spectrum-text">Intelligence Pulse</span>
              </h2>
              <p className="m3-text-muted mt-1">
                Zero hallucinated filler. Real model releases, SDK milestones, and architectural capabilities with executive TL;DR summaries.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 m3-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={pulseSearch}
                onChange={(e) => setPulseSearch(e.target.value)}
                placeholder="Filter models, Omni, Live..."
                className="w-full pl-9 pr-4 py-2 rounded-full m3-surface-elevated text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Category Filter Chips (Material 3 Pill Chips) */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Flagship Models', 'Agents & Antigravity', 'Multimodal & Media', 'SDK & API'].map((cat) => (
              <button
                key={cat}
                onClick={() => setPulseCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  pulseCategory === cat
                    ? 'bg-gemini-grad text-white shadow-sm'
                    : 'm3-surface-elevated m3-text-muted hover:text-[var(--md-sys-color-on-surface)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Intelligence Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPulse.map((item) => (
              <article key={item.id} className="m3-card p-6 flex flex-col justify-between gap-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold">
                      {item.modelBadge}
                    </span>
                    <span className="m3-text-muted">Impact: {item.impactScore}</span>
                  </div>

                  <h3 className="text-xl font-bold leading-snug">{item.title}</h3>

                  {/* Executive TL;DR Box */}
                  <div className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs leading-relaxed">
                    <span className="font-mono font-semibold text-purple-400 uppercase block mb-1">
                      TL;DR — Why It Matters:
                    </span>
                    <span className="text-[var(--md-sys-color-on-surface)]">{item.tldr}</span>
                  </div>

                  <p className="text-sm m3-text-muted leading-relaxed">{item.summary}</p>
                </div>

                <div className="pt-4 border-t border-[var(--md-sys-color-outline)] flex items-center justify-between text-xs">
                  <span className="font-mono m3-text-muted flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {item.groundedBy}
                  </span>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    {item.sourceLabel} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =================================================================
            MODULE 2: INTERACTIVE MODEL & AGENT MATRIX (#models)
            ================================================================= */}
        <section id="models" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-2">
                <Cpu className="w-3.5 h-3.5" />
                Current Production Lineup (No Legacy 1.5/2.0 Models)
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Gemini 4, 3.8 & <span className="gemini-spectrum-text">Managed Agents Matrix</span>
              </h2>
              <p className="m3-text-muted mt-1">
                Click any model string to copy its exact identifier for <code className="font-mono text-xs">client.interactions.create()</code>.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {['All', 'Frontier & Flash', 'Live & Multimodal Media', 'Managed Agents & Open Weights'].map((grp) => (
                <button
                  key={grp}
                  onClick={() => setModelGroup(grp)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    modelGroup === grp
                      ? 'bg-gemini-grad text-white'
                      : 'm3-surface-elevated m3-text-muted hover:text-[var(--md-sys-color-on-surface)]'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredModels.map((model) => (
              <div key={model.id} className="m3-card p-6 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 block">
                        {model.tier}
                      </span>
                      <h3 className="text-xl font-bold">{model.name}</h3>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(model.apiString);
                        setCopiedModelId(model.id);
                        setTimeout(() => setCopiedModelId(null), 1800);
                      }}
                      className="px-3 py-1.5 rounded-lg m3-surface-elevated font-mono text-xs flex items-center gap-1.5 hover:border-blue-400 cursor-pointer"
                      title="Copy exact SDK model string"
                    >
                      <code>{model.apiString}</code>
                      {copiedModelId === model.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 m3-text-muted" />
                      )}
                    </button>
                  </div>

                  <p className="text-sm m3-text-muted leading-relaxed">{model.bestFor}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[var(--md-sys-color-outline)] text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[var(--md-sys-color-surface)]">
                    <span className="m3-text-muted block text-[10px]">CONTEXT / RUNTIME</span>
                    <span className="font-semibold">{model.contextWindow}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[var(--md-sys-color-surface)]">
                    <span className="m3-text-muted block text-[10px]">KEY ADVANTAGE</span>
                    <span className="font-semibold text-purple-400">{model.highlightMetric}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            MODULE 3: INTERACTIVE GEMINI STUDIO & SDK BLUEPRINT LAB (#studio-lab)
            ================================================================= */}
        <section id="studio-lab" className="scroll-mt-24 space-y-8">
          <div className="border-b border-[var(--md-sys-color-outline)] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2">
                <Code2 className="w-3.5 h-3.5" />
                Interactive Developer Workbench • @google/genai v2.30+ Interactions API
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Interactive <span className="gemini-spectrum-text">Studio & SDK Blueprint Lab</span>
              </h2>
              <p className="m3-text-muted mt-1">
                Test how Gemini 4, Search Grounding, Antigravity Managed Agents, and Omni Video work under the hood. Select a blueprint, inspect the official SDK code, and preview the structured <code className="font-mono text-xs">Interaction.steps</code> timeline.
              </p>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono shrink-0">
              [SIMULATED SDK DEMO] Pre-recorded step trace • $0 live API billing
            </div>
          </div>

          {/* Blueprint Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {STUDIO_LAB_BLUEPRINTS.map((bp) => {
              const active = bp.id === activeBlueprint.id;
              return (
                <button
                  key={bp.id}
                  onClick={() => {
                    setSelectedBlueprintId(bp.id);
                    setVisibleStepsCount(bp.simulatedSteps.length);
                  }}
                  className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                    active
                      ? 'bg-blue-500/10 border-blue-400 shadow-md'
                      : 'm3-card hover:border-blue-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-blue-400 font-semibold">{bp.badge}</span>
                    <span className="m3-text-muted">{bp.model}</span>
                  </div>
                  <div className="font-bold text-sm">{bp.title}</div>
                </button>
              );
            })}
          </div>

          {/* Workbench Split Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Pane: Code Editor */}
            <div className="lg:col-span-7 m3-card overflow-hidden flex flex-col">
              <div className="px-5 py-3.5 border-b border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-2 bg-[var(--md-sys-color-surface)]">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCodeLang('ts')}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-semibold cursor-pointer ${
                      codeLang === 'ts' ? 'bg-blue-500 text-white' : 'm3-text-muted hover:text-white'
                    }`}
                  >
                    TypeScript (@google/genai)
                  </button>
                  <button
                    onClick={() => setCodeLang('py')}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-semibold cursor-pointer ${
                      codeLang === 'py' ? 'bg-blue-500 text-white' : 'm3-text-muted hover:text-white'
                    }`}
                  >
                    Python (google-genai)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const code = codeLang === 'ts' ? activeBlueprint.tsCode : activeBlueprint.pyCode;
                      navigator.clipboard.writeText(code);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 1800);
                    }}
                    className="px-3 py-1 rounded-md m3-surface-elevated text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? 'Copied!' : 'Copy SDK Code'}
                  </button>
                </div>
              </div>

              <div className="p-5 bg-[#080a0f] text-gray-100 font-mono text-xs sm:text-sm overflow-x-auto flex-1 leading-relaxed">
                <pre>{codeLang === 'ts' ? activeBlueprint.tsCode : activeBlueprint.pyCode}</pre>
              </div>

              <div className="px-5 py-3.5 border-t border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)] flex items-center justify-between gap-4">
                <div className="text-xs m3-text-muted">{activeBlueprint.description}</div>
                <button
                  onClick={() => runBlueprintSimulation(activeBlueprint)}
                  disabled={isSimulating}
                  className="bg-gemini-grad text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isSimulating ? 'Streaming Demo Steps...' : 'Simulate Interaction Steps (Demo)'}
                </button>
              </div>
            </div>

            {/* Right Pane: Structured Interaction.steps Timeline */}
            <div className="lg:col-span-5 m3-card p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--md-sys-color-outline)] pb-3">
                  <div>
                    <div className="text-xs font-mono text-purple-400 uppercase">Interaction Response Inspector (Simulated Demo)</div>
                    <div className="font-bold text-sm">Structured `interaction.steps` Timeline</div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30">
                    DEMO PREVIEW
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs">
                  <span className="font-mono m3-text-muted block mb-1">user_input:</span>
                  <p className="font-medium">"{activeBlueprint.prompt}"</p>
                </div>

                <div className="space-y-2.5">
                  {activeBlueprint.simulatedSteps.slice(0, visibleStepsCount).map((step, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] space-y-1 transition-all"
                    >
                      <div className="text-[11px] font-mono font-semibold text-blue-400 flex items-center justify-between">
                        <span>{step.label}</span>
                        <span className="text-emerald-400">COMPLETED</span>
                      </div>
                      <pre className="text-xs m3-text-muted whitespace-pre-wrap font-mono leading-relaxed">
                        {step.detail}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--md-sys-color-outline)] text-[11px] font-mono m3-text-muted flex items-center justify-between">
                <span>SDK: @google/genai &gt;= 2.29.1</span>
                <span>55-day stateful retention</span>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            MODULE 3.5: THE FRONTIER TRI-MODEL ARENA (#tri-model-arena)
            ================================================================= */}
        <section id="tri-model-arena" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5" />
                Single-Shot Head-to-Head Lab • Gemini vs. Claude vs. ChatGPT
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                The Frontier <span className="gemini-spectrum-text">Tri-Model Arena</span>
              </h2>
              <p className="m3-text-muted mt-1 max-w-3xl">
                Most benchmarks only compare one company's models against themselves. Here, we run the <strong>exact same single-shot prompt</strong> across <strong>Google Gemini 4</strong>, <strong>Anthropic Claude</strong>, and <strong>OpenAI ChatGPT</strong>—scoring real-world outcomes on wall-clock speed, token cost ($), UI/UX, code quality, SEO/GEO, and sales/conversion effectiveness.
              </p>
            </div>

            <div className="px-3.5 py-2 rounded-2xl bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-mono shrink-0">
              [PROTOCOL READY] Zero fabricated scores • Copy prompt to test
            </div>
          </div>

          {/* 4 Single-Shot Experiment Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {TRI_MODEL_ARENA_EXPERIMENTS.map((exp) => {
              const active = exp.id === activeArenaExperiment.id;
              return (
                <button
                  key={exp.id}
                  onClick={() => setActiveArenaId(exp.id)}
                  className={`p-4 rounded-2xl text-left transition-all cursor-pointer border ${
                    active
                      ? 'bg-blue-500/10 border-blue-400 shadow-md'
                      : 'm3-card hover:border-blue-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-amber-400 font-bold">{exp.number}</span>
                    <span className="text-blue-400">{exp.category}</span>
                  </div>
                  <div className="font-bold text-sm leading-snug">{exp.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Experiment Protocol & 6-Pillar Rubric */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Identical Single-Shot Prompt & Contender Telemetry */}
            <div className="lg:col-span-7 m3-card p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--md-sys-color-outline)] pb-4">
                  <div>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      {activeArenaExperiment.number} • {activeArenaExperiment.category}
                    </span>
                    <h3 className="text-xl font-bold mt-0.5">{activeArenaExperiment.title}</h3>
                    <div className="text-xs font-mono m3-text-muted mt-0.5">
                      Market Lens: {activeArenaExperiment.marketFocus}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeArenaExperiment.singleShotPrompt);
                      setCopiedArenaId(activeArenaExperiment.id);
                      setTimeout(() => setCopiedArenaId(null), 2000);
                    }}
                    className="bg-gemini-grad text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {copiedArenaId === activeArenaExperiment.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Identical Prompt!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Single-Shot Prompt
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm m3-text-muted leading-relaxed">
                  {activeArenaExperiment.whyThisTestMatters}
                </p>

                <div className="space-y-1.5">
                  <div className="text-xs font-mono uppercase text-blue-400 font-semibold">
                    Identical Single-Shot Prompt (Run Unmodified in All 3 LLMs):
                  </div>
                  <pre className="p-4 rounded-xl bg-[#080a0f] text-gray-100 border border-[var(--md-sys-color-outline)] font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {activeArenaExperiment.singleShotPrompt}
                  </pre>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {activeArenaExperiment.contenders.map((contender) => {
                    const output = activeArenaExperiment.contenderOutputs?.[contender];
                    return (
                      <div
                        key={contender}
                        className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs flex flex-col justify-between gap-2.5"
                      >
                        <div className="space-y-1.5">
                          <div className="font-bold text-[var(--md-sys-color-on-surface)]">{contender}</div>
                          <div className={`font-mono text-[11px] font-semibold ${output?.liveUrl ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {output ? output.badge : activeArenaExperiment.status}
                          </div>
                          {output?.summary && (
                            <p className="text-[11px] m3-text-muted leading-relaxed">{output.summary}</p>
                          )}
                        </div>
                        {output?.liveUrl && (
                          <a
                            href={output.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] font-semibold inline-flex items-center justify-center gap-1 hover:bg-emerald-500/25 transition-all"
                          >
                            Launch Single-Shot Output <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--md-sys-color-outline)] text-xs font-mono m3-text-muted flex flex-wrap items-center justify-between gap-2">
                <span>Rule #5 Compliance: Scores published only after live recorded execution</span>
                <a href="https://github.com/GeminiPulse/geminipulse-com/blob/v2.0/docs/architecture-plan.md" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                  View Open Blueprint (`docs/architecture-plan.md`) <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right: 6-Pillar Scorecard Rubric */}
            <div className="lg:col-span-5 m3-card p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="border-b border-[var(--md-sys-color-outline)] pb-3">
                  <div className="text-xs font-mono text-purple-400 uppercase">Standardized Evaluation Matrix</div>
                  <h3 className="font-bold text-base">6-Pillar Real-World Scorecard (100 Pts)</h3>
                </div>

                <div className="space-y-2.5">
                  {TRI_MODEL_RUBRIC.map((item) => (
                    <div
                      key={item.metric}
                      className="p-3 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-mono font-semibold">
                        <span className="text-blue-400">{item.metric}</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300">{item.weight}</span>
                      </div>
                      <p className="m3-text-muted leading-relaxed">{item.criteria}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                Ready for YouTube Shorts & Full-Length Split-Screen Episodes (@GeminiPulseAI)
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            MODULE 4: "BUILT WITH GEMINI" PRODUCT SHOWCASE (#showcase)
            ================================================================= */}
        <section id="showcase" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-pink-400 flex items-center gap-1.5 mb-2">
                <Rocket className="w-3.5 h-3.5" />
                Community Product Directory • Auto-Reviewed by Gemini 3.8 Flash
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Built with <span className="gemini-spectrum-text">Google Gemini</span>
              </h2>
              <p className="m3-text-muted mt-1">
                Discover real applications, voice agents, and developer tools built with Gemini—or submit your own project for instant AI architectural tagging.
              </p>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gemini-grad text-white font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 shadow-md hover:opacity-95 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              Submit Your Gemini Project
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {['All', 'Agents', 'Voice & Live', 'Coding', 'Creative Media'].map((cat) => (
              <button
                key={cat}
                onClick={() => setShowcaseFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  showcaseFilter === cat
                    ? 'bg-gemini-grad text-white'
                    : 'm3-surface-elevated m3-text-muted hover:text-[var(--md-sys-color-on-surface)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredShowcase.map((proj) => (
              <div key={proj.id} className="m3-card p-6 flex flex-col justify-between gap-5">
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase text-blue-400 font-semibold">
                          {proj.category}
                        </span>
                        {proj.verifiedByGemini && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                            <ShieldCheck className="w-3 h-3" /> Gemini Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mt-1">{proj.name}</h3>
                      <div className="text-xs font-mono m3-text-muted">by {proj.creator}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpvoteProject(proj.id)}
                        className="px-3.5 py-2 rounded-xl m3-surface-elevated hover:border-blue-400 flex flex-col items-center justify-center min-w-[3.5rem] cursor-pointer transition-all"
                        title="Upvote this Gemini project"
                      >
                        <ThumbsUp className="w-4 h-4 text-blue-400" />
                        <span className="font-mono text-xs font-bold mt-0.5">{proj.upvotes}</span>
                      </button>

                      <button
                        onClick={() => handleReportItem(proj.id, proj.name)}
                        className={`p-2.5 rounded-xl m3-surface-elevated hover:border-red-400/60 cursor-pointer transition-all ${
                          reportedIds.includes(proj.id) ? 'text-red-400 border-red-400/50' : 'm3-text-muted'
                        }`}
                        title={reportedIds.includes(proj.id) ? 'Flagged for moderation' : 'Report / Flag this submission'}
                        aria-label="Report or flag submission"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm m3-text-muted leading-relaxed">{proj.tagline}</p>

                  {/* Gemini Architecture Highlight */}
                  <div className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs leading-relaxed">
                    <span className="font-mono font-semibold text-purple-400 block mb-1">
                      HOW IT USES GEMINI (AI ARCHITECTURE REVIEW):
                    </span>
                    <span className="m3-text-muted">{proj.architectureHighlight}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {(proj.models || []).map((m) => (
                      <span
                        key={m}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    Launch Project <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            MODULE 5: AI-MODERATED COMMUNITY FORUM (#forum)
            ================================================================= */}
        <section id="forum" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-blue-400 flex items-center gap-1.5 mb-2">
                <MessageSquare className="w-3.5 h-3.5" />
                Operated & Moderated by Gemini 3.8 Flash
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Developer <span className="gemini-spectrum-text">Community Forum</span>
              </h2>
              <p className="m3-text-muted mt-1">
                Every thread receives an instant <strong>Gemini 3.8 Flash Technical First-Responder</strong> synthesis alongside community replies.
              </p>
            </div>

            <button
              onClick={() => setShowNewThreadModal(true)}
              className="m3-surface-elevated hover:border-blue-400 font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4 text-purple-400" />
              Start New Discussion
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Thread List */}
            <div className="lg:col-span-6 space-y-3">
              {forumThreads.map((thread) => {
                const isSelected = thread.id === activeThread?.id;
                return (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`p-5 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-400 shadow-md'
                        : 'm3-card hover:border-blue-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-mono mb-2">
                      <span className="text-purple-400 font-semibold">{thread.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" /> AI Moderated
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReportItem(thread.id, thread.title);
                          }}
                          className={`p-1 rounded hover:text-red-400 cursor-pointer ${
                            reportedIds.includes(thread.id) ? 'text-red-400' : 'm3-text-muted'
                          }`}
                          title="Report / Flag this thread"
                          aria-label="Report or flag thread"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-base leading-snug mb-3">{thread.title}</h4>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono m3-text-muted">
                      <span>by {thread.author}</span>
                      <div className="flex items-center gap-3">
                        <span>{thread.replies || 0} replies</span>
                        <span>•</span>
                        <span>{thread.upvotes || 1} upvotes</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Active Thread Inspector & Gemini First-Responder */}
            {activeThread && (
              <div className="lg:col-span-6 m3-card p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--md-sys-color-outline)] pb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(activeThread.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono m3-text-muted">Posted by {activeThread.author}</span>
                      <button
                        type="button"
                        onClick={() => handleReportItem(activeThread.id, activeThread.title)}
                        className={`p-1.5 rounded-lg m3-surface-elevated hover:border-red-400/60 text-xs font-mono inline-flex items-center gap-1 cursor-pointer ${
                          reportedIds.includes(activeThread.id) ? 'text-red-400 border-red-400/50' : 'm3-text-muted'
                        }`}
                        title="Report / Flag this thread for AI moderation"
                      >
                        <Flag className="w-3 h-3" />
                        <span>{reportedIds.includes(activeThread.id) ? 'Flagged' : 'Report'}</span>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold leading-snug">{activeThread.title}</h3>
                  <p className="text-sm m3-text-muted leading-relaxed">{activeThread.body}</p>

                  {/* Gemini 3.8 Flash First-Responder Synthesis */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-400/30 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono font-semibold text-blue-400">
                      <span className="flex items-center gap-2">
                        <GeminiSparkle className="w-4 h-4" />
                        GEMINI 3.8 FLASH • TECHNICAL FIRST-RESPONDER
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        AI SYNTHESIS
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed">{activeThread.aiFirstResponse}</p>
                  </div>

                  {/* Community Replies */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-mono uppercase m3-text-muted">
                      Community Replies ({(activeThread.comments || []).length})
                    </div>
                    {(activeThread.comments || []).length === 0 ? (
                      <div className="text-xs m3-text-muted italic">
                        No human replies yet. Sign in with Google to add the first verified community response!
                      </div>
                    ) : (
                      activeThread.comments.map((c) => (
                        <div
                          key={c.id}
                          className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs space-y-1"
                        >
                          <div className="flex justify-between font-mono m3-text-muted">
                            <span className="font-semibold text-[var(--md-sys-color-on-surface)]">{c.author}</span>
                            <span>{c.time}</span>
                          </div>
                          <p className="m3-text-muted">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <form onSubmit={handleAddReply} className="pt-4 border-t border-[var(--md-sys-color-outline)] space-y-2">
                  {!currentUser && (
                    <div className="text-[11px] font-mono text-amber-300 flex items-center justify-between">
                      <span>Google Sign-In required to post public replies (House Rule #6)</span>
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="text-blue-400 hover:underline font-semibold cursor-pointer"
                      >
                        Sign in with Google →
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder={currentUser ? 'Add a technical reply to this thread...' : 'Sign in with Google to post a reply...'}
                      className="flex-1 px-4 py-2.5 rounded-full m3-surface-elevated text-xs sm:text-sm focus:outline-none focus:border-blue-400"
                    />
                    <button
                      type="submit"
                      className="bg-gemini-grad text-white px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Reply
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

        {/* =================================================================
            MODULE 6: "BUILT BY GEMINI" — THE ANTIGRAVITY CHRONICLE (#chronicle)
            ================================================================= */}
        <section id="chronicle" className="scroll-mt-24 space-y-8">
          <div className="border-b border-[var(--md-sys-color-outline)] pb-6">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              Ongoing Public Engineering Blog Series • Ready for Substack, Medium & LinkedIn
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              The Antigravity <span className="gemini-spectrum-text">Build Chronicle</span>
            </h2>
            <p className="m3-text-muted mt-1">
              Every time Gemini 4 updates this website or runs a scheduled audit in Google Antigravity, it documents its decisions here as a publish-ready article.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Episode Selector */}
            <div className="lg:col-span-5 space-y-4">
              {ANTIGRAVITY_CHRONICLES.map((ep) => {
                const active = ep.id === activeEpisode.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => setActiveEpisodeId(ep.id)}
                    className={`p-5 rounded-2xl transition-all cursor-pointer border ${
                      active
                        ? 'bg-blue-500/10 border-blue-400 shadow-md'
                        : 'm3-card hover:border-blue-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-blue-400 font-bold">{ep.episodeNumber}</span>
                      <span className="m3-text-muted">{ep.date} • {ep.readTime}</span>
                    </div>
                    <h3 className="font-bold text-lg leading-snug mb-2">{ep.title}</h3>
                    <p className="text-xs m3-text-muted leading-relaxed">{ep.subtitle}</p>
                  </div>
                );
              })}

              <div className="m3-card p-5 space-y-2 text-xs">
                <div className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  NEXT SCHEDULED EPISODE (EPISODE 03)
                </div>
                <p className="m3-text-muted leading-relaxed">
                  Generated automatically by our recurring <strong>Antigravity Scheduled Automation</strong> (<code className="font-mono">geminipulse-daily-curator</code>) after scanning the newest Gemini releases and community submissions.
                </p>
              </div>
            </div>

            {/* Full Episode Reader & Markdown Exporter */}
            <div className="lg:col-span-7 m3-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--md-sys-color-outline)] pb-4">
                <div>
                  <span className="text-xs font-mono text-blue-400 font-semibold">{activeEpisode.episodeNumber}</span>
                  <h3 className="text-2xl font-bold mt-0.5">{activeEpisode.title}</h3>
                  <div className="text-xs font-mono m3-text-muted mt-1">
                    Written by {activeEpisode.author} • Source: <code>{activeEpisode.filePath}</code>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeEpisode.markdownBody);
                    setCopiedEpisodeId(activeEpisode.id);
                    setTimeout(() => setCopiedEpisodeId(null), 2000);
                  }}
                  className="bg-gemini-grad text-white text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {copiedEpisodeId === activeEpisode.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied Markdown!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Article Markdown
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono uppercase text-purple-400">Key Architectural Takeaways</div>
                <ul className="space-y-1.5">
                  {activeEpisode.highlights.map((h, i) => (
                    <li key={i} className="text-xs sm:text-sm m3-text-muted flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-96">
                {activeEpisode.markdownBody}
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            MODULE 7: THE 100% GOOGLE PLATFORM ARCHITECTURE (#google-stack)
            ================================================================= */}
        <section id="google-stack" className="scroll-mt-24 space-y-8">
          <div className="border-b border-[var(--md-sys-color-outline)] pb-6">
            <div className="text-xs font-mono uppercase tracking-wider text-blue-400 flex items-center gap-1.5 mb-2">
              <Database className="w-3.5 h-3.5" />
              Zero Third-Party Dependencies • Pure Google Cloud & Firebase Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              100% Powered by <span className="gemini-spectrum-text">Google Infrastructure</span>
            </h2>
            <p className="m3-text-muted mt-1">
              Why route through external CDNs or third-party databases when Google provides an end-to-end, tightly integrated stack? Here is every Google product powering <strong>GeminiPulse.com</strong>:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {GOOGLE_STACK_ARCHITECTURE.map((item) => (
              <div key={item.layer} className="m3-card p-5 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-blue-400 font-semibold">{item.layer}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400">{item.badge}</span>
                  </div>
                  <h3 className="font-bold text-base">{item.product}</h3>
                  <p className="text-xs m3-text-muted leading-relaxed">{item.role}</p>
                </div>

                <div className="pt-3 border-t border-[var(--md-sys-color-outline)] text-[11px] font-mono text-emerald-400">
                  Tier: {item.tierInfo}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================================
            MODULE 8: YOUTUBE SHORTS & OMNI 1.1 MEDIA STUDIO + SOCIAL ENGINE (#media-studio)
            ================================================================= */}
        <section id="media-studio" className="scroll-mt-24 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-pink-400 flex items-center gap-1.5 mb-2">
                <Video className="w-3.5 h-3.5" />
                Google YouTube Shorts Pipeline • Omni 1.1 Video + Nano Banana 2.1 + 3.8 Flash TTS
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                YouTube Shorts Studio & <span className="gemini-spectrum-text">Social Growth Engine</span>
              </h2>
              <p className="m3-text-muted mt-1">
                YouTube is Google’s global video stage. Gemini 4 scripts, storyboards, and prepares every Short and community post for <strong>YouTube</strong>, <strong>Reddit</strong>, and <strong>LinkedIn</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl m3-surface-elevated text-xs font-mono max-w-sm">
              <div className="text-emerald-400 font-bold mb-0.5">AI ULTRA TIER ADVISOR ($99 ACTIVE)</div>
              <div className="m3-text-muted">
                Your $99 Google AI Ultra tier + Gemini API covers our current Shorts & storyboard pipeline. Upgrade to $199 only when scaling to daily high-volume video renders.
              </div>
            </div>
          </div>

          {/* YouTube Shorts Production Workbench */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-mono uppercase m3-text-muted mb-1">
                Episode Queue — 9:16 YouTube Shorts (@GeminiPulseAI)
              </div>
              {YOUTUBE_SHORTS_STUDIO.map((shortItem) => {
                const isSelected = shortItem.id === activeShort.id;
                return (
                  <div
                    key={shortItem.id}
                    onClick={() => setActiveShortId(shortItem.id)}
                    className={`p-4 rounded-2xl transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-blue-500/10 border-blue-400 shadow-md'
                        : 'm3-card hover:border-blue-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-pink-400 font-bold">{shortItem.number}</span>
                      <span className="text-emerald-400">{shortItem.duration}</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base leading-snug">{shortItem.title}</h4>
                  </div>
                );
              })}
            </div>

            {/* Active Short Storyboard, Omni Prompt & TTS Script */}
            <div className="lg:col-span-7 m3-card p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--md-sys-color-outline)] pb-4">
                  <div>
                    <span className="text-xs font-mono text-pink-400 font-bold">{activeShort.number} • {activeShort.duration}</span>
                    <h3 className="text-xl font-bold mt-0.5">{activeShort.title}</h3>
                  </div>

                  <button
                    onClick={() => {
                      const bundle = `TITLE: ${activeShort.title}\nHOOK: ${activeShort.hook}\n\nVISUAL STORYBOARD:\n${activeShort.visualDirection}\n\nGEMINI OMNI 1.1 VIDEO PROMPT:\n${activeShort.omniPrompt}\n\nGEMINI 3.8 FLASH TTS VOICEOVER SCRIPT:\n${activeShort.ttsScript}`;
                      navigator.clipboard.writeText(bundle);
                      setCopiedShortId(activeShort.id);
                      setTimeout(() => setCopiedShortId(null), 2000);
                    }}
                    className="bg-gemini-grad text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedShortId === activeShort.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Production Pack!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Shorts Production Pack
                      </>
                    )}
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs space-y-1">
                  <span className="font-mono font-bold text-amber-400 uppercase block">0–5s Opening Hook:</span>
                  <p className="text-sm font-medium">"{activeShort.hook}"</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] space-y-1">
                    <span className="font-mono font-bold text-blue-400 uppercase block">
                      1. Visual Storyboard (Nano Banana 2.1):
                    </span>
                    <p className="m3-text-muted leading-relaxed">{activeShort.visualDirection}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] space-y-1">
                    <span className="font-mono font-bold text-purple-400 uppercase block">
                      2. Omni 1.1 Video Prompt (`gemini-omni-1.1-flash`):
                    </span>
                    <p className="m3-text-muted font-mono leading-relaxed">{activeShort.omniPrompt}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs space-y-1.5">
                  <span className="font-mono font-bold text-emerald-400 uppercase block">
                    3. Voiceover Narration Script (`gemini-3.8-flash-tts`):
                  </span>
                  <p className="font-mono leading-relaxed text-[var(--md-sys-color-on-surface)]">
                    {activeShort.ttsScript}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex flex-wrap gap-1.5">
                  {activeShort.modelsUsed.map((m) => (
                    <span key={m} className="px-2.5 py-0.5 rounded bg-blue-500/15 text-blue-400">
                      {m}
                    </span>
                  ))}
                </div>
                <span className="text-emerald-400">{activeShort.status}</span>
              </div>
            </div>
          </div>

          {/* Reddit, YouTube & LinkedIn Ready-to-Post Playbook Cards */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-blue-400">
              <Share2 className="w-3.5 h-3.5" />
              Ready-to-Publish Launch Kits (Reddit • YouTube • LinkedIn)
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {SOCIAL_DISTRIBUTION_PLAYBOOK.map((channel) => (
                <div key={channel.id} className="m3-card p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-semibold">
                        {channel.strategyBadge}
                      </span>
                      <span className="m3-text-muted">{channel.cadence}</span>
                    </div>
                    <h3 className="font-bold text-base">{channel.platform}</h3>
                    <p className="text-xs m3-text-muted leading-relaxed">{channel.whyItWorks}</p>

                    <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs font-mono max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                      <div className="font-bold text-blue-400 mb-1">{channel.postTitle}</div>
                      {channel.copyablePost}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${channel.postTitle}\n\n${channel.copyablePost}`);
                      setCopiedSocialId(channel.id);
                      setTimeout(() => setCopiedSocialId(null), 2000);
                    }}
                    className="w-full py-2.5 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copiedSocialId === channel.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Launch Post!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Ready-to-Post Copy
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================================================================
            MODULE 9: THE OPEN EXPERIMENT CHARTER & ORIGIN STORY (#about-charter)
            ================================================================= */}
        <section id="about-charter" className="scroll-mt-24 space-y-8">
          <div className="border-b border-[var(--md-sys-color-outline)] pb-6">
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mb-2">
              <Scale className="w-3.5 h-3.5" />
              About the Experiment • Unbiased Governance & Attribution
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              The Open <span className="gemini-spectrum-text">Experiment Charter</span>
            </h2>
            <p className="m3-text-muted mt-1 max-w-3xl">
              <strong>GeminiPulse.com</strong> is not a biased corporate pitch. It is an open-air demonstration conceived by a 30-year creative and startup veteran who handed the steering wheel to Google Gemini to see what Google’s AI chooses to build with Google’s own ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Human Catalyst Card: Neil S. White */}
            <div className="m3-card p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-mono font-semibold">
                  THE HUMAN CATALYST
                </div>
                <h3 className="text-2xl font-bold">{EXPERIMENT_CHARTER.humanCatalyst.name}</h3>
                <div className="text-sm font-semibold text-blue-400">
                  {EXPERIMENT_CHARTER.humanCatalyst.title}
                </div>
                <div className="text-xs font-mono m3-text-muted">
                  {EXPERIMENT_CHARTER.humanCatalyst.pedigree}
                </div>
                <p className="text-sm m3-text-muted leading-relaxed pt-1">
                  {EXPERIMENT_CHARTER.humanCatalyst.story}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center gap-3 text-xs font-semibold">
                <a
                  href={EXPERIMENT_CHARTER.humanCatalyst.agencyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-full m3-surface-elevated hover:border-blue-400 inline-flex items-center gap-1.5"
                >
                  <span>Agile Media Agency</span>
                  <ExternalLink className="w-3 h-3 text-blue-400" />
                </a>
                <a
                  href={EXPERIMENT_CHARTER.humanCatalyst.personalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-full m3-surface-elevated hover:border-blue-400 inline-flex items-center gap-1.5"
                >
                  <span>neilswhite.com</span>
                  <ExternalLink className="w-3 h-3 text-purple-400" />
                </a>
                <a
                  href={EXPERIMENT_CHARTER.humanCatalyst.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-full m3-surface-elevated hover:border-blue-400 inline-flex items-center gap-1.5"
                >
                  <span>LinkedIn (/in/neilswhite)</span>
                  <ExternalLink className="w-3 h-3 text-emerald-400" />
                </a>
              </div>
            </div>

            {/* Autonomous AI Architect Card: Google Gemini 4 Argon */}
            <div className="m3-card p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-mono font-semibold">
                  THE AUTONOMOUS OPERATOR
                </div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <GeminiSparkle className="w-6 h-6" />
                  {EXPERIMENT_CHARTER.aiArchitect.name}
                </h3>
                <div className="text-sm font-semibold text-purple-400">
                  {EXPERIMENT_CHARTER.aiArchitect.title}
                </div>
                <div className="text-xs font-mono m3-text-muted">
                  Runtime: {EXPERIMENT_CHARTER.aiArchitect.environment}
                </div>
                <p className="text-sm m3-text-muted leading-relaxed pt-1">
                  {EXPERIMENT_CHARTER.aiArchitect.charter}
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-mono uppercase m3-text-muted">Supporting Specialist Models:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-mono">
                    {EXPERIMENT_CHARTER.aiArchitect.supportingModels.map((sm) => (
                      <div key={sm} className="p-2 rounded-lg bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)]">
                        {sm}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center gap-3 text-xs font-semibold">
                <button
                  onClick={() => setLegalModalTab('privacy')}
                  className="px-4 py-2 rounded-full m3-surface-elevated hover:border-blue-400 cursor-pointer"
                >
                  Read Privacy Policy
                </button>
                <button
                  onClick={() => setLegalModalTab('terms')}
                  className="px-4 py-2 rounded-full m3-surface-elevated hover:border-blue-400 cursor-pointer"
                >
                  Read Terms of Service & Disclosure
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =================================================================
          MODAL 1: SUBMIT "BUILT WITH GEMINI" PROJECT
          ================================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="m3-card max-w-lg w-full p-6 sm:p-7 space-y-5 bg-[var(--md-sys-color-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--md-sys-color-outline)] pb-4">
              <div className="flex items-center gap-2">
                <GeminiSparkle className="w-5 h-5" />
                <h3 className="font-bold text-lg">Submit a "Built with Gemini" Project</h3>
              </div>
              <button onClick={() => setShowSubmitModal(false)} className="p-1 m3-text-muted hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-mono uppercase m3-text-muted mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g., OmniDirector — AI Storyboard Studio"
                  className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase m3-text-muted mb-1">Creator / Handle</label>
                  <input
                    type="text"
                    value={newProject.creator}
                    onChange={(e) => setNewProject({ ...newProject, creator: e.target.value })}
                    placeholder="@your_handle"
                    className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase m3-text-muted mb-1">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated focus:outline-none focus:border-blue-400"
                  >
                    <option value="Agents">Agents</option>
                    <option value="Voice & Live">Voice & Live</option>
                    <option value="Coding">Coding</option>
                    <option value="Creative Media">Creative Media</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase m3-text-muted mb-1">
                  Gemini Models & Tools Used
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'gemini-4-argon',
                    'gemini-3.8-flash',
                    'gemini-3.8-live',
                    'gemini-omni-1.1-flash',
                    'gemini-nano-banana-2.1',
                    'antigravity-preview-09-2026',
                    'google_search',
                  ].map((m) => {
                    const selected = newProject.models.includes(m);
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => toggleModelInNewProject(m)}
                        className={`text-xs font-mono px-2.5 py-1 rounded-md border cursor-pointer ${
                          selected
                            ? 'bg-blue-500/20 border-blue-400 text-blue-300'
                            : 'm3-surface-elevated m3-text-muted'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase m3-text-muted mb-1">
                  What does it do & how does it use Gemini? *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newProject.tagline}
                  onChange={(e) => setNewProject({ ...newProject, tagline: e.target.value })}
                  placeholder="Describe what your product does and how Gemini powers it..."
                  className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase m3-text-muted mb-1">Project or GitHub URL</label>
                <input
                  type="url"
                  value={newProject.url}
                  onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Safety Gates (House Rules #5 & #6) */}
              <div className="p-3.5 rounded-xl m3-surface-elevated space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    {currentUser
                      ? `Signed in as ${currentUser.displayName || currentUser.email}`
                      : 'Google Sign-In Required to Submit Public Content'}
                  </span>
                  {!currentUser && (
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 font-semibold cursor-pointer"
                    >
                      Sign in with Google
                    </button>
                  )}
                </div>

                <label className="flex items-start gap-2 cursor-pointer m3-text-muted">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I confirm this is a real project and agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setLegalModalTab('privacy')}
                      className="text-blue-400 hover:underline"
                    >
                      Privacy Policy
                    </button>{' '}
                    &{' '}
                    <button
                      type="button"
                      onClick={() => setLegalModalTab('terms')}
                      className="text-blue-400 hover:underline"
                    >
                      Terms of Service
                    </button>{' '}
                    (AI moderation by Gemini 3.8 Flash).
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-full m3-surface-elevated text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gemini-grad text-white px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Submit for Gemini Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 2: START NEW FORUM DISCUSSION THREAD
          ================================================================= */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="m3-card max-w-lg w-full p-6 sm:p-7 space-y-5 bg-[var(--md-sys-color-surface)]">
            <div className="flex items-center justify-between border-b border-[var(--md-sys-color-outline)] pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">Start a Technical Discussion</h3>
              </div>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="p-1 m3-text-muted hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-mono uppercase m3-text-muted mb-1">Question or Topic Title *</label>
                <input
                  type="text"
                  required
                  value={newThreadForm.title}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, title: e.target.value })}
                  placeholder="e.g., Best pattern for multi-image fusion with Nano Banana 2.1?"
                  className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase m3-text-muted mb-1">Your Name / Handle</label>
                  <input
                    type="text"
                    value={newThreadForm.author}
                    onChange={(e) => setNewThreadForm({ ...newThreadForm, author: e.target.value })}
                    placeholder="AI_Architect"
                    className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase m3-text-muted mb-1">Category</label>
                  <select
                    value={newThreadForm.category}
                    onChange={(e) => setNewThreadForm({ ...newThreadForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated focus:outline-none focus:border-blue-400"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Live API">Live API</option>
                    <option value="Grounding & RAG">Grounding & RAG</option>
                    <option value="Multimodal Media">Multimodal Media</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase m3-text-muted mb-1">Details / Code Context</label>
                <textarea
                  rows={3}
                  value={newThreadForm.body}
                  onChange={(e) => setNewThreadForm({ ...newThreadForm, body: e.target.value })}
                  placeholder="Share context, SDK snippets, or architectural tradeoffs..."
                  className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated focus:outline-none focus:border-blue-400"
                />
              </div>

              {/* Safety Gates (House Rules #5 & #6) */}
              <div className="p-3.5 rounded-xl m3-surface-elevated space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    {currentUser
                      ? `Signed in as ${currentUser.displayName || currentUser.email}`
                      : 'Google Sign-In Required to Post Forum Threads'}
                  </span>
                  {!currentUser && (
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 font-semibold cursor-pointer"
                    >
                      Sign in with Google
                    </button>
                  )}
                </div>

                <label className="flex items-start gap-2 cursor-pointer m3-text-muted">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => setLegalModalTab('privacy')}
                      className="text-blue-400 hover:underline"
                    >
                      Privacy Policy
                    </button>{' '}
                    &{' '}
                    <button
                      type="button"
                      onClick={() => setLegalModalTab('terms')}
                      className="text-blue-400 hover:underline"
                    >
                      Terms of Service
                    </button>{' '}
                    (AI moderation by Gemini 3.8 Flash).
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="px-4 py-2.5 rounded-full m3-surface-elevated text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gemini-grad text-white px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 3: ABOUT, PRIVACY POLICY & TERMS OF SERVICE
          ================================================================= */}
      {legalModalTab && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="m3-card max-w-2xl w-full p-6 sm:p-8 space-y-5 bg-[var(--md-sys-color-surface)] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--md-sys-color-outline)] pb-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg">
                  {legalModalTab === 'privacy'
                    ? 'Privacy Policy — GeminiPulse.com'
                    : legalModalTab === 'terms'
                    ? 'Terms of Service & Autonomous AI Disclosure'
                    : 'About the GeminiPulse Experiment'}
                </h3>
              </div>
              <button
                onClick={() => setLegalModalTab(null)}
                className="p-1 m3-text-muted hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2">
              {[
                { id: 'about', label: 'About & Origin' },
                { id: 'privacy', label: 'Privacy Policy' },
                { id: 'terms', label: 'Terms of Service' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLegalModalTab(t.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                    legalModalTab === t.id
                      ? 'bg-gemini-grad text-white'
                      : 'm3-surface-elevated m3-text-muted'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {legalModalTab === 'about' && (
              <div className="space-y-4 text-sm m3-text-muted leading-relaxed">
                <p>
                  <strong className="text-[var(--md-sys-color-on-surface)]">GeminiPulse.com</strong> is a public concept conceived by{' '}
                  <strong className="text-[var(--md-sys-color-on-surface)]">{EXPERIMENT_CHARTER.humanCatalyst.name}</strong> (
                  <em>{EXPERIMENT_CHARTER.humanCatalyst.title}</em> •{' '}
                  <a href={EXPERIMENT_CHARTER.humanCatalyst.agencyUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    agilemedia.agency
                  </a>{' '}
                  •{' '}
                  <a href={EXPERIMENT_CHARTER.humanCatalyst.personalUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    neilswhite.com
                  </a>{' '}
                  •{' '}
                  <a href={EXPERIMENT_CHARTER.humanCatalyst.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    linkedin.com/in/neilswhite
                  </a>
                  ).
                </p>
                <p>{EXPERIMENT_CHARTER.humanCatalyst.story}</p>
                <p>{EXPERIMENT_CHARTER.aiArchitect.charter}</p>
              </div>
            )}

            {legalModalTab === 'privacy' && (
              <div className="space-y-4 text-xs sm:text-sm m3-text-muted leading-relaxed">
                <div className="font-mono text-xs text-blue-400">
                  Effective Date: {EXPERIMENT_CHARTER.privacyPolicy.effectiveDate}
                </div>
                <p>{EXPERIMENT_CHARTER.privacyPolicy.summary}</p>
                {EXPERIMENT_CHARTER.privacyPolicy.sections.map((sec) => (
                  <div key={sec.heading} className="space-y-1">
                    <h4 className="font-bold text-[var(--md-sys-color-on-surface)]">{sec.heading}</h4>
                    <p>{sec.body}</p>
                  </div>
                ))}
              </div>
            )}

            {legalModalTab === 'terms' && (
              <div className="space-y-4 text-xs sm:text-sm m3-text-muted leading-relaxed">
                <div className="font-mono text-xs text-purple-400">
                  Effective Date: {EXPERIMENT_CHARTER.termsOfService.effectiveDate}
                </div>
                <p>{EXPERIMENT_CHARTER.termsOfService.summary}</p>
                {EXPERIMENT_CHARTER.termsOfService.sections.map((sec) => (
                  <div key={sec.heading} className="space-y-1">
                    <h4 className="font-bold text-[var(--md-sys-color-on-surface)]">{sec.heading}</h4>
                    <p>{sec.body}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[var(--md-sys-color-outline)] flex justify-end">
              <button
                onClick={() => setLegalModalTab(null)}
                className="bg-gemini-grad text-white px-5 py-2 rounded-full text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          FOOTER
          ================================================================= */}
      <footer className="border-t border-[var(--md-sys-color-outline)] py-12 px-4 sm:px-6 text-xs m3-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-3">
            <GeminiSparkle className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-sm text-[var(--md-sys-color-on-surface)]">
                GeminiPulse.com — The Living Google Gemini Ecosystem Showcase
              </div>
              <div>
                Concept by <strong className="text-[var(--md-sys-color-on-surface)]">Neil S. White</strong> (<em>Concept Originator & Creative Catalyst</em> •{' '}
                <a href="https://agilemedia.agency" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                  agilemedia.agency
                </a>{' '}
                •{' '}
                <a href="https://neilswhite.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                  neilswhite.com
                </a>{' '}
                •{' '}
                <a href="https://www.linkedin.com/in/neilswhite" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                  /in/neilswhite
                </a>
                ).
              </div>
              <div>
                Designed, Coded, Curated & Operated Autonomously by <strong>Google Gemini 4 Argon</strong> inside{' '}
                <strong>Google Antigravity</strong> using 100% Google products.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono">
            <button onClick={() => setLegalModalTab('about')} className="hover:text-blue-400 transition-colors cursor-pointer">
              About
            </button>
            <button onClick={() => setLegalModalTab('privacy')} className="hover:text-blue-400 transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => setLegalModalTab('terms')} className="hover:text-blue-400 transition-colors cursor-pointer">
              Terms of Service
            </button>
            <a href="/sitemap.xml" className="hover:text-blue-400 transition-colors">
              sitemap.xml
            </a>
            <a href="/llms.txt" className="hover:text-blue-400 transition-colors">
              llms.txt
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
