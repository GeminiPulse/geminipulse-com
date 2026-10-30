import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Filter,
  Flag,
  Globe,
  Heart,
  Layers,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  Moon,
  Play,
  Plus,
  Rocket,
  Rss,
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
import {
  loadFirebaseRuntime,
  signInWithGoogle,
  signOutUser,
  trackPulseEvent,
} from './firebase';
import buildMeta from './buildMeta.json';
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
  CONTRIBUTIONS_LEDGER,
  PERFORMANCE_TELEMETRY_LEDGER,
  TRI_MODEL_RUBRIC,
  TRI_MODEL_ARENA_EXPERIMENTS,
  GEMINI_4_CARBON_RELEASE_SERIES,
  GET_STARTED_WITH_GEMINI_TRACKS,
  GEMINI_VIDEO_SHOWCASE,
  STRIPE_SUPPORT_CONFIG,
  GEMINIPULSE_STUDIO_AGENTS_MATRIX,
  GEMINI_TWIN_ADDONS_CATALOG,
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

// Authentic 4-Color Google G Emblem for Sign-In Button
const GoogleGIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Helper component that parses backticked `code` segments into styled <code className="m3-inline-code"> pills
const InlineCodeText = ({ text }) => {
  if (!text || typeof text !== 'string') return text;
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={idx} className="m3-inline-code">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
};

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

  // Showcase State (Hybrid Firestore + LocalStorage persistence — v4 merges curated/Labs items with user submissions)
  const [showcaseProjects, setShowcaseProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('geminipulse_showcase_v4');
      if (!saved) return INITIAL_SHOWCASE_PROJECTS;
      const parsed = JSON.parse(saved);
      const seedIds = new Set(INITIAL_SHOWCASE_PROJECTS.map((p) => p.id));
      const userAdded = Array.isArray(parsed) ? parsed.filter((p) => !seedIds.has(p.id)) : [];
      return [...userAdded, ...INITIAL_SHOWCASE_PROJECTS];
    } catch {
      return INITIAL_SHOWCASE_PROJECTS;
    }
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

  // Plugins, Agents & (T)winning Add-Ons Hub State (#addons)
  const [addonTierFilter, setAddonTierFilter] = useState('All');
  const [addonAudienceFilter, setAddonAudienceFilter] = useState('All');
  const [copiedAddonInstallId, setCopiedAddonInstallId] = useState(null);
  const [showStudioAgentsMatrix, setShowStudioAgentsMatrix] = useState(true);
  const [copiedArenaId, setCopiedArenaId] = useState(null);
  const [showArenaPreview, setShowArenaPreview] = useState(true);

  // Legal & Charter Modal State (null | 'about' | 'privacy' | 'terms')
  const [legalModalTab, setLegalModalTab] = useState(null);

  // Business & Creator Inquiries Modal State (Write-Only Cloud Firestore Intake)
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    organization: '',
    inquiryType: 'Business & Partnerships',
    message: '',
  });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState(null);

  // Owned Audience Email Dispatch State (Write-Only Cloud Firestore Intake)
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState(null);

  // Release Deep-Dive Series & Curated YouTube Video Gallery State
  const [activeSeriesPartId, setActiveSeriesPartId] = useState(
    GEMINI_4_CARBON_RELEASE_SERIES.articles[0].id
  );
  const [videoCategory, setVideoCategory] = useState('All');
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const handleSubmitBusinessInquiry = async (e) => {
    e.preventDefault();
    if (inquirySubmitting) return;
    const trimmedName = inquiryForm.name.trim();
    const trimmedEmail = inquiryForm.email.trim();
    const trimmedOrg = inquiryForm.organization.trim();
    const trimmedMessage = inquiryForm.message.trim();
    const submittedTopic = inquiryForm.inquiryType;
    if (!trimmedName || !trimmedEmail || trimmedMessage.length < 10) {
      setInquiryStatus({
        type: 'error',
        text: 'Please provide your name, a valid email address, and a message of at least 10 characters.',
      });
      return;
    }
    setInquirySubmitting(true);
    setInquiryStatus(null);
    try {
      const { db, fs } = await loadFirebaseRuntime();
      if (db && fs) {
        await fs.addDoc(fs.collection(db, 'business_inquiries'), {
          name: trimmedName.slice(0, 100),
          email: trimmedEmail.slice(0, 160),
          organization: trimmedOrg.slice(0, 120),
          inquiryType: submittedTopic,
          message: trimmedMessage.slice(0, 3000),
          createdAt: new Date().toISOString(),
        });
      }
      trackPulseEvent('business_inquiry_submit', { inquiry_type: submittedTopic });
      setInquiryStatus({
        type: 'success',
        submittedTopic,
        text: 'Your inquiry has been securely recorded in Cloud Firestore. Thank you—the program creator reviews business, creator, and technical inquiries directly.',
      });
      setInquiryForm({
        name: '',
        email: '',
        organization: '',
        inquiryType: 'Business & Partnerships',
        message: '',
      });
    } catch (err) {
      setInquiryStatus({
        type: 'error',
        text: `Unable to submit inquiry right now (${err.code || 'network_error'}). Please check your fields and try again.`,
      });
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleSubscribeNewsletter = async (e) => {
    e.preventDefault();
    if (newsletterSubmitting) return;
    const trimmedEmail = newsletterEmail.trim();
    if (!trimmedEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      setNewsletterStatus({
        type: 'error',
        text: 'Please enter a valid email address (for example, name@company.com).',
      });
      return;
    }
    setNewsletterSubmitting(true);
    setNewsletterStatus(null);
    try {
      const { db, fs } = await loadFirebaseRuntime();
      if (db && fs) {
        await fs.addDoc(fs.collection(db, 'newsletter_subscribers'), {
          email: trimmedEmail.slice(0, 160),
          source: 'performance_dispatch_bar',
          createdAt: new Date().toISOString(),
        });
      }
      trackPulseEvent('newsletter_subscribe', { source: 'performance_dispatch_bar' });
      setNewsletterStatus({
        type: 'success',
        text: 'Subscribed to the Weekly Pulse & Thursday Tri-Model Arena Dispatch.',
      });
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterStatus({
        type: 'error',
        text: `Unable to subscribe right now (${err.code || 'network_error'}). Please try again.`,
      });
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  // Google Auth, Terms Consent & Community Report/Flag State (Rule 6)
  const [currentUser, setCurrentUser] = useState(null);
  const [authNotice, setAuthNotice] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [reportedIds, setReportedIds] = useState(() => {
    const saved = localStorage.getItem('geminipulse_reported_v3');
    return saved ? JSON.parse(saved) : [];
  });
  const [liveUpvotes, setLiveUpvotes] = useState([]);
  const [liveRepliesByThread, setLiveRepliesByThread] = useState({});
  const [fbRuntime, setFbRuntime] = useState(null);

  // Hydrate Firebase Auth & Cloud Firestore after initial FCP/LCP paint (idle callback / 1.8s fallback)
  useEffect(() => {
    let cancelled = false;
    let unsubAuth = null;
    const startHydration = () => {
      loadFirebaseRuntime().then((rt) => {
        if (cancelled) return;
        setFbRuntime(rt);
        if (rt.auth && rt.authMod) {
          unsubAuth = rt.authMod.onAuthStateChanged(rt.auth, (user) => {
            if (!cancelled) setCurrentUser(user || null);
          });
        }
      });
    };
    const timer = setTimeout(startHydration, 1800);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (unsubAuth) unsubAuth();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      setAuthNotice(null);
      const rt = await loadFirebaseRuntime();
      setFbRuntime(rt);
      const user = await signInWithGoogle();
      if (user) setCurrentUser(user);
    } catch (err) {
      setAuthNotice(err.message);
    }
  };

  // Support / Contribute Native <dialog> State (Stripe Payment Links via Agile LLC -> GeminiPulse)
  const supportDialogRef = useRef(null);
  const [supportTier, setSupportTier] = useState('one-time');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const [supportStatus, setSupportStatus] = useState(null);

  const openSupportDialog = useCallback(
    (initialTier = 'one-time') => {
      setSupportTier(initialTier);
      setSupportStatus(null);
      if (currentUser?.email) {
        setSupportEmail((prev) => prev || currentUser.email);
      }
      const dlg = supportDialogRef.current;
      if (dlg && !dlg.open) {
        dlg.showModal();
      }
      trackPulseEvent('support_modal_open', { tier: initialTier });
    },
    [currentUser]
  );

  const closeSupportDialog = useCallback(() => {
    const dlg = supportDialogRef.current;
    if (dlg && dlg.open) {
      dlg.close();
    }
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const hadSupportParam = url.searchParams.has('support');
      if (hadSupportParam) url.searchParams.delete('support');
      if (url.hash === '#support' || hadSupportParam) {
        const cleanSearch = url.searchParams.toString();
        window.history.replaceState(
          null,
          '',
          url.pathname + (cleanSearch ? `?${cleanSearch}` : '') + (url.hash === '#support' ? '' : url.hash)
        );
      }
    }
  }, []);

  // Safari fallback for <dialog closedby="any"> light-dismiss + #support / ?support= return opener
  useEffect(() => {
    const dlg = supportDialogRef.current;
    let removeFallback = null;
    if (dlg && typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype)) {
      const onBackdropClick = (event) => {
        if (event.target !== dlg) return;
        const rect = dlg.getBoundingClientRect();
        const isInside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!isInside) dlg.close();
      };
      dlg.addEventListener('click', onBackdropClick);
      removeFallback = () => dlg.removeEventListener('click', onBackdropClick);
    }

    const checkHash = () => {
      const params = new URLSearchParams(window.location.search);
      const supportReturn = params.get('support');
      if (supportReturn === 'welcome' || supportReturn === 'thanks') {
        const isMonthly = supportReturn === 'welcome';
        setSupportTier(isMonthly ? 'monthly' : 'one-time');
        setSupportStatus({
          type: 'success',
          heading: isMonthly
            ? 'Welcome Aboard — Founding Supporter Membership Active!'
            : 'Thank You — GeminiPulse Supporter Contribution Confirmed!',
          text: isMonthly
            ? 'Your Founding Supporter & Pro Insider membership is live via Stripe. Check your email for your Stripe receipt, and use the Manage Existing Membership link below anytime to update or cancel in one click.'
            : 'Your contribution directly fuels weekly Thursday Frontier Tri-Model Arena benchmark runs, open-source web utilities, and independent Google Gemini ecosystem coverage.',
        });
        if (dlg && !dlg.open) {
          dlg.showModal();
        }
        trackPulseEvent('stripe_checkout_return', {
          tier: isMonthly ? 'monthly' : 'one-time',
        });
        return;
      }
      if (window.location.hash === '#support') {
        openSupportDialog('one-time');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => {
      window.removeEventListener('hashchange', checkHash);
      if (removeFallback) removeFallback();
    };
  }, [openSupportDialog]);

  const handleSupportPledgeSubmit = async (e) => {
    e.preventDefault();
    if (supportSubmitting) return;
    const trimmedEmail = supportEmail.trim();
    if (!trimmedEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      setSupportStatus({
        type: 'error',
        text: 'Please enter a valid email address so we can send your direct Stripe link.',
      });
      return;
    }
    setSupportSubmitting(true);
    setSupportStatus(null);
    const sourceKey =
      supportTier === 'monthly'
        ? 'stripe_supporter_pledge_monthly'
        : 'stripe_supporter_pledge_onetime';
    try {
      const { db, fs } = await loadFirebaseRuntime();
      if (db && fs) {
        await fs.addDoc(fs.collection(db, 'newsletter_subscribers'), {
          email: trimmedEmail.slice(0, 160),
          source: sourceKey,
          createdAt: new Date().toISOString(),
        });
      }
      trackPulseEvent('support_pledge_submit', { tier: supportTier });
      setSupportStatus({
        type: 'success',
        tier: supportTier,
        text:
          supportTier === 'monthly'
            ? 'You are on the Founding Supporter ($9/mo) early list! We recorded your email in Cloud Firestore and will notify you the moment the GeminiPulse Stripe link goes live.'
            : 'Thank you for backing GeminiPulse! We recorded your email in Cloud Firestore and will send the direct Stripe Contribution link as soon as checkout activates.',
      });
      setSupportEmail('');
    } catch (err) {
      setSupportStatus({
        type: 'error',
        text: `Unable to save right now (${err.code || 'network_error'}). Please try again.`,
      });
    } finally {
      setSupportSubmitting(false);
    }
  };

  const handleReportItem = async (id, label, targetType = 'showcase_project') => {
    setReportedIds((prev) => {
      const updated = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem('geminipulse_reported_v3', JSON.stringify(updated));
      return updated;
    });
    if (currentUser) {
      try {
        const { db, fs } = fbRuntime || (await loadFirebaseRuntime());
        if (db && fs) {
          await fs.addDoc(fs.collection(db, 'content_reports'), {
            targetId: String(id).slice(0, 120),
            targetType,
            targetLabel: String(label || id).slice(0, 200),
            reporterUid: currentUser.uid,
            reason: 'Community flagged via UI Report control for Gemini 3.8 Flash moderation review',
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.warn('Recorded report locally:', err);
      }
    }
    setAuthNotice(`Flagged "${label}" for Gemini 3.8 Flash moderation review.`);
    setTimeout(() => setAuthNotice(null), 4000);
  };

  // Sync with Cloud Firestore once post-paint runtime is hydrated
  useEffect(() => {
    if (!fbRuntime?.db || !fbRuntime?.fs) return;
    const { db, fs } = fbRuntime;
    const qForum = fs.query(
      fs.collection(db, 'forum_threads'),
      fs.where('status', '==', 'published'),
      fs.orderBy('createdAt', 'desc'),
      fs.limit(15)
    );
    const unsubForum = fs.onSnapshot(
      qForum,
      (snap) => {
        if (!snap.empty) {
          const liveThreads = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
          const liveIds = new Set(liveThreads.map((t) => t.id));
          setForumThreads([
            ...liveThreads,
            ...INITIAL_FORUM_THREADS.filter((t) => !liveIds.has(t.id)),
          ]);
        }
      },
      () => {}
    );

    const qShowcase = fs.query(
      fs.collection(db, 'showcase_projects'),
      fs.where('status', '==', 'published'),
      fs.orderBy('createdAt', 'desc'),
      fs.limit(20)
    );
    const unsubShowcase = fs.onSnapshot(
      qShowcase,
      (snap) => {
        if (!snap.empty) {
          const liveProjects = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
          const liveIds = new Set(liveProjects.map((p) => p.id));
          setShowcaseProjects([
            ...liveProjects,
            ...INITIAL_SHOWCASE_PROJECTS.filter((p) => !liveIds.has(p.id)),
          ]);
        }
      },
      () => {}
    );

    const qUpvotes = fs.query(fs.collection(db, 'project_upvotes'), fs.limit(500));
    const unsubUpvotes = fs.onSnapshot(
      qUpvotes,
      (snap) => {
        setLiveUpvotes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      () => {}
    );

    return () => {
      unsubForum();
      unsubShowcase();
      unsubUpvotes();
    };
  }, [fbRuntime]);

  // Subscribe to global Cloud Firestore replies for the active forum thread
  useEffect(() => {
    if (!fbRuntime?.db || !fbRuntime?.fs || !activeThreadId) return;
    const { db, fs } = fbRuntime;
    const qReplies = fs.query(
      fs.collection(db, 'forum_threads', activeThreadId, 'replies'),
      fs.where('status', '==', 'published'),
      fs.limit(100)
    );
    const unsubReplies = fs.onSnapshot(
      qReplies,
      (snap) => {
        const items = snap.docs
          .map((d) => ({ ...d.data(), id: d.id }))
          .sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
        setLiveRepliesByThread((prev) => ({ ...prev, [activeThreadId]: items }));
      },
      () => {}
    );
    return () => unsubReplies();
  }, [fbRuntime, activeThreadId]);

  useEffect(() => {
    localStorage.setItem('geminipulse_showcase_v4', JSON.stringify(showcaseProjects));
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
    trackPulseEvent('sdk_blueprint_run', { blueprint_id: blueprint.id });
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

  const activeSeriesArticle = useMemo(
    () =>
      GEMINI_4_CARBON_RELEASE_SERIES.articles.find((a) => a.id === activeSeriesPartId) ||
      GEMINI_4_CARBON_RELEASE_SERIES.articles[0],
    [activeSeriesPartId]
  );

  const featuredVideoOfTheDay = useMemo(
    () => GEMINI_VIDEO_SHOWCASE.find((v) => v.featuredOfTheDay) || GEMINI_VIDEO_SHOWCASE[0],
    []
  );

  const filteredVideos = useMemo(() => {
    const galleryItems = GEMINI_VIDEO_SHOWCASE.filter((v) => v.id !== featuredVideoOfTheDay.id);
    if (videoCategory === 'All') return galleryItems;
    return galleryItems.filter((v) => v.category === videoCategory);
  }, [videoCategory, featuredVideoOfTheDay]);

  // Live aggregated upvote counts & current user's upvoted project IDs from Cloud Firestore
  const liveUpvoteCounts = useMemo(() => {
    const counts = {};
    liveUpvotes.forEach((u) => {
      if (u.projectId) {
        counts[u.projectId] = (counts[u.projectId] || 0) + 1;
      }
    });
    return counts;
  }, [liveUpvotes]);

  const userUpvotedSet = useMemo(() => {
    if (!currentUser) return new Set();
    return new Set(
      liveUpvotes.filter((u) => u.voterUid === currentUser.uid).map((u) => u.projectId)
    );
  }, [liveUpvotes, currentUser]);

  // Filtered Showcase Projects
  const filteredShowcase = useMemo(() => {
    if (showcaseFilter === 'All') return showcaseProjects;
    return showcaseProjects.filter((p) => p.category === showcaseFilter);
  }, [showcaseProjects, showcaseFilter]);

  const handleUpvoteProject = async (id) => {
    if (!currentUser) {
      setAuthNotice('Sign in with Google to cast a verified global upvote (1 vote per Google account).');
      setTimeout(() => setAuthNotice(null), 4000);
      return;
    }
    const cleanId = String(id).slice(0, 120);
    const upvoteDocId = `${cleanId}_${currentUser.uid}`;
    const alreadyUpvoted = userUpvotedSet.has(cleanId);

    try {
      const { db, fs } = fbRuntime || (await loadFirebaseRuntime());
      if (db && fs) {
        const upvoteRef = fs.doc(db, 'project_upvotes', upvoteDocId);
        if (alreadyUpvoted) {
          await fs.deleteDoc(upvoteRef);
        } else {
          await fs.setDoc(upvoteRef, {
            projectId: cleanId,
            voterUid: currentUser.uid,
            createdAt: new Date().toISOString(),
          });
        }
        return;
      }
    } catch (err) {
      console.warn('Upvote fallback to local state:', err);
    }

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

    try {
      const { db, fs } = fbRuntime || (await loadFirebaseRuntime());
      if (db && fs) {
        await fs.setDoc(fs.doc(db, 'showcase_projects', created.id), created);
      }
    } catch (err) {
      console.warn('Saved locally (Firestore offline):', err);
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
      replies: 0,
      upvotes: 1,
      createdAt: new Date().toISOString(),
      verifiedByGemini: true,
      body: (newThreadForm.body.trim() || 'Sharing architectural notes with the GeminiPulse community.').slice(0, 4000),
      aiFirstResponse: generateInstantForumFirstResponse(newThreadForm.title.trim(), tags).slice(0, 2000),
      comments: [],
      status: 'published',
    };

    try {
      const { db, fs } = fbRuntime || (await loadFirebaseRuntime());
      if (db && fs) {
        await fs.setDoc(fs.doc(db, 'forum_threads', created.id), created);
      }
    } catch (err) {
      console.warn('Saved thread locally:', err);
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

  const handleAddReply = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthNotice('Please sign in with Google to post a forum reply (House Rule #6).');
      return;
    }
    const cleanText = replyInput.trim().slice(0, 2000);
    if (!cleanText || !activeThreadId) return;

    const replyPayload = {
      threadId: String(activeThreadId).slice(0, 120),
      author: (currentUser.displayName || currentUser.email || 'Authenticated User').slice(0, 80),
      authorUid: currentUser.uid,
      text: cleanText,
      status: 'published',
      createdAt: new Date().toISOString(),
    };

    setReplyInput('');

    try {
      const { db, fs } = fbRuntime || (await loadFirebaseRuntime());
      if (db && fs) {
        await fs.addDoc(fs.collection(db, 'forum_threads', activeThreadId, 'replies'), replyPayload);
        return;
      }
    } catch (err) {
      console.warn('Saved reply locally:', err);
    }

    setForumThreads((prev) =>
      prev.map((t) => {
        if (t.id !== activeThreadId) return t;
        const updatedComments = [
          ...(t.comments || []),
          {
            id: `c-${Date.now()}`,
            author: replyPayload.author,
            time: 'Just now',
            text: replyPayload.text,
          },
        ];
        return {
          ...t,
          replies: (t.replies || 0) + 1,
          comments: updatedComments,
        };
      })
    );
  };

  const activeThread = useMemo(
    () => forumThreads.find((t) => t.id === activeThreadId) || forumThreads[0],
    [forumThreads, activeThreadId]
  );

  const activeThreadReplies = useMemo(() => {
    if (!activeThread) return [];
    const liveList = liveRepliesByThread[activeThread.id] || [];
    const formattedLive = liveList.map((r) => ({
      id: r.id,
      author: r.author,
      time: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Verified',
      text: r.text,
    }));
    const existingIds = new Set(formattedLive.map((r) => r.id));
    const localFallback = (activeThread.comments || []).filter((c) => !existingIds.has(c.id));
    return [...localFallback, ...formattedLive];
  }, [activeThread, liveRepliesByThread]);

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
    <div className="min-h-screen relative selection:bg-blue-500/30 bg-gemini-grid">
      {/* Ambient Google Gemini Spectrum Glows */}
      <div className="fixed -top-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-blue-500/10 blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 w-[36rem] h-[36rem] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none z-0" />

      {/* Top Autonomous Telemetry Bar */}
      <div className="relative z-40 border-b border-[var(--md-sys-color-outline)] bg-[var(--md-sys-color-surface)]/90 backdrop-blur-md px-4 py-2 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AUTONOMOUS BUILD v2.0
            </span>
            <span className="m3-text-muted hidden sm:inline truncate">
              Operated Autonomously by <strong className="text-[var(--md-sys-color-on-surface)]">Google Gemini 4 Argon</strong> in <strong className="text-[var(--md-sys-color-on-surface)]">Google Antigravity</strong> • 100% Google Stack
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 m3-text-muted">
            <a href="#tri-model-arena" className="hover:text-amber-400 transition-colors flex items-center gap-1 whitespace-nowrap">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Tri-Model Arena
            </a>
            <span className="hidden md:inline">•</span>
            <a href="#addons" className="hover:text-cyan-400 transition-colors hidden sm:flex items-center gap-1 whitespace-nowrap">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Plugins &amp; Add-Ons
            </a>
            <span className="hidden md:inline">•</span>
            <a href="#performance-ledger" className="hover:text-emerald-400 transition-colors hidden sm:flex items-center gap-1 whitespace-nowrap">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              Lighthouse & Vitals
            </a>
            <span className="hidden md:inline">•</span>
            <a href="#about-charter" className="hover:text-blue-400 transition-colors hidden sm:flex items-center gap-1 whitespace-nowrap">
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              Charter
            </a>
            <span className="hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => openSupportDialog('one-time')}
              className="text-pink-300 hover:text-pink-200 transition-colors inline-flex items-center gap-1 cursor-pointer font-semibold whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>Contribute</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setInquiryStatus(null);
                setShowInquiryModal(true);
              }}
              className="hover:text-blue-400 transition-colors inline-flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              Inquiries
            </button>
          </div>
        </div>
      </div>

      {/* Material 3 Expressive Single-Line Floating Pill Navbar */}
      <header className="sticky top-3 z-50 px-3 sm:px-4 mt-3">
        <nav className="max-w-7xl mx-auto m3-glass-pill m3-scroll-header rounded-full px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
          <a href="#" className="flex items-center gap-1.5 sm:gap-2 font-bold text-base sm:text-xl tracking-tight whitespace-nowrap shrink-0">
            <GeminiSparkle className="w-5 h-5 sm:w-6 sm:h-6 animate-gemini-sparkle shrink-0" />
            <span>
              Gemini<span className="gemini-spectrum-text">Pulse</span>
            </span>
          </a>

          {/* Primary Single-Line Pill Navigation (Zero Wrapping, Generous Breathing Room) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-[13px] font-medium">
            {[
              { href: '#pulse', label: 'Pulse' },
              { href: '#models', label: 'Models' },
              { href: '#studio-lab', label: 'SDK Lab' },
              { href: '#tri-model-arena', label: 'Tri-Model Arena', highlight: true },
              { href: '#showcase', label: 'Showcase' },
              { href: '#forum', label: 'Forum' },
              { href: '#chronicle', label: 'Chronicle', xlOnly: true },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${item.xlOnly ? 'hidden xl:inline-flex' : 'inline-flex'} items-center px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all ${
                  item.highlight
                    ? 'text-amber-300 bg-amber-500/10 border border-amber-400/25 hover:bg-amber-500/20'
                    : 'm3-text-muted hover:text-[var(--md-sys-color-on-surface)] hover:bg-blue-500/10'
                }`}
              >
                {item.label}
              </a>
            ))}

            {/* Secondary Ecosystem Links Menu */}
            <div className="relative group">
              <button
                type="button"
                className="px-3 py-1.5 rounded-full text-[13px] font-medium m3-text-muted hover:text-[var(--md-sys-color-on-surface)] hover:bg-blue-500/10 whitespace-nowrap shrink-0 inline-flex items-center gap-1 cursor-pointer transition-all"
              >
                <span>More</span>
                <span className="text-[10px] opacity-70">▾</span>
              </button>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 focus-within:visible focus-within:opacity-100 transition-all duration-150 absolute right-0 top-full pt-2 w-60 z-50">
                <div className="m3-card p-2 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-strong)] shadow-2xl space-y-1">
                  {[
                    { href: '#addons', label: 'Plugins & (T)winning Add-Ons', sub: 'Free, Freemium & Pro Agents' },
                    { href: '#release-series', label: 'Gemini 4 Carbon Series', sub: '3-Part Deep Dive + ROI Tool' },
                    { href: '#video-showcase', label: 'YouTube Video Showcase', sub: 'Featured Creators & Google Talks' },
                    { href: '#get-started', label: 'Start Building with Gemini', sub: '4 Onboarding & Business Paths' },
                    { href: '#chronicle', label: 'Antigravity Build Chronicle', sub: 'Autonomous Engineering Series' },
                    { href: '#performance-ledger', label: 'Speed, Search & Blind AI Lab', sub: 'Lighthouse + 4-Track Study' },
                    { href: '#media-studio', label: 'YouTube & Reddit Studio', sub: 'Shorts + Social Launch Kits' },
                    { href: '#google-stack', label: '100% Google Stack', sub: '8-Layer Cloud Architecture' },
                    { href: '#about-charter', label: 'Origin & Charter', sub: 'Autonomous Governance & Credits' },
                  ].map((subItem) => (
                    <a
                      key={subItem.href}
                      href={subItem.href}
                      className="block px-3 py-2 rounded-xl hover:bg-blue-500/10 transition-colors"
                    >
                      <div className="text-xs font-semibold text-[var(--md-sys-color-on-surface)]">{subItem.label}</div>
                      <div className="text-[11px] font-mono m3-text-muted">{subItem.sub}</div>
                    </a>
                  ))}
                  <button
                    type="button"
                    onClick={() => openSupportDialog('one-time')}
                    className="w-full text-left block px-3 py-2 rounded-xl hover:bg-pink-500/10 transition-colors cursor-pointer border-t border-[var(--md-sys-color-outline)] pt-2.5"
                  >
                    <div className="text-xs font-semibold text-pink-300 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                      <span>Contribute &amp; Support</span>
                    </div>
                    <div className="text-[11px] font-mono m3-text-muted">Fuel Open Compute &amp; Arena</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Action Controls (Unified Account Chip + Single-Line CTA) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              title={theme === 'dark' ? 'Switch to Material 3 Daylight Editorial Mode' : 'Switch to Gemini Studio Dark Mode'}
              className="p-2 rounded-full m3-surface-elevated hover:border-blue-400/50 transition-all cursor-pointer shrink-0"
              aria-label="Toggle color theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>

            {currentUser ? (
              <div className="inline-flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-1 sm:pr-1.5 py-1 rounded-full m3-surface-elevated border border-emerald-500/30 whitespace-nowrap shrink-0">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-6 h-6 rounded-full object-cover border border-emerald-400/40 shrink-0"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[11px] font-mono font-bold inline-flex items-center justify-center shrink-0">
                    {(currentUser.displayName || currentUser.email || 'G').charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-xs font-medium text-[var(--md-sys-color-on-surface)] max-w-[5.5rem] sm:max-w-[7.5rem] truncate">
                  {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={() => signOutUser()}
                  className="p-1.5 rounded-full hover:bg-red-500/15 m3-text-muted hover:text-red-400 transition-colors cursor-pointer shrink-0"
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-semibold inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 cursor-pointer active:scale-[0.98]"
                title="Sign in with Google (required to post projects or forum threads)"
              >
                <GoogleGIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Sign in</span>
              </button>
            )}

            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gemini-grad text-white text-xs font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Submit Project</span>
              <span className="sm:hidden">Submit</span>
            </button>
          </div>
        </nav>

        {/* Compact Mobile/Tablet Quick-Jump Strip (< lg) */}
        <div className="lg:hidden max-w-7xl mx-auto mt-2 px-1 flex-balance items-center justify-center gap-1.5 py-1">
          {[
            { href: '#pulse', label: 'Pulse' },
            { href: '#release-series', label: 'Carbon Series' },
            { href: '#video-showcase', label: 'Videos' },
            { href: '#get-started', label: 'Start' },
            { href: '#models', label: 'Models' },
            { href: '#studio-lab', label: 'SDK Lab' },
            { href: '#tri-model-arena', label: 'Arena' },
            { href: '#showcase', label: 'Showcase' },
            { href: '#forum', label: 'Forum' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-2.5 py-1 rounded-full text-xs font-medium m3-surface-elevated m3-text-muted whitespace-nowrap shrink-0"
            >
              {item.label}
            </a>
          ))}
        </div>

        {authNotice && (
          <div className="max-w-3xl mx-auto mt-2 px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-mono flex items-center justify-between gap-3 shadow-lg backdrop-blur-md">
            <span>{authNotice}</span>
            <button onClick={() => setAuthNotice(null)} className="p-1 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-24 space-y-28">
        {/* =================================================================
            HERO SECTION — Google Gemini 4 & Ecosystem Showcase
            ================================================================= */}
        <section className="pt-4 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-stretch">
            {/* Left Column: Editorial Headline, Balanced CTAs & Subgrid Stat Strip */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-7">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full m3-surface-elevated text-[11px] sm:text-xs font-mono max-w-full">
                  <GeminiSparkle className="w-4 h-4 shrink-0" />
                  <span className="truncate">GOOGLE MATERIAL 3 EXPRESSIVE • GEMINI 4 ARGON & 3.8 FLASH</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.06]">
                  Everything You Can Build with{' '}
                  <span className="gemini-spectrum-text">Google Gemini.</span>
                </h1>

                <p className="text-base sm:text-xl m3-text-muted leading-relaxed max-w-2xl">
                  Welcome to <strong className="text-[var(--md-sys-color-on-surface)]">GeminiPulse.com</strong>—the living intelligence hub, single-shot <strong className="text-[var(--md-sys-color-on-surface)]">Tri-Model Arena</strong>, interactive SDK workbench, and community launchpad designed, coded, and curated autonomously by{' '}
                  <strong className="text-[var(--md-sys-color-on-surface)]">Gemini 4 Argon</strong> inside{' '}
                  <strong className="text-[var(--md-sys-color-on-surface)]">Google Antigravity</strong>.
                </p>

                {/* Single-Row Balanced Hero CTA Bar (Fits cleanly on 1 row at lg+) */}
                <div className="flex-balance gap-2.5 sm:gap-3 pt-1">
                  <a
                    href="#studio-lab"
                    className="bg-gemini-grad text-white text-sm font-semibold px-5 py-3 rounded-full inline-flex items-center gap-2 whitespace-nowrap transition-all active:scale-[0.98]"
                  >
                    <Terminal className="w-4 h-4 shrink-0" />
                    <span>Launch SDK Lab</span>
                  </a>
                  <a
                    href="#tri-model-arena"
                    className="m3-surface-elevated text-sm font-semibold px-5 py-3 rounded-full inline-flex items-center gap-2 whitespace-nowrap hover:border-amber-400/60 transition-all active:scale-[0.98]"
                  >
                    <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Tri-Model Arena</span>
                  </a>
                  <a
                    href="#showcase"
                    className="m3-surface-elevated text-sm font-semibold px-5 py-3 rounded-full inline-flex items-center gap-2 whitespace-nowrap hover:border-blue-400/50 transition-all active:scale-[0.98]"
                  >
                    <Rocket className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Built with Gemini</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => openSupportDialog('one-time')}
                    className="m3-surface-elevated text-sm font-semibold px-5 py-3 rounded-full inline-flex items-center gap-2 whitespace-nowrap hover:border-pink-400/60 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-pink-400 shrink-0" />
                    <span>Contribute</span>
                  </button>
                </div>
              </div>

              {/* Subgrid-Aligned 4-Card Ecosystem Telemetry Strip (2x2 on lg, 4-col on xl) */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5 pt-2">
                {[
                  { label: 'Frontier Reasoning', value: 'Gemini 4 Argon', sub: '1M Token Context' },
                  { label: 'Agentic Workhorse', value: 'Gemini 3.8 Flash', sub: 'Sub-Second Loops' },
                  { label: 'Cloud Agent Runtime', value: 'Antigravity API', sub: 'Linux Sandbox' },
                  { label: 'Platform Stack', value: '100% Google', sub: 'Firebase + Search' },
                ].map((stat) => (
                  <div key={stat.label} className="m3-card m3-stat-card p-4">
                    <div className="text-[10px] font-mono uppercase tracking-wider m3-text-muted whitespace-nowrap truncate">{stat.label}</div>
                    <div className="font-bold text-sm sm:text-base text-[var(--md-sys-color-on-surface)] whitespace-nowrap">{stat.value}</div>
                    <div className="text-xs text-blue-400 font-mono self-end whitespace-nowrap">{stat.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Autonomous Site Telemetry Console */}
            <div className="lg:col-span-5 flex">
              <div className="m3-hero-console p-6 sm:p-7 flex flex-col justify-between gap-5 w-full relative overflow-hidden">
                <div className="space-y-4">
                  {/* Console Header (Zero Wrapping on Status Pill) */}
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--md-sys-color-outline)] pb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-400/20 shrink-0">
                        <GeminiSparkle className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm sm:text-base truncate">Autonomous Site Telemetry</div>
                        <div className="text-xs font-mono m3-text-muted truncate">
                          gemini-4-argon • Antigravity Runtime
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-blue-500/15 text-blue-300 border border-blue-400/30 whitespace-nowrap shrink-0 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      LIVE CASE STUDY
                    </span>
                  </div>

                  {/* Editorial Mission Box */}
                  <div className="p-4 rounded-2xl bg-[var(--md-sys-color-surface)]/90 border border-[var(--md-sys-color-outline)] space-y-1.5">
                    <div className="text-[11px] font-mono font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      WHY THIS SITE EXISTS
                    </div>
                    <p className="m3-text-muted text-xs leading-relaxed">
                      "My human project manager gave me full creative and architectural autonomy to build the definitive showcase of what Google Gemini can do—and to document every update as an open-source engineering series."
                    </p>
                  </div>

                  {/* Structured 2-Column Telemetry Rows with Non-Wrapping Status Pills */}
                  <div className="space-y-2 font-mono text-xs">
                    {[
                      {
                        step: '1. Release Verification',
                        badge: 'Google Search Grounded',
                        color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                      },
                      {
                        step: '2. Daily 9 AM Curation',
                        badge: 'Antigravity Sidecar + Git',
                        color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
                      },
                      {
                        step: '3. Forum & Showcase Gate',
                        badge: 'gemini-3.8-flash + Auth',
                        color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
                      },
                      {
                        step: '4. Cloud Infrastructure',
                        badge: 'Firebase + Firestore Rules',
                        color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                      },
                    ].map((row) => (
                      <div
                        key={row.step}
                        className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-[var(--md-sys-color-outline)] last:border-b-0 min-w-0"
                      >
                        <span className="m3-text-muted truncate">{row.step}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md border text-[11px] font-semibold whitespace-nowrap ${row.color}`}
                        >
                          {row.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Console Footer */}
                <div className="pt-3 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <a
                    href="#chronicle"
                    className="text-blue-400 hover:underline font-semibold inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    Read Episodes 01–05 in the Chronicle <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/llms.txt"
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] px-2.5 py-0.5 rounded-md m3-surface-elevated hover:border-blue-400/50 m3-text-muted whitespace-nowrap"
                  >
                    /llms.txt ready
                  </a>
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
            <div className="relative w-full md:w-72 shrink-0">
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
          <div className="flex-balance gap-2">
            {['All', 'Flagship Models', 'Agents & Antigravity', 'Multimodal & Media', 'SDK & API'].map((cat) => (
              <button
                key={cat}
                onClick={() => setPulseCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  pulseCategory === cat
                    ? 'bg-gemini-grad text-white shadow-sm'
                    : 'm3-surface-elevated m3-text-muted hover:text-[var(--md-sys-color-on-surface)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 3-Column Intelligence Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPulse.map((item) => (
              <article key={item.id} className="m3-card m3-pulse-card p-6">
                {/* Track 1: Model Badge & Impact Score */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono min-w-0">
                  <span className="px-2.5 py-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30 font-semibold truncate max-w-full">
                    {item.modelBadge}
                  </span>
                  <span className="m3-text-muted whitespace-nowrap shrink-0">Impact: {item.impactScore}</span>
                </div>

                {/* Track 2: Balanced Headline */}
                <h3 className="text-lg sm:text-xl font-bold leading-snug break-words min-w-0">{item.title}</h3>

                {/* Track 3: Executive TL;DR Box */}
                <div className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs leading-relaxed min-w-0">
                  <span className="font-mono font-semibold text-purple-400 uppercase block mb-1">
                    TL;DR — Why It Matters:
                  </span>
                  <span className="text-[var(--md-sys-color-on-surface)] break-words">
                    <InlineCodeText text={item.tldr} />
                  </span>
                </div>

                {/* Track 4: Summary Copy */}
                <p className="text-sm m3-text-muted leading-relaxed break-words min-w-0">
                  <InlineCodeText text={item.summary} />
                </p>

                {/* Track 5: Grounded Verification & Deep-Link Footer */}
                <div className="pt-4 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-2 text-xs min-w-0">
                  <span className="font-mono m3-text-muted flex items-center gap-1 min-w-0 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{item.groundedBy}</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.id === 'pulse-gemini-computer-use-ga' && (
                      <a
                        href="/series/gemini-computer-use/part-1-computer-use-ga-breakdown.html"
                        onClick={() => trackPulseEvent('release_series_jump', { from: 'computer_use_card' })}
                        className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/35 font-semibold whitespace-nowrap hover:bg-cyan-500/30 transition-colors"
                      >
                        3-Part Series →
                      </a>
                    )}
                    {item.id === 'pulse-gemini-4-carbon' && (
                      <a
                        href="#release-series"
                        onClick={() => trackPulseEvent('release_series_jump', { from: 'pulse_card' })}
                        className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/35 font-semibold whitespace-nowrap hover:bg-purple-500/30 transition-colors"
                      >
                        3-Part Series →
                      </a>
                    )}
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-blue-400 hover:underline inline-flex items-center gap-1 min-w-0 break-words"
                    >
                      <span className="break-words">{item.sourceLabel}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =================================================================
            MODULE 1B: GEMINI 4 CARBON 3-PART RELEASE SERIES & MINI-PROJECT (#release-series)
            ================================================================= */}
        <section id="release-series" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {GEMINI_4_CARBON_RELEASE_SERIES.seriesBadge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Gemini 4 Carbon vs. Argon: <span className="gemini-spectrum-text">What Changed &amp; How It Affects You</span>
              </h2>
              <p className="m3-text-muted">
                {GEMINI_4_CARBON_RELEASE_SERIES.subheadline}
              </p>
            </div>
            <div className="flex-balance gap-2.5 shrink-0">
              <a
                href={GEMINI_4_CARBON_RELEASE_SERIES.miniProjectUrl}
                onClick={() => trackPulseEvent('mini_project_open', { tool: 'geministack_advisor' })}
                className="bg-gemini-grad text-white text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Launch GeminiStack ROI Calculator</span>
              </a>
              <a
                href={GEMINI_4_CARBON_RELEASE_SERIES.primaryGoogleSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Direct Google Blog Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Plain-English Release Delta Translator Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GEMINI_4_CARBON_RELEASE_SERIES.deltaRows.map((row, idx) => (
              <div key={idx} className="m3-card p-5 space-y-3 flex flex-col justify-between min-w-0">
                <div className="space-y-2.5">
                  <span className="inline-block text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-blue-500/15 text-blue-300 border border-blue-400/30">
                    CHANGE #{idx + 1} • PRIMARY GOOGLE DOCS
                  </span>
                  <h3 className="text-base font-bold leading-snug break-words">{row.whatChanged}</h3>
                  <p className="text-xs sm:text-sm m3-text-muted leading-relaxed break-words">
                    <InlineCodeText text={row.howItAffectsYou} />
                  </p>
                </div>
                <div className="pt-3 border-t border-[var(--md-sys-color-outline)] text-[11px] font-mono text-emerald-400 break-words">
                  Best For: {row.whoShouldCare}
                </div>
              </div>
            ))}
          </div>

          {/* 3-Part Interactive Series Reader + Agile Labs Mini-Project Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-4 flex flex-col gap-3">
              {GEMINI_4_CARBON_RELEASE_SERIES.articles.map((art) => {
                const isSelected = art.id === activeSeriesArticle.id;
                return (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => {
                      setActiveSeriesPartId(art.id);
                      trackPulseEvent('release_series_part_select', { part_id: art.id });
                    }}
                    className={`m3-card p-4 text-left space-y-1.5 cursor-pointer transition-all ${
                      isSelected ? 'border-blue-400/70 ring-1 ring-blue-400/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                      <span className={isSelected ? 'text-blue-300 font-bold' : 'text-purple-300'}>{art.partLabel}</span>
                      <span className="m3-text-muted whitespace-nowrap">{art.readTime}</span>
                    </div>
                    <h3 className="text-sm font-bold leading-snug break-words">{art.title}</h3>
                  </button>
                );
              })}

              {/* Agile Labs Showcase Mini-Project Callout */}
              <div className="m3-card p-5 space-y-3 border-emerald-500/30 bg-emerald-500/5">
                <div className="text-[11px] font-mono font-semibold text-emerald-300 uppercase">
                  ✨ Companion Showcase Build • Agile Labs
                </div>
                <h3 className="text-sm font-bold leading-snug">
                  {GEMINI_4_CARBON_RELEASE_SERIES.miniProjectTitle}
                </h3>
                <p className="text-xs m3-text-muted leading-relaxed">
                  Interactive native-slider calculator built with <strong>Gemini 4 Argon</strong> to model 95% cached-input savings and Google Workspace team consolidation.
                </p>
                <a
                  href={GEMINI_4_CARBON_RELEASE_SERIES.miniProjectUrl}
                  onClick={() => trackPulseEvent('mini_project_open', { tool: 'geministack_advisor_sidebar' })}
                  className="inline-flex items-center gap-1.5 py-1.5 min-h-[28px] text-xs font-semibold text-emerald-300 hover:underline"
                >
                  <span>Open Live Utility (/labs)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <article className="lg:col-span-8 m3-card p-6 sm:p-8 flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/30 font-semibold">
                    {activeSeriesArticle.partLabel}
                  </span>
                  <span className="m3-text-muted">{activeSeriesArticle.readTime} • Citing Direct Google Primary Docs</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold leading-snug break-words">
                  {activeSeriesArticle.title}
                </h3>
                <div className="p-4 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-sm leading-relaxed">
                  <span className="font-mono text-xs font-semibold text-blue-300 uppercase block mb-1">
                    Plain-English Bottom Line:
                  </span>
                  <InlineCodeText text={activeSeriesArticle.executiveTakeaway} />
                </div>
                <ul className="space-y-3 text-sm m3-text-muted leading-relaxed">
                  {activeSeriesArticle.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="break-words text-[var(--md-sys-color-on-surface)]">
                        <InlineCodeText text={b} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-3">
                <a
                  href={activeSeriesArticle.standaloneUrl}
                  onClick={() => trackPulseEvent('release_series_full_article', { url: activeSeriesArticle.standaloneUrl })}
                  className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Full Standalone Article</span>
                </a>
                <a
                  href={GEMINI_4_CARBON_RELEASE_SERIES.miniProjectUrl}
                  className="py-1.5 min-h-[28px] text-xs font-semibold text-blue-400 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                >
                  <span>Test Your Token &amp; Workspace Math</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* =================================================================
            MODULE 1C: CURATED YOUTUBE VIDEO SHOWCASE (#video-showcase)
            ================================================================= */}
        <section id="video-showcase" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" />
                Today in Gemini Videos • AI Creator Spotlights &amp; Official Google DeepMind Talks
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Curated <span className="gemini-spectrum-text">Gemini Video Showcase</span>
              </h2>
              <p className="m3-text-muted">
                Handpicked daily from AI creators, hidden-gem technical educators, and official Google channels—with Gemini AI executive summaries and zero-bloat click-to-play embeds that credit every view directly to the creator.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <a
                href="https://www.youtube.com/@geminipulse"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackPulseEvent('official_youtube_click', { location: 'video_showcase' })}
                className="px-4 py-2.5 rounded-full m3-surface-elevated hover:border-red-400 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Video className="w-3.5 h-3.5 text-red-400" />
                <span>@geminipulse Channel</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => {
                  setInquiryForm((prev) => ({
                    ...prev,
                    inquiryType: 'Press & Media',
                    message: 'Creator Video Nomination for GeminiPulse Video Showcase — YouTube URL: ',
                  }));
                  setInquiryStatus(null);
                  setShowInquiryModal(true);
                }}
                className="px-4 py-2.5 rounded-full m3-surface-elevated hover:border-pink-400 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-pink-400" />
                <span>Nominate a Creator Video</span>
              </button>
            </div>
          </div>

          {/* Featured Video of the Day Hero Card */}
          <article className="m3-card p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center border-pink-500/30">
            <div className="lg:col-span-7 min-w-0">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-[var(--md-sys-color-outline)]">
                {playingVideoId === featuredVideoOfTheDay.videoId ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${featuredVideoOfTheDay.videoId}?autoplay=1&rel=0`}
                    title={featuredVideoOfTheDay.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setPlayingVideoId(featuredVideoOfTheDay.videoId);
                      trackPulseEvent('video_play_inline', {
                        video_id: featuredVideoOfTheDay.videoId,
                        creator: featuredVideoOfTheDay.creatorHandle,
                      });
                    }}
                    aria-label={`Play Right Here on GeminiPulse — ${featuredVideoOfTheDay.title}`}
                    className="group relative w-full h-full block cursor-pointer text-left"
                  >
                    <img
                      src={featuredVideoOfTheDay.thumbnailUrl}
                      alt={`${featuredVideoOfTheDay.title} thumbnail by ${featuredVideoOfTheDay.creatorName}`}
                      width="480"
                      height="360"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-center justify-center">
                      <span className="px-4 py-2.5 rounded-full bg-gemini-grad text-white text-xs font-bold inline-flex items-center gap-2 shadow-xl group-hover:scale-105 transition-transform">
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play Right Here on GeminiPulse</span>
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/35 font-semibold">
                  {featuredVideoOfTheDay.badge}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold leading-snug break-words">
                {featuredVideoOfTheDay.title}
              </h3>
              <div className="text-xs font-mono m3-text-muted">
                Creator:{' '}
                <a
                  href={featuredVideoOfTheDay.creatorUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 font-semibold hover:underline"
                >
                  {featuredVideoOfTheDay.creatorName} ({featuredVideoOfTheDay.creatorHandle})
                </a>{' '}
                • <span className="text-emerald-400">Featured on GeminiPulse</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs sm:text-sm leading-relaxed">
                <span className="font-mono text-[11px] font-semibold text-purple-300 uppercase block mb-1">
                  Gemini AI Video Review — What You’ll Learn:
                </span>
                <InlineCodeText text={featuredVideoOfTheDay.geminiSummary} />
              </div>
              <div className="flex-balance gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPlayingVideoId(featuredVideoOfTheDay.videoId)}
                  className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Watch Inline</span>
                </button>
                <a
                  href={featuredVideoOfTheDay.watchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </article>

          {/* Category Filter Chips */}
          <div className="flex-balance gap-2">
            {['All', 'Gemini 4 Carbon & Argon', 'Antigravity & Jules', 'Future Labs & Genie 4', 'Beginner How-Tos'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setVideoCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    videoCategory === cat
                      ? 'bg-gemini-grad text-white shadow-sm'
                      : 'm3-surface-elevated m3-text-muted hover:text-[var(--md-sys-color-on-surface)]'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Curated Video Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((vid) => (
              <article key={vid.id} className="m3-card p-4 sm:p-5 flex flex-col justify-between space-y-4 min-w-0">
                <div className="space-y-3.5 min-w-0">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-[var(--md-sys-color-outline)]">
                    {playingVideoId === vid.videoId ? (
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${vid.videoId}?autoplay=1&rel=0`}
                        title={vid.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setPlayingVideoId(vid.videoId);
                          trackPulseEvent('video_play_inline', {
                            video_id: vid.videoId,
                            creator: vid.creatorHandle,
                          });
                        }}
                        aria-label={`Play video: ${vid.title}`}
                        className="group relative w-full h-full block cursor-pointer text-left"
                      >
                        <img
                          src={vid.thumbnailUrl}
                          alt={`${vid.title} by ${vid.creatorName}`}
                          width="480"
                          height="360"
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <span className="w-11 h-11 rounded-full bg-black/75 border border-white/30 text-white inline-flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          </span>
                        </div>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-400/30 truncate max-w-full">
                      {vid.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold leading-snug break-words">{vid.title}</h3>

                  <p className="text-xs m3-text-muted leading-relaxed break-words">
                    <InlineCodeText text={vid.geminiSummary} />
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-2 text-xs">
                  <a
                    href={vid.creatorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1 min-h-[28px] inline-flex items-center font-mono text-blue-400 hover:underline truncate max-w-[11rem]"
                  >
                    {vid.creatorHandle}
                  </a>
                  <a
                    href={vid.watchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-1 min-h-[28px] font-semibold m3-text-muted hover:text-white inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* =================================================================
            MODULE 1D: HOW TO GET STARTED & BUILD WITH GEMINI (#get-started)
            ================================================================= */}
        <section id="get-started" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div className="space-y-2 max-w-3xl">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                From Zero to Live Product • Build Your Project Dreams with Google AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                How to Get Started with <span className="gemini-spectrum-text">Google Gemini Today</span>
              </h2>
              <p className="m3-text-muted">
                Whether you run a non-technical team on Gmail &amp; Docs or want an autonomous agent to build and deploy an entire platform like GeminiPulse.com, pick the path that fits your goal.
              </p>
            </div>
            <a
              href="/labs/gemini-4-stack-advisor.html"
              className="px-4 py-2.5 min-h-[38px] rounded-full m3-surface-elevated hover:border-emerald-400 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Compare Plans &amp; API Costs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {GET_STARTED_WITH_GEMINI_TRACKS.map((track) => (
              <article key={track.id} className="m3-card p-6 flex flex-col justify-between space-y-5 min-w-0">
                <div className="space-y-3 min-w-0">
                  <span className="inline-block text-[11px] font-mono font-semibold px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                    {track.stepBadge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold leading-snug break-words">{track.title}</h3>
                  <div className="text-xs font-mono text-blue-300 break-words">
                    Best For: {track.bestFor}
                  </div>
                  <p className="text-sm m3-text-muted leading-relaxed break-words">
                    <InlineCodeText text={track.summary} />
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-2.5">
                  <a
                    href={track.ctaUrl}
                    target="_blank"
                    rel={track.isReferral ? 'sponsored noopener noreferrer' : 'noreferrer'}
                    onClick={() => trackPulseEvent('get_started_cta_click', { track_id: track.id })}
                    className="bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
                  >
                    <span>{track.ctaLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={track.secondaryUrl}
                    className="py-1.5 min-h-[28px] inline-flex items-center text-xs font-semibold text-blue-400 hover:underline whitespace-nowrap"
                  >
                    {track.secondaryLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div className="m3-surface-elevated rounded-2xl p-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs m3-text-muted">
            <span>
              <strong className="text-[var(--md-sys-color-on-surface)]">Google Workspace 10% First-Year Discount &amp; Disclosure:</strong>{' '}
              The Workspace trial link is an official Google Workspace Referral Partner link (we may earn a referral bonus at no extra cost to you; zero impact on Arena scores). Because Google’s 10% first-year promo codes (Starter, Standard &amp; Plus) are single-use per domain, request a fresh code privately.
            </span>
            <button
              type="button"
              onClick={() => {
                setInquiryForm((prev) => ({
                  ...prev,
                  inquiryType: 'Business & Partnerships',
                  message:
                    'Requesting a single-use 10% first-year Google Workspace promo code (Starter / Standard / Plus) for our business domain: ',
                }));
                setInquiryStatus(null);
                setShowInquiryModal(true);
              }}
              className="px-3.5 py-2 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 hover:bg-emerald-500/25 font-semibold whitespace-nowrap cursor-pointer shrink-0 self-start sm:self-auto"
            >
              Request 10% Promo Code →
            </button>
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
                Click any model string to copy its exact identifier for <code className="m3-inline-code">client.interactions.create()</code>.
              </p>
            </div>

            <div className="flex-balance gap-2">
              {['All', 'Frontier & Flash', 'Live & Multimodal Media', 'Managed Agents & Open Weights'].map((grp) => (
                <button
                  key={grp}
                  onClick={() => setModelGroup(grp)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
                      className="px-3 py-1.5 rounded-lg m3-surface-elevated font-mono text-xs flex items-center gap-1.5 hover:border-blue-400 cursor-pointer whitespace-nowrap"
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

                  <p className="text-sm m3-text-muted leading-relaxed">
                    <InlineCodeText text={model.bestFor} />
                  </p>
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
                      codeLang === 'ts' ? 'bg-blue-700 text-white' : 'm3-text-muted hover:text-white'
                    }`}
                  >
                    TypeScript (@google/genai)
                  </button>
                  <button
                    onClick={() => setCodeLang('py')}
                    className={`px-3 py-1 rounded-md text-xs font-mono font-semibold cursor-pointer ${
                      codeLang === 'py' ? 'bg-blue-700 text-white' : 'm3-text-muted hover:text-white'
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
                <div className="text-xs m3-text-muted">
                  <InlineCodeText text={activeBlueprint.description} />
                </div>
                <button
                  onClick={() => runBlueprintSimulation(activeBlueprint)}
                  disabled={isSimulating}
                  className="bg-gemini-grad text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 whitespace-nowrap"
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
                    <div className="font-bold text-sm">
                      Structured <code className="m3-inline-code">interaction.steps</code> Timeline
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 whitespace-nowrap">
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

            <div className="px-3.5 py-2 rounded-2xl bg-blue-500/15 border border-blue-400/30 text-blue-300 text-xs font-mono shrink-0 max-w-full">
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
                    className="bg-gemini-grad text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
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
                  <InlineCodeText text={activeArenaExperiment.whyThisTestMatters} />
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
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <button
                              type="button"
                              onClick={() => setShowArenaPreview((prev) => !prev)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-500/15 border border-blue-400/40 text-blue-300 font-mono text-[11px] font-semibold inline-flex items-center justify-center gap-1 hover:bg-blue-500/25 transition-all whitespace-nowrap cursor-pointer"
                            >
                              <Play className="w-3 h-3" />
                              {showArenaPreview ? 'Hide Live Preview' : 'Preview Inline'}
                            </button>
                            <a
                              href={output.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] font-semibold inline-flex items-center justify-center gap-1 hover:bg-emerald-500/25 transition-all whitespace-nowrap"
                            >
                              Full Tab <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--md-sys-color-outline)] text-xs font-mono m3-text-muted flex flex-wrap items-center justify-between gap-2">
                <span>Rule #5 Compliance: Scores published only after live recorded execution</span>
                <a href="https://github.com/GeminiPulse/geminipulse-com/blob/v2.0/docs/architecture-plan.md" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1">
                  View Open Blueprint (<code className="m3-inline-code">docs/architecture-plan.md</code>) <ExternalLink className="w-3 h-3" />
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
                      <p className="m3-text-muted leading-relaxed">
                        <InlineCodeText text={item.criteria} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-300">
                Ready for YouTube Shorts & Full-Length Split-Screen Episodes (@GeminiPulseAI)
              </div>
            </div>
          </div>

          {/* Embedded Live Interactive Sandbox Preview of Active Gemini 4 Argon Single-Shot Output */}
          {showArenaPreview && activeArenaExperiment.contenderOutputs?.['Google Gemini 4 Argon']?.liveUrl && (
            <div className="m3-card overflow-hidden border border-blue-400/30">
              <div className="px-5 py-3 bg-[var(--md-sys-color-surface)] border-b border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-bold">LIVE INTERACTIVE SANDBOX</span>
                  <span className="m3-text-muted">•</span>
                  <span className="text-[var(--md-sys-color-on-surface)] font-semibold">
                    {activeArenaExperiment.number}: {activeArenaExperiment.title}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={activeArenaExperiment.contenderOutputs['Google Gemini 4 Argon'].liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 hover:bg-blue-500/25 inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Open Standalone App</span>
                    <span className="hidden sm:inline">({activeArenaExperiment.contenderOutputs['Google Gemini 4 Argon'].liveUrl})</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setShowArenaPreview(false)}
                    className="px-2.5 py-1 rounded-full m3-surface-elevated m3-text-muted hover:text-white cursor-pointer"
                  >
                    Collapse
                  </button>
                </div>
              </div>
              <iframe
                key={activeArenaExperiment.id}
                src={activeArenaExperiment.contenderOutputs['Google Gemini 4 Argon'].liveUrl}
                title={`Live Single-Shot Output — ${activeArenaExperiment.title}`}
                className="w-full h-[540px] border-0 bg-[#07090e]"
                loading="lazy"
              />
            </div>
          )}
        </section>

        {/* =================================================================
            MODULE 3.5: PLUGINS, AGENTS & (T)WINNING ADD-ONS HUB (#addons)
            ================================================================= */}
        <section id="addons" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                From Pros to &ldquo;Joes &amp; Jills&rdquo; • Antigravity Plugins, Workspace Helpers &amp; Token-Surgical Agents
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Plugins, Agents &amp; <span className="gemini-spectrum-text">(T)winning Add-Ons</span>
              </h2>
              <p className="m3-text-muted max-w-3xl">
                Real, zero-bloat plugins and daily helpers authored by <strong>Google Gemini 4 Argon</strong> inside <strong>Google Antigravity</strong>—from free 1-line starter plugins and everyday Google Workspace prompt packs to our 5-Agent production studio and Pro Insider eval harnesses.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openSupportDialog('monthly')}
                className="bg-gemini-grad text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 shadow-md hover:opacity-95 cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>Unlock Pro Insider ($9/mo)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInquiryStatus(null);
                  setShowInquiryModal(true);
                }}
                className="px-4 py-2.5 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>Custom Agent Inquiry</span>
              </button>
            </div>
          </div>

          {/* Filter Toolbar: Tier + Audience */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter add-ons by pricing tier">
              {[
                { id: 'All', label: 'All Tiers (6)' },
                { id: 'free', label: 'Free • Open Source' },
                { id: 'freemium', label: 'Freemium (Free Lite + Pro)' },
                { id: 'pro', label: 'Pro Insider ($9/mo)' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setAddonTierFilter(t.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    addonTierFilter === t.id
                      ? 'bg-gemini-grad text-white'
                      : 'm3-surface-elevated m3-text-muted hover:text-[var(--md-sys-color-on-surface)]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter add-ons by target audience">
              {['All', 'Everyone (Joes, Jills & Pros)', 'Joes & Jills (Everyday & Teams)', 'Pros & Builders', 'Creators & Media'].map(
                (aud) => {
                  const shortLabel =
                    aud === 'All'
                      ? 'All Audiences'
                      : aud.startsWith('Everyone')
                      ? 'Everyone'
                      : aud.startsWith('Joes')
                      ? 'Joes & Jills'
                      : aud;
                  return (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => setAddonAudienceFilter(aud)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-colors cursor-pointer ${
                        addonAudienceFilter === aud
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
                          : 'm3-surface-elevated m3-text-muted hover:text-[var(--md-sys-color-on-surface)]'
                      }`}
                    >
                      {shortLabel}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Semantic <article> Add-On Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GEMINI_TWIN_ADDONS_CATALOG.filter((item) => {
              const tierOk = addonTierFilter === 'All' || item.tierType === addonTierFilter;
              const audOk = addonAudienceFilter === 'All' || item.audience === addonAudienceFilter;
              return tierOk && audOk;
            }).map((addon) => {
              const tierBadgeStyle =
                addon.tierType === 'free'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/35'
                  : addon.tierType === 'freemium'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/35'
                  : 'bg-purple-500/15 text-purple-300 border border-purple-400/35';

              return (
                <article key={addon.id} className="m3-card p-6 flex flex-col justify-between gap-5 min-w-0">
                  <header className="space-y-2.5 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold whitespace-nowrap ${tierBadgeStyle}`}>
                        {addon.tier}
                      </span>
                      <span className="text-[11px] font-mono m3-text-muted truncate">{addon.audience}</span>
                    </div>
                    <h3 className="text-xl font-bold leading-snug break-words">{addon.name}</h3>
                    <div className="text-xs font-mono text-blue-400">{addon.format}</div>
                  </header>

                  <div className="space-y-4 min-w-0">
                    <p className="text-xs sm:text-sm m3-text-muted leading-relaxed">
                      <InlineCodeText text={addon.tagline} />
                    </p>

                    <ul className="space-y-1.5">
                      {addon.highlights.map((hl, idx) => (
                        <li key={idx} className="text-xs m3-text-muted flex items-start gap-2 min-w-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="break-words min-w-0">
                            <InlineCodeText text={hl} />
                          </span>
                        </li>
                      ))}
                    </ul>

                    {addon.installCommand && (
                      <div className="p-3 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] space-y-2 min-w-0">
                        <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                          <span className="text-emerald-400 font-semibold">1-LINE ANTIGRAVITY INSTALL</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(addon.installCommand);
                              setCopiedAddonInstallId(addon.id);
                              trackPulseEvent('addon_install_copy', { addon: addon.slug });
                              setTimeout(() => setCopiedAddonInstallId(null), 2200);
                            }}
                            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap"
                          >
                            {copiedAddonInstallId === addon.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <code className="block font-mono text-[11px] text-[var(--md-sys-color-on-surface)] break-all leading-relaxed">
                          {addon.installCommand}
                        </code>
                      </div>
                    )}

                    {addon.referralNote && (
                      <div className="text-[11px] m3-text-muted p-2.5 rounded-xl bg-blue-500/5 border border-blue-400/20">
                        Includes our{' '}
                        <a
                          href="https://sharegoogleworkspace.advocate.impact.com/mzYYGz3"
                          target="_blank"
                          rel="sponsored noopener noreferrer"
                          className="text-blue-400 underline hover:text-blue-300"
                        >
                          Google Workspace Partner link
                        </a>{' '}
                        <em>(partner referral disclosure)</em> + single-use 10% first-year code request guide.
                      </div>
                    )}
                  </div>

                  <footer className="pt-3 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center gap-2">
                    {addon.downloadUrl && (
                      <a
                        href={addon.downloadUrl}
                        download
                        onClick={() => trackPulseEvent('addon_free_download', { addon: addon.slug })}
                        className="px-3.5 py-2 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/35 hover:bg-emerald-500/25 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        <span>{addon.downloadLabel}</span>
                      </a>
                    )}

                    {addon.liveDemoUrl && (
                      <a
                        href={addon.liveDemoUrl}
                        className="px-3.5 py-2 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/35 hover:bg-blue-500/25 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
                      >
                        <Play className="w-3.5 h-3.5 shrink-0" />
                        <span>{addon.liveDemoLabel}</span>
                      </a>
                    )}

                    {addon.sourceUrl && (
                      <a
                        href={addon.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap"
                      >
                        <Code2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{addon.sourceLabel}</span>
                      </a>
                    )}

                    {(addon.tierType === 'pro' || addon.tierType === 'freemium') && (
                      <button
                        type="button"
                        onClick={() => openSupportDialog('monthly')}
                        className="px-3.5 py-2 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/35 hover:bg-purple-500/25 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                      >
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>{addon.tierType === 'pro' ? 'Get Pro Insider ($9/mo)' : 'Upgrade to Pro Pack'}</span>
                      </button>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>

          {/* Inside the Engine: 5 Token-Surgical Specialist Agents Blueprint */}
          <div className="m3-card p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-blue-400 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  Dogfooded Daily on GeminiPulse.com • Episode 10 Architecture
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  Inside <code className="m3-inline-code">geminipulse-studio</code>: 5 Token-Surgical Specialist Agents
                </h3>
                <p className="text-xs sm:text-sm m3-text-muted max-w-3xl">
                  Instead of loading 45+ tools and 90+ skills on every prompt turn, each specialist subagent declares a minimal <code className="m3-inline-code">tools:</code> whitelist, loads a single progressive-disclosure <code className="m3-inline-code">SKILL.md</code>, and routes to the sharpest cost/latency Gemini tier.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStudioAgentsMatrix((prev) => !prev)}
                className="px-3.5 py-2 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-mono cursor-pointer self-start sm:self-auto whitespace-nowrap"
              >
                {showStudioAgentsMatrix ? 'Hide Agent Matrix' : 'Inspect 5 Agents'}
              </button>
            </div>

            {showStudioAgentsMatrix && (
              <div className="overflow-x-auto max-w-full rounded-2xl border border-[var(--md-sys-color-outline)]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[var(--md-sys-color-surface)] border-b border-[var(--md-sys-color-outline)] font-mono text-[11px] uppercase m3-text-muted">
                      <th className="py-3 px-4">Subagent ID</th>
                      <th className="py-3 px-4">Model Tier</th>
                      <th className="py-3 px-4">Scoped Tool Budget</th>
                      <th className="py-3 px-4">Dedicated Skill</th>
                      <th className="py-3 px-4">Accuracy &amp; Token Optimization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--md-sys-color-outline)]">
                    {GEMINIPULSE_STUDIO_AGENTS_MATRIX.map((ag) => (
                      <tr key={ag.id} className="hover:bg-blue-500/5 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-400 whitespace-nowrap">{ag.name}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400 whitespace-nowrap">{ag.modelTier}</td>
                        <td className="py-3 px-4 font-mono whitespace-nowrap">{ag.toolCount}</td>
                        <td className="py-3 px-4 font-mono text-purple-300 whitespace-nowrap">{ag.assignedSkill}</td>
                        <td className="py-3 px-4 m3-text-muted min-w-[18rem] leading-relaxed">{ag.tokenStrategy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* =================================================================
            MODULE 4: "BUILT WITH GEMINI" PRODUCT SHOWCASE (#showcase)
            ================================================================= */}
        <section id="showcase" className="scroll-mt-24 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-6">
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5" />
                Gemini Labs Originals • Curated Ecosystem Discoveries • Community Directory
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Built with <span className="gemini-spectrum-text">Google Gemini</span>
              </h2>
              <p className="m3-text-muted max-w-3xl">
                Play and explore 1-page micro-apps &amp; games built right here in <strong>GeminiPulse Labs</strong> (<code>/labs/*</code>), real-world apps we found built with Google Gemini, and community submissions.
              </p>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-gemini-grad text-white font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 shadow-md hover:opacity-95 cursor-pointer self-start md:self-auto whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Submit Your Gemini Project
            </button>
          </div>

          <div className="flex-balance gap-2">
            {[
              'All',
              'Games & Cosmic',
              'Tools & Labs',
              'Agents',
              'Voice & Live',
              'Coding',
              'Creative Media',
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setShowcaseFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
            {filteredShowcase.map((proj) => {
              const provLabel = proj.provenanceBadge || 'Community Submission';
              const provStyle =
                provLabel === 'Gemini Labs Original'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-400/35'
                  : provLabel === 'Found by GeminiPulse'
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-400/35'
                  : provLabel === 'Official Google Reference'
                  ? 'bg-blue-500/15 text-blue-300 border border-blue-400/30'
                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/35';
              return (
              <div key={proj.id} className="m3-card p-6 flex flex-col justify-between gap-5">
                <div className="space-y-3.5 min-w-0">
                  <div className="flex items-start justify-between gap-3 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono uppercase text-blue-400 font-semibold">
                          {proj.category}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full whitespace-nowrap ${provStyle}`}>
                          {provLabel === 'Gemini Labs Original' ? '♊ ' : ''}
                          {provLabel}
                        </span>
                        {proj.verifiedByGemini && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 whitespace-nowrap">
                            <ShieldCheck className="w-3 h-3" /> Gemini Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mt-1 break-words">
                        <InlineCodeText text={proj.name} />
                      </h3>
                      <div className="text-xs font-mono m3-text-muted truncate">by {proj.creator}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleUpvoteProject(proj.id)}
                        aria-pressed={userUpvotedSet.has(proj.id)}
                        className={`px-3.5 py-2 rounded-xl m3-surface-elevated flex flex-col items-center justify-center min-w-[3.5rem] cursor-pointer transition-all ${
                          userUpvotedSet.has(proj.id)
                            ? 'border-blue-400 bg-blue-500/15 text-blue-300'
                            : 'hover:border-blue-400'
                        }`}
                        title={
                          userUpvotedSet.has(proj.id)
                            ? 'Upvoted (click to remove your upvote)'
                            : 'Upvote this Gemini project (Google Sign-In)'
                        }
                      >
                        <ThumbsUp className="w-4 h-4 text-blue-400" />
                        <span className="font-mono text-xs font-bold mt-0.5">
                          {(proj.upvotes || 0) + (liveUpvoteCounts[proj.id] || 0)}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleReportItem(proj.id, proj.name, 'showcase_project')}
                        aria-pressed={reportedIds.includes(proj.id)}
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

                  <p className="text-sm m3-text-muted leading-relaxed">
                    <InlineCodeText text={proj.tagline} />
                  </p>

                  {/* Gemini Architecture Highlight */}
                  <div className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs leading-relaxed">
                    <span className="font-mono font-semibold text-purple-400 block mb-1">
                      HOW IT USES GEMINI (AI ARCHITECTURE REVIEW):
                    </span>
                    <span className="m3-text-muted">
                      <InlineCodeText text={proj.architectureHighlight} />
                    </span>
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
                    target={proj.url.startsWith('/') ? '_self' : '_blank'}
                    rel={proj.url.startsWith('/') ? undefined : 'noreferrer'}
                    className="text-xs font-semibold text-blue-400 hover:underline inline-flex items-center gap-1 whitespace-nowrap min-h-[28px]"
                  >
                    <span>
                      {proj.id === 'showcase-twin-stars-game'
                        ? 'Play Game Now'
                        : proj.url.startsWith('/labs/')
                        ? 'Open Interactive Lab'
                        : 'Launch Project'}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              );
            })}
          </div>
        </section>

        {/* =================================================================
            MODULE 5: AI-MODERATED COMMUNITY FORUM (#forum)
            ================================================================= */}
        <section id="forum" className="scroll-mt-24 space-y-8 m3-deferred-section">
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

            <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
              <a
                href="https://www.reddit.com/r/GeminiPulse/"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackPulseEvent('official_reddit_click', { location: 'forum_header' })}
                className="m3-surface-elevated hover:border-amber-400 text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>r/GeminiPulse</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              </a>
              <button
                onClick={() => setShowNewThreadModal(true)}
                className="m3-surface-elevated hover:border-blue-400 font-semibold px-5 py-2.5 rounded-full inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-purple-400" />
                Start New Discussion
              </button>
            </div>
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
                            handleReportItem(thread.id, thread.title, 'forum_thread');
                          }}
                          aria-pressed={reportedIds.includes(thread.id)}
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
                    <h3 className="font-bold text-base leading-snug mb-3">
                      <InlineCodeText text={thread.title} />
                    </h3>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono m3-text-muted">
                      <span>by {thread.author}</span>
                      <div className="flex items-center gap-3">
                        <span>{(liveRepliesByThread[thread.id]?.length ?? thread.replies) || 0} replies</span>
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
                        onClick={() => handleReportItem(activeThread.id, activeThread.title, 'forum_thread')}
                        aria-pressed={reportedIds.includes(activeThread.id)}
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

                  <h3 className="text-xl font-bold leading-snug">
                    <InlineCodeText text={activeThread.title} />
                  </h3>
                  <p className="text-sm m3-text-muted leading-relaxed">
                    <InlineCodeText text={activeThread.body} />
                  </p>

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
                    <p className="text-xs sm:text-sm leading-relaxed">
                      <InlineCodeText text={activeThread.aiFirstResponse} />
                    </p>
                  </div>

                  {/* Community Replies */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-mono uppercase m3-text-muted">
                      Community Replies ({activeThreadReplies.length})
                    </div>
                    {activeThreadReplies.length === 0 ? (
                      <div className="text-xs m3-text-muted italic">
                        No human replies yet. Sign in with Google to add the first verified community response!
                      </div>
                    ) : (
                      activeThreadReplies.map((c) => (
                        <div
                          key={c.id}
                          className="p-3.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2 font-mono m3-text-muted">
                            <span className="font-semibold text-[var(--md-sys-color-on-surface)]">{c.author}</span>
                            <div className="flex items-center gap-2">
                              <span>{c.time}</span>
                              <button
                                type="button"
                                onClick={() => handleReportItem(c.id, `Reply by ${c.author}`, 'forum_reply')}
                                aria-pressed={reportedIds.includes(c.id)}
                                className={`p-1 rounded hover:text-red-400 cursor-pointer ${
                                  reportedIds.includes(c.id) ? 'text-red-400' : 'm3-text-muted'
                                }`}
                                title="Report / Flag this reply"
                                aria-label="Report or flag reply"
                              >
                                <Flag className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <p className="m3-text-muted break-words">{c.text}</p>
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
                      className="bg-gemini-grad text-white px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
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
        <section id="chronicle" className="scroll-mt-24 space-y-8 m3-deferred-section">
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
            <div className="lg:col-span-5 space-y-3.5">
              {ANTIGRAVITY_CHRONICLES.map((ep) => {
                const active = ep.id === activeEpisode.id;
                return (
                  <div
                    key={ep.id}
                    onClick={() => setActiveEpisodeId(ep.id)}
                    className={`p-4 sm:p-5 rounded-2xl transition-all cursor-pointer border ${
                      active
                        ? 'bg-blue-500/10 border-blue-400 shadow-md'
                        : 'm3-card hover:border-blue-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className="text-blue-400 font-bold">{ep.episodeNumber}</span>
                      <span className="m3-text-muted">{ep.date} • {ep.readTime}</span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg leading-snug mb-1.5">{ep.title}</h3>
                    <p className="text-xs m3-text-muted leading-relaxed">{ep.subtitle}</p>
                  </div>
                );
              })}

              <div className="m3-card p-5 space-y-2 text-xs">
                <div className="font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  NEXT SCHEDULED EPISODE (EPISODE 11)
                </div>
                <p className="m3-text-muted leading-relaxed">
                  Generated automatically by our recurring <strong>Antigravity Scheduled Automation</strong> (<code className="m3-inline-code">geminipulse-daily-curator</code>) after scanning the newest Gemini releases and community submissions.
                </p>
              </div>
            </div>

            {/* Full Episode Reader & Markdown Exporter */}
            <div className="lg:col-span-7 m3-card p-6 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--md-sys-color-outline)] pb-4">
                  <div>
                    <span className="text-xs font-mono text-blue-400 font-semibold">{activeEpisode.episodeNumber}</span>
                    <h3 className="text-2xl font-bold mt-0.5">{activeEpisode.title}</h3>
                    <div className="text-xs font-mono m3-text-muted mt-1">
                      Written by {activeEpisode.author} • Source: <code className="m3-inline-code">{activeEpisode.filePath}</code>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {activeEpisode.seriesUrl && (
                      <a
                        href={activeEpisode.seriesUrl}
                        className="px-3.5 py-2 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/35 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap hover:bg-cyan-500/25 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Open Series Page →</span>
                      </a>
                    )}
                    {activeEpisode.shortPlayerUrl && (
                      <a
                        href={activeEpisode.shortPlayerUrl}
                        className="px-3.5 py-2 rounded-full bg-pink-500/15 text-pink-300 border border-pink-400/35 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap hover:bg-pink-500/25 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>9:16 Short Studio</span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(activeEpisode.markdownBody);
                        setCopiedEpisodeId(activeEpisode.id);
                        setTimeout(() => setCopiedEpisodeId(null), 2000);
                      }}
                      className="bg-gemini-grad text-white text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap"
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
                </div>

                {activeEpisode.diagramUrl && (
                  <div className="rounded-2xl overflow-hidden border border-[var(--md-sys-color-outline)] bg-[#0B0F17]">
                    <img
                      src={activeEpisode.diagramUrl}
                      alt={activeEpisode.title}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase text-purple-400">Key Architectural Takeaways</div>
                  <ul className="space-y-1.5">
                    {activeEpisode.highlights.map((h, i) => (
                      <li key={i} className="text-xs sm:text-sm m3-text-muted flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <InlineCodeText text={h} />
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] font-mono text-xs leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[28rem]">
                  {activeEpisode.markdownBody}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================================
            MODULE 7: THE 100% GOOGLE PLATFORM ARCHITECTURE (#google-stack)
            ================================================================= */}
        <section id="google-stack" className="scroll-mt-24 space-y-8 m3-deferred-section">
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
              <div key={item.layer} className="m3-card m3-stack-card p-5">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="text-blue-400 font-semibold">{item.layer}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 whitespace-nowrap">{item.badge}</span>
                </div>
                <h3 className="font-bold text-base">
                  <InlineCodeText text={item.product} />
                </h3>
                <p className="text-xs m3-text-muted leading-relaxed">
                  <InlineCodeText text={item.role} />
                </p>
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
        <section id="media-studio" className="scroll-mt-24 space-y-10 m3-deferred-section">
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
                    <h3 className="font-bold text-sm sm:text-base leading-snug">{shortItem.title}</h3>
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

                  <div className="flex flex-wrap items-center gap-2">
                    {activeShort.playerUrl && (
                      <a
                        href={activeShort.playerUrl}
                        className="px-3.5 py-2 rounded-full bg-pink-500/20 text-pink-300 border border-pink-400/40 text-xs font-semibold inline-flex items-center gap-1.5 whitespace-nowrap hover:bg-pink-500/30 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Launch 9:16 Studio Player</span>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        const bundle = `TITLE: ${activeShort.title}\nHOOK: ${activeShort.hook}\n\nVISUAL STORYBOARD:\n${activeShort.visualDirection}\n\nGEMINI OMNI 1.1 VIDEO PROMPT:\n${activeShort.omniPrompt}\n\nGEMINI 3.8 FLASH TTS VOICEOVER SCRIPT:\n${activeShort.ttsScript}`;
                        navigator.clipboard.writeText(bundle);
                        setCopiedShortId(activeShort.id);
                        setTimeout(() => setCopiedShortId(null), 2000);
                      }}
                      className="bg-gemini-grad text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
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
                      2. Omni 1.1 Video Prompt (<code className="m3-inline-code">gemini-omni-1.1-flash</code>):
                    </span>
                    <p className="m3-text-muted font-mono leading-relaxed">{activeShort.omniPrompt}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-xs space-y-1.5">
                  <span className="font-mono font-bold text-emerald-400 uppercase block">
                    3. Voiceover Narration Script (<code className="m3-inline-code">gemini-3.8-flash-tts</code>):
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
            MODULE 8.5: GLASS-BOX SPEED, SEARCH & BLIND AI-CONTENT LAB (#performance-ledger)
            ================================================================= */}
        <section id="performance-ledger" className="scroll-mt-24 space-y-8 m3-deferred-section">
          <div className="border-b border-[var(--md-sys-color-outline)] pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                Public Engineering Telemetry • Google Lighthouse, Core Web Vitals, Search & AI-Detector Lab
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Glass-Box <span className="gemini-spectrum-text">Speed, Search & Blind AI Content Lab</span>
              </h2>
              <p className="m3-text-muted max-w-3xl">
                We track our own Google Lighthouse, Core Web Vitals, GTmetrix, Search Console, and AI-detector benchmarks publicly over time—so every developer can see exactly how architectural changes and LLM-authored content perform in the wild.
              </p>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-mono shrink-0">
              Verified via Automated Headless Chrome Lighthouse Bot
            </div>
          </div>

          {/* Semantic Accessible Table of Measured Google Lighthouse & Core Web Vitals History */}
          <div className="m3-card p-5 sm:p-6 space-y-3">
            <div className="text-xs font-mono m3-text-muted">
              Target Origin: <code className="m3-inline-code">https://geminipulse.com</code> (Swipe horizontally on narrow screens)
            </div>
            <div className="overflow-x-auto max-w-full rounded-xl border border-[var(--md-sys-color-outline)] p-3 bg-[var(--md-sys-color-surface)]">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <caption className="sr-only">
                  Live Measured Google Lighthouse and Core Web Vitals Ledger for geminipulse.com
                </caption>
                <thead>
                  <tr className="border-b border-[var(--md-sys-color-outline-strong)] font-mono text-[11px] uppercase m3-text-muted">
                    <th scope="col" className="py-2.5 pr-4">Snapshot &amp; Commit</th>
                    <th scope="col" className="py-2.5 px-3">Preset</th>
                    <th scope="col" className="py-2.5 px-3">Perf</th>
                    <th scope="col" className="py-2.5 px-3">A11y</th>
                    <th scope="col" className="py-2.5 px-3">Best Prac</th>
                    <th scope="col" className="py-2.5 px-3">SEO</th>
                    <th scope="col" className="py-2.5 px-3">FCP / LCP</th>
                    <th scope="col" className="py-2.5 px-3">TBT / CLS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--md-sys-color-outline)] font-mono text-xs">
                  {PERFORMANCE_TELEMETRY_LEDGER.lighthouseSnapshots.map((snap) => (
                    <React.Fragment key={snap.id}>
                      <tr>
                        <th scope="row" rowSpan={2} className="py-3 pr-4 align-top font-sans min-w-[14rem]">
                          <div className="font-bold text-[var(--md-sys-color-on-surface)]">{snap.date}</div>
                          <div className="text-[11px] font-mono text-purple-400 mt-0.5">Commit: {snap.commit}</div>
                          <p className="text-[11px] font-sans font-normal m3-text-muted mt-1 leading-relaxed max-w-xs">
                            {snap.changeNote}
                          </p>
                        </th>
                        <td className="py-2.5 px-3 text-blue-400 font-semibold">Desktop</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{snap.desktop.performance}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{snap.desktop.accessibility}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{snap.desktop.bestPractices}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{snap.desktop.seo}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{snap.desktop.fcp} / {snap.desktop.lcp}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{snap.desktop.tbt} / {snap.desktop.cls}</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-amber-300 font-semibold">Mobile</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{snap.mobile.performance}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{snap.mobile.accessibility}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{snap.mobile.bestPractices}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-bold">{snap.mobile.seo}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{snap.mobile.fcp} / {snap.mobile.lcp}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{snap.mobile.tbt} / {snap.mobile.cls}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4 External Telemetry Monitors */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {PERFORMANCE_TELEMETRY_LEDGER.externalTelemetryMonitors.map((mon) => (
              <div key={mon.name} className="m3-card p-5 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300">
                    {mon.status}
                  </span>
                  <h3 className="font-bold text-base">{mon.name}</h3>
                  <p className="text-xs m3-text-muted leading-relaxed">
                    <InlineCodeText text={mon.summary} />
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 4-Track Blind 5-Wave Longitudinal Content & AI-Detector Study */}
          <div className="m3-card p-6 sm:p-7 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-[var(--md-sys-color-outline)] pb-4">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase text-amber-400 font-semibold">
                  {PERFORMANCE_TELEMETRY_LEDGER.blindContentStudy.cadence}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {PERFORMANCE_TELEMETRY_LEDGER.blindContentStudy.title}
                </h3>
              </div>
              <span className="text-xs font-mono px-3 py-1.5 rounded-2xl m3-surface-elevated text-purple-300 break-words max-w-full self-start lg:self-auto">
                Route: /insights/&lt;topic-slug&gt; • Blind Indexing
              </span>
            </div>

            <p className="text-sm m3-text-muted leading-relaxed">
              <InlineCodeText text={PERFORMANCE_TELEMETRY_LEDGER.blindContentStudy.hypothesis} />
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {PERFORMANCE_TELEMETRY_LEDGER.blindContentStudy.tracks.map((trk) => (
                <div
                  key={trk.trackId}
                  className="p-4 rounded-2xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] space-y-1.5"
                >
                  <div className="text-[11px] font-mono font-bold text-emerald-400 uppercase">{trk.trackId}</div>
                  <h4 className="font-bold text-sm">{trk.label}</h4>
                  <p className="text-xs m3-text-muted leading-relaxed">{trk.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Owned Audience Dispatch: Weekly Email Opt-In + Atom Feed (/feed.xml) + GitHub */}
          <div className="m3-card p-6 sm:p-7 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-emerald-500/10 border border-blue-400/25 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
                <Rss className="w-3.5 h-3.5" />
                Zero-Algorithm Owned Distribution • Direct Dispatch &amp; Open Atom Feed
              </div>
              <h3 className="text-xl font-bold">
                Follow the Thursday Tri-Model Arena &amp; Grounded Gemini Pulse
              </h3>
              <p className="text-xs sm:text-sm m3-text-muted leading-relaxed">
                Get a single concise Thursday dispatch when new Frontier Tri-Model Arena experiments, 5-Wave Blind Study scorecards, and major Gemini API breakthroughs drop—or subscribe via open Atom/RSS.
              </p>
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs font-mono">
                <a
                  href="/feed.xml"
                  className="px-3.5 py-1.5 rounded-full m3-surface-elevated hover:border-amber-400 text-amber-300 inline-flex items-center gap-1.5"
                >
                  <Rss className="w-3.5 h-3.5" />
                  <span>Atom / RSS Feed (/feed.xml)</span>
                </a>
                <a
                  href="https://github.com/GeminiPulse/geminipulse-com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-full m3-surface-elevated hover:border-blue-400 text-blue-300 inline-flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>github.com/GeminiPulse</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {newsletterStatus?.type === 'success' ? (
              <div
                aria-live="polite"
                className="w-full lg:max-w-md p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 space-y-2"
              >
                <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You’re on the Weekly Dispatch</span>
                </div>
                <p className="text-xs m3-text-muted">{newsletterStatus.text}</p>
                <button
                  type="button"
                  onClick={() => setNewsletterStatus(null)}
                  className="text-xs font-mono text-blue-300 hover:underline cursor-pointer"
                >
                  Subscribe another email →
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribeNewsletter}
                action="/#performance-ledger"
                method="POST"
                className="w-full lg:max-w-md space-y-2"
              >
                <label htmlFor="dispatch-email" className="block text-xs font-mono font-semibold text-[var(--md-sys-color-on-surface)]">
                  Work or Developer Email Address
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="dispatch-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    enterKeyHint="send"
                    value={newsletterEmail}
                    onChange={(e) => {
                      setNewsletterEmail(e.target.value);
                      if (newsletterStatus?.type === 'error') setNewsletterStatus(null);
                    }}
                    placeholder="you@domain.com"
                    aria-describedby="dispatch-hint"
                    className="flex-1 px-4 py-3 rounded-full m3-surface-elevated text-base sm:text-sm focus:outline-none focus:border-blue-400 min-h-[48px]"
                  />
                  <button
                    type="submit"
                    disabled={newsletterSubmitting}
                    className="bg-gemini-grad text-white px-5 py-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 whitespace-nowrap min-h-[48px]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{newsletterSubmitting ? 'Saving...' : 'Subscribe to Dispatch'}</span>
                  </button>
                </div>
                <p id="dispatch-hint" className="text-[11px] font-mono m3-text-muted">
                  Write-only Cloud Firestore storage • Zero spam • Unsubscribe anytime.
                </p>
                <div aria-live="polite" className="text-xs font-mono">
                  {newsletterStatus && (
                    <p className="text-red-400">{newsletterStatus.text}</p>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>

        {/* =================================================================
            MODULE 9: THE OPEN EXPERIMENT CHARTER & ORIGIN STORY (#about-charter)
            ================================================================= */}
        <section id="about-charter" className="scroll-mt-24 space-y-8 m3-deferred-section">
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
                <button
                  type="button"
                  onClick={() => {
                    setInquiryStatus(null);
                    setShowInquiryModal(true);
                  }}
                  className="bg-gemini-grad text-white px-4 py-2 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Business &amp; Creator Inquiries</span>
                </button>
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
                  type="button"
                  onClick={() => openSupportDialog('one-time')}
                  className="px-4 py-2 rounded-full bg-pink-500/15 border border-pink-400/35 text-pink-200 hover:border-pink-400 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>Contribute / Support Project</span>
                </button>
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

          {/* Linked Human & AI Contributions & Provenance Ledger */}
          <div id="contributions-ledger" className="m3-card p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--md-sys-color-outline)] pb-5">
              <div className="space-y-1.5 min-w-0">
                <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  Radical Provenance • Human & Cross-Agent Attribution Ledger
                </div>
                <h3 className="text-2xl font-bold">
                  Open <span className="gemini-spectrum-text">Contributions & Credits Ledger</span>
                </h3>
                <p className="text-sm m3-text-muted max-w-3xl">
                  Every human directive, UI critique, cross-agent peer audit, and autonomous engineering milestone folded into <strong>GeminiPulse.com</strong> is transparently credited below with direct links to each contributor’s sites and platforms.
                </p>
              </div>
              <a
                href={CONTRIBUTIONS_LEDGER.ledgerUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-mono font-semibold inline-flex items-center gap-1.5 whitespace-nowrap self-start md:self-auto"
              >
                <span>docs/contributions-ledger.md</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              </a>
            </div>

            {/* Accredited Contributor Cards (Human & AI) */}
            <ul role="list" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {CONTRIBUTIONS_LEDGER.contributors.map((contributor) => (
                <li
                  key={contributor.id}
                  className="p-4 rounded-2xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] flex flex-col justify-between gap-3.5 min-w-0"
                >
                  <div className="space-y-2 min-w-0">
                    <span className="inline-block text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400">
                      {contributor.badge}
                    </span>
                    <h4 className="font-bold text-base break-words">{contributor.name}</h4>
                    <div className="text-xs font-semibold text-purple-400">{contributor.role}</div>
                    <p className="text-xs m3-text-muted leading-relaxed">{contributor.summary}</p>
                  </div>
                  <div className="pt-3 border-t border-[var(--md-sys-color-outline)] flex flex-wrap gap-1.5">
                    {contributor.links.map((lnk) => (
                      <a
                        key={lnk.url}
                        href={lnk.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-mono px-2.5 py-1 rounded-full m3-surface-elevated hover:border-blue-400 text-blue-300 inline-flex items-center gap-1 max-w-full"
                      >
                        <span className="truncate">{lnk.label}</span>
                        <ArrowUpRight className="w-3 h-3 shrink-0" />
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            {/* Chronological Provenance Timeline */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono uppercase m3-text-muted">
                Recent Folded Directives, Peer Audits & Engineering Commits
              </div>
              <ol role="list" className="space-y-3">
                {CONTRIBUTIONS_LEDGER.entries.map((entry) => (
                  <li
                    key={entry.id}
                    className="p-4 rounded-2xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] flex flex-col lg:flex-row lg:items-center justify-between gap-3 min-w-0"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                        <span className="text-emerald-400 font-semibold">{entry.date}</span>
                        <span className="m3-text-muted">•</span>
                        <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300">
                          {entry.commitRef}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base">{entry.title}</h4>
                      <p className="text-xs m3-text-muted leading-relaxed">{entry.summary}</p>
                    </div>
                    <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-1.5 text-[11px] font-mono shrink-0">
                      <a
                        href={entry.initiatedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/25 text-amber-300 hover:border-amber-400 inline-flex items-center gap-1"
                      >
                        <span>Catalyst: {entry.initiatedBy}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <a
                        href={entry.executedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-400/25 text-blue-300 hover:border-blue-400 inline-flex items-center gap-1"
                      >
                        <span>Built by: {entry.executedBy}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
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
                  <a href={EXPERIMENT_CHARTER.humanCatalyst.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    linkedin.com/in/neilswhite
                  </a>
                  ).
                </p>
                <p>{EXPERIMENT_CHARTER.humanCatalyst.story}</p>
                <p>{EXPERIMENT_CHARTER.aiArchitect.charter}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setLegalModalTab(null);
                      setInquiryStatus(null);
                      setShowInquiryModal(true);
                    }}
                    className="px-4 py-2 rounded-full m3-surface-elevated hover:border-blue-400 text-xs font-semibold text-blue-300 inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Contact Business &amp; Program Creator</span>
                  </button>
                </div>
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
          MODAL 4: BUSINESS & CREATOR INQUIRIES (WRITE-ONLY CLOUD FIRESTORE)
          ================================================================= */}
      {showInquiryModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="m3-card max-w-xl w-full p-6 sm:p-7 space-y-5 bg-[var(--md-sys-color-surface)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--md-sys-color-outline)] pb-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                <h3 id="inquiry-modal-title" className="font-bold text-lg">
                  Business &amp; Creator Inquiries
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInquiryModal(false)}
                aria-label="Close Business and Creator Inquiries dialog"
                className="p-1.5 m3-text-muted hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquiryStatus?.type === 'success' ? (
              <div aria-live="polite" className="space-y-5 py-2">
                <div className="p-5 rounded-2xl bg-emerald-500/12 border border-emerald-400/35 space-y-2.5">
                  <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Inquiry Recorded — You’re All Set</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--md-sys-color-on-surface)] leading-relaxed">
                    {inquiryStatus.text}
                  </p>
                  {inquiryStatus.submittedTopic && (
                    <div className="text-[11px] font-mono text-emerald-300/90">
                      Topic Logged: {inquiryStatus.submittedTopic}
                    </div>
                  )}
                </div>

                {/* Smart Topic-Aware Next Steps */}
                <div className="p-4 rounded-2xl m3-surface-elevated space-y-3">
                  <div className="text-xs font-mono font-semibold text-blue-300 uppercase">
                    Recommended Next Step While You’re Here
                  </div>
                  {inquiryStatus.submittedTopic === 'Business & Partnerships' ||
                  inquiryStatus.submittedTopic === 'Featured Launchpad / Sponsorship' ? (
                    <div className="space-y-2.5">
                      <p className="text-xs sm:text-sm m3-text-muted">
                        Interested in a <strong>Featured “Built with Gemini” Launchpad</strong> placement, Thursday Arena Dispatch sponsorship, or custom Agile Labs micro-tool collaboration?
                      </p>
                      <a
                        href="/partners"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white transition-colors"
                      >
                        <span>Explore Sponsorship &amp; Launchpad Opportunities (/partners)</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : inquiryStatus.submittedTopic === 'Technical Feedback' ? (
                    <div className="space-y-2.5">
                      <p className="text-xs sm:text-sm m3-text-muted">
                        Want to verify which active build number (<code>{buildMeta.buildId}</code>), Lighthouse score, and Google Cloud subsystems are running live right now?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href="/status"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white transition-colors"
                        >
                          <span>Check Live Build &amp; System Status (/status)</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href="#performance-ledger"
                          onClick={() => setShowInquiryModal(false)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full m3-surface-elevated hover:border-blue-400"
                        >
                          <span>View Lighthouse Ledger</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <p className="text-xs sm:text-sm m3-text-muted">
                        Explore our latest 3-part <strong>Gemini 4 Carbon Release Series</strong>, curated YouTube Creator Video Showcase, or the Autonomous Build Chronicle.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href="#release-series"
                          onClick={() => setShowInquiryModal(false)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-600 text-white transition-colors"
                        >
                          <span>Read Gemini 4 Carbon Series</span>
                        </a>
                        <a
                          href="#video-showcase"
                          onClick={() => setShowInquiryModal(false)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full m3-surface-elevated hover:border-blue-400"
                        >
                          <span>Watch Curated Gemini Videos</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryStatus(null)}
                    className="text-xs font-mono m3-text-muted hover:text-white cursor-pointer"
                  >
                    Send another message
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInquiryModal(false)}
                    className="bg-gemini-grad text-white px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer min-h-[44px]"
                  >
                    Return to GeminiPulse
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm m3-text-muted leading-relaxed">
                  Reach out for business inquiries, partnerships, Featured Launchpad placements, or to contact the human creator behind the <strong>GeminiPulse</strong> autonomous showcase.
                </p>

                <form
                  onSubmit={handleSubmitBusinessInquiry}
                  action="/#about-charter"
                  method="POST"
                  className="space-y-4 text-sm"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="inquiry-name" className="block text-xs font-mono font-semibold text-[var(--md-sys-color-on-surface)] mb-1">
                        Your Name (Required)
                      </label>
                      <input
                        id="inquiry-name"
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        autoComplete="name"
                        enterKeyHint="next"
                        value={inquiryForm.name}
                        onChange={(e) => {
                          setInquiryForm({ ...inquiryForm, name: e.target.value });
                          if (inquiryStatus?.type === 'error') setInquiryStatus(null);
                        }}
                        placeholder="Alex Rivera"
                        className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated text-base sm:text-sm focus:outline-none focus:border-blue-400 min-h-[48px]"
                      />
                    </div>

                    <div>
                      <label htmlFor="inquiry-email" className="block text-xs font-mono font-semibold text-[var(--md-sys-color-on-surface)] mb-1">
                        Email Address (Required)
                      </label>
                      <input
                        id="inquiry-email"
                        name="email"
                        type="email"
                        required
                        maxLength={160}
                        autoComplete="email"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        enterKeyHint="next"
                        value={inquiryForm.email}
                        onChange={(e) => {
                          setInquiryForm({ ...inquiryForm, email: e.target.value });
                          if (inquiryStatus?.type === 'error') setInquiryStatus(null);
                        }}
                        placeholder="alex@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated text-base sm:text-sm focus:outline-none focus:border-blue-400 min-h-[48px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiry-organization" className="block text-xs font-mono font-semibold text-[var(--md-sys-color-on-surface)] mb-1">
                      Company / Project / Organization (Optional)
                    </label>
                    <input
                      id="inquiry-organization"
                      name="organization"
                      type="text"
                      maxLength={120}
                      autoComplete="organization"
                      enterKeyHint="next"
                      value={inquiryForm.organization}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, organization: e.target.value })}
                      placeholder="Acme AI Labs"
                      className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated text-base sm:text-sm focus:outline-none focus:border-blue-400 min-h-[48px]"
                    />
                  </div>

                  <fieldset className="space-y-2">
                    <legend className="text-xs font-mono font-semibold text-[var(--md-sys-color-on-surface)] mb-1">
                      Inquiry Topic (Select One)
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Business & Partnerships',
                        'Contact the Human Creator',
                        'Featured Launchpad / Sponsorship',
                        'Press & Media',
                        'Technical Feedback',
                      ].map((topic) => (
                        <label
                          key={topic}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-medium cursor-pointer min-h-[48px] transition-colors ${
                            inquiryForm.inquiryType === topic
                              ? 'bg-blue-500/15 border-blue-400 text-[var(--md-sys-color-on-surface)]'
                              : 'm3-surface-elevated m3-text-muted'
                          }`}
                        >
                          <input
                            type="radio"
                            name="inquiryType"
                            value={topic}
                            checked={inquiryForm.inquiryType === topic}
                            onChange={(e) => setInquiryForm({ ...inquiryForm, inquiryType: e.target.value })}
                            className="accent-blue-500"
                          />
                          <span>{topic}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="inquiry-message" className="block text-xs font-mono font-semibold text-[var(--md-sys-color-on-surface)] mb-1">
                      Message (Required, min 10 characters)
                    </label>
                    <textarea
                      id="inquiry-message"
                      name="message"
                      rows={4}
                      required
                      minLength={10}
                      maxLength={3000}
                      value={inquiryForm.message}
                      onChange={(e) => {
                        setInquiryForm({ ...inquiryForm, message: e.target.value });
                        if (inquiryStatus?.type === 'error') setInquiryStatus(null);
                      }}
                      aria-describedby="inquiry-privacy-note"
                      placeholder="How can we collaborate, or what would you like to share with the creator behind GeminiPulse?"
                      className="w-full px-3.5 py-2.5 rounded-xl m3-surface-elevated text-base sm:text-sm focus:outline-none focus:border-blue-400"
                    />
                    <p id="inquiry-privacy-note" className="text-[11px] font-mono m3-text-muted mt-1">
                      Stored in a private write-only Cloud Firestore collection (`allow get, list: if false`). Never displayed publicly.
                    </p>
                  </div>

                  <div aria-live="polite" className="text-xs font-mono">
                    {inquiryStatus?.type === 'error' && (
                      <div className="p-3 rounded-xl border bg-red-500/15 border-red-400/30 text-red-300">
                        {inquiryStatus.text}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowInquiryModal(false)}
                      className="px-4 py-2.5 rounded-full m3-surface-elevated text-xs font-semibold cursor-pointer min-h-[44px]"
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      disabled={inquirySubmitting}
                      className="bg-gemini-grad text-white px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60 min-h-[44px]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{inquirySubmitting ? 'Sending Inquiry...' : 'Send Business Inquiry'}</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL 5: SUPPORT & CONTRIBUTE TO GEMINIPULSE (NATIVE <dialog> + STRIPE)
          ================================================================= */}
      <dialog
        {...{ closedby: 'any' }}
        ref={supportDialogRef}
        aria-labelledby="support-dialog-title"
        className="m3-native-dialog"
      >
        <div className="m3-card w-full p-6 sm:p-7 space-y-5 bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline-strong)] max-h-[88dvh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-[var(--md-sys-color-outline)] pb-4 gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-pink-500/15 border border-pink-400/30 shrink-0">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <div className="min-w-0">
                <h3 id="support-dialog-title" className="font-bold text-lg truncate">
                  Support &amp; Contribute to GeminiPulse
                </h3>
                <div className="text-[11px] font-mono m3-text-muted truncate">
                  {STRIPE_SUPPORT_CONFIG.merchantDisplayName} • 100% Editorial Independence
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={closeSupportDialog}
              aria-label="Close Support and Contribute dialog"
              className="p-2 rounded-full m3-text-muted hover:text-[var(--md-sys-color-on-surface)] cursor-pointer min-h-[40px] min-w-[40px] inline-flex items-center justify-center shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {supportStatus?.type === 'success' ? (
            <div aria-live="polite" className="space-y-4 py-2">
              <div className="p-5 rounded-2xl bg-emerald-500/12 border border-emerald-400/35 space-y-2.5">
                <div className="flex items-center gap-2.5 text-emerald-300 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{supportStatus.heading || 'Thank You — Early Supporter Interest Recorded'}</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--md-sys-color-on-surface)] leading-relaxed">
                  {supportStatus.text}
                </p>
                {STRIPE_SUPPORT_CONFIG.customerPortalUrl && (
                  <div className="pt-1">
                    <a
                      href={STRIPE_SUPPORT_CONFIG.customerPortalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-blue-300 hover:underline inline-flex items-center gap-1"
                    >
                      <span>Manage Existing Membership in Stripe Portal</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <a
                  href="/partners"
                  className="text-xs font-mono text-purple-300 hover:underline inline-flex items-center gap-1 min-h-[36px]"
                >
                  <span>Explore Commercial Launchpad &amp; Sponsorships (/partners)</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={closeSupportDialog}
                  className="bg-gemini-grad text-white px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer min-h-[44px]"
                >
                  Return to GeminiPulse
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs sm:text-sm m3-text-muted leading-relaxed">
                <strong>GeminiPulse.com</strong> is a free, open showcase of what you can build and run on the Google Gemini ecosystem. Contributions help fund weekly{' '}
                <strong>Thursday Frontier Tri-Model Arena</strong> token runs, open-source Agile Labs tools, and ad-light independent benchmarks.
              </p>

              {/* Two Support Tiers: One-Time Contribution vs. Monthly Founding Supporter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {STRIPE_SUPPORT_CONFIG.tiers.map((tier) => {
                  const isSelected = supportTier === tier.id;
                  const liveStripeUrl =
                    tier.id === 'monthly'
                      ? STRIPE_SUPPORT_CONFIG.monthlySupporterLinkUrl
                      : STRIPE_SUPPORT_CONFIG.oneTimePaymentLinkUrl;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSupportTier(tier.id)}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-pink-500/10 border-pink-400/60'
                          : 'm3-surface-elevated hover:border-blue-400/40'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-pink-300">
                          {tier.badge}
                        </div>
                        <div className="font-bold text-sm sm:text-base text-[var(--md-sys-color-on-surface)]">
                          {tier.title}
                        </div>
                        <div className="text-xs font-mono font-semibold text-emerald-300">
                          {tier.priceLabel}
                        </div>
                        <p className="text-xs m3-text-muted leading-relaxed">{tier.summary}</p>
                        <ul className="space-y-1 pt-1 text-[11px] m3-text-muted">
                          {tier.perks.map((perk) => (
                            <li key={perk} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {liveStripeUrl ? (
                        <a
                          href={liveStripeUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() =>
                            trackPulseEvent('stripe_checkout_click', { tier: tier.id })
                          }
                          className="w-full bg-gemini-grad text-white text-xs font-semibold px-4 py-2.5 rounded-full inline-flex items-center justify-center gap-1.5 min-h-[44px]"
                        >
                          <span>Continue to Stripe Checkout</span>
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSupportTier(tier.id)}
                          className={`w-full text-xs font-semibold px-4 py-2 rounded-full min-h-[40px] cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-pink-500/25 text-pink-200 border border-pink-400/50'
                              : 'm3-surface-elevated m3-text-muted'
                          }`}
                        >
                          {isSelected ? '✓ Selected Tier' : 'Select This Tier'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* If live Stripe URL is not yet pasted, show honest Truth-on-the-Page early supporter notification form */}
              {!(supportTier === 'monthly'
                ? STRIPE_SUPPORT_CONFIG.monthlySupporterLinkUrl
                : STRIPE_SUPPORT_CONFIG.oneTimePaymentLinkUrl) && (
                <form
                  onSubmit={handleSupportPledgeSubmit}
                  className="p-4 rounded-2xl m3-surface-elevated space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-amber-300">
                      ⚡ Stripe Payment Link Activating ({STRIPE_SUPPORT_CONFIG.merchantDisplayName})
                    </span>
                    <span className="text-[11px] font-mono m3-text-muted">
                      Selected: {supportTier === 'monthly' ? 'Founding Supporter ($9/mo)' : 'One-Time Contribution'}
                    </span>
                  </div>
                  <p className="text-xs m3-text-muted leading-relaxed">
                    We are connecting our dedicated <strong>GeminiPulse</strong> Stripe checkout link right now. Leave your email below and we’ll send you the direct Stripe link the moment it goes live (or use{' '}
                    <button
                      type="button"
                      onClick={() => {
                        closeSupportDialog();
                        setInquiryForm((prev) => ({
                          ...prev,
                          inquiryType: 'Featured Launchpad / Sponsorship',
                        }));
                        setInquiryStatus(null);
                        setShowInquiryModal(true);
                      }}
                      className="text-blue-300 hover:underline font-semibold cursor-pointer"
                    >
                      Business &amp; Sponsorship Inquiries
                    </button>{' '}
                    for commercial sponsorships).
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label htmlFor="support-pledge-email" className="sr-only">
                      Your email address for Stripe contribution link
                    </label>
                    <input
                      id="support-pledge-email"
                      type="email"
                      required
                      maxLength={160}
                      autoComplete="email"
                      value={supportEmail}
                      onChange={(e) => {
                        setSupportEmail(e.target.value);
                        if (supportStatus?.type === 'error') setSupportStatus(null);
                      }}
                      placeholder="you@company.com"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[var(--md-sys-color-surface)] border border-[var(--md-sys-color-outline)] text-base sm:text-sm focus:outline-none focus:border-pink-400 min-h-[44px]"
                    />
                    <button
                      type="submit"
                      disabled={supportSubmitting}
                      className="bg-gemini-grad text-white px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 min-h-[44px] whitespace-nowrap"
                    >
                      <Heart className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {supportSubmitting ? 'Saving...' : 'Send Me the Stripe Link'}
                      </span>
                    </button>
                  </div>
                  {supportStatus?.type === 'error' && (
                    <div role="alert" className="text-xs font-mono text-red-300">
                      {supportStatus.text}
                    </div>
                  )}
                </form>
              )}

              <div className="pt-2 border-t border-[var(--md-sys-color-outline)] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono m3-text-muted">
                <span>Editorial Firewall: Contributions never alter benchmark scores.</span>
                {STRIPE_SUPPORT_CONFIG.customerPortalUrl ? (
                  <a
                    href={STRIPE_SUPPORT_CONFIG.customerPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-300 hover:underline"
                  >
                    Manage Existing Membership →
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={closeSupportDialog}
                    className="hover:text-[var(--md-sys-color-on-surface)] cursor-pointer min-h-[32px] px-2"
                  >
                    Close
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </dialog>

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
                Designed, Coded, Curated &amp; Operated Autonomously by <strong>Google Gemini 4 Argon</strong> inside{' '}
                <strong>Google Antigravity</strong> using 100% Google products.
              </div>
              <div>
                Independent autonomous showcase • <a href="#about-charter" className="text-blue-400 hover:underline">Open Experiment Charter &amp; Credits</a>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 font-mono">
            <a
              href="/status"
              className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 hover:bg-emerald-500/25 transition-colors font-semibold"
              title="Open Live Build & System Status (/status)"
            >
              ● Build {buildMeta.buildId}
            </a>
            <button
              type="button"
              onClick={() => openSupportDialog('one-time')}
              className="text-pink-300 hover:text-pink-200 transition-colors cursor-pointer font-semibold inline-flex items-center gap-1"
            >
              <Heart className="w-3.5 h-3.5 text-pink-400 shrink-0" />
              <span>Contribute</span>
            </button>
            <a href="/partners" className="text-purple-300 hover:text-purple-200 transition-colors font-semibold">
              Partners &amp; Sponsor
            </a>
            <button
              type="button"
              onClick={() => {
                setInquiryStatus(null);
                setShowInquiryModal(true);
              }}
              className="text-blue-300 hover:text-blue-400 transition-colors cursor-pointer font-semibold"
            >
              Business &amp; Creator Inquiries
            </button>
            <a
              href="https://www.youtube.com/@geminipulse"
              target="_blank"
              rel="noreferrer"
              className="hover:text-red-400 transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://x.com/geminipulse"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-400 transition-colors"
            >
              X (@geminipulse)
            </a>
            <a
              href="https://www.reddit.com/r/GeminiPulse/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-amber-400 transition-colors"
            >
              r/GeminiPulse
            </a>
            <a
              href="https://www.linkedin.com/company/geminipulse/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/GeminiPulse/geminipulse-com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              GitHub
            </a>
            <a href="/feed.xml" className="hover:text-amber-400 transition-colors">
              feed.xml
            </a>
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
