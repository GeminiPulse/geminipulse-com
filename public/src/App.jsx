import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Activity, MessageSquare, Play, Video, ArrowRight, Zap, ShieldAlert, Workflow, PlusSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------------

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
          if (self.direction === 1) {
            gsap.to(navRef.current, { backgroundColor: 'rgba(18, 22, 32, 0.7)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', duration: 0.3 });
          } else if (self.progress === 0) {
            gsap.to(navRef.current, { backgroundColor: 'transparent', border: '1px solid transparent', backdropFilter: 'blur(0px)', duration: 0.3 });
          }
        }
      });
    }, navRef);
    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="fixed top-6 left-1/2 -translate-x-1/2 z-50 rounded-full px-6 py-3 transition-all flex items-center gap-8 w-[95%] max-w-5xl justify-between">
      <div className="font-sans font-bold text-xl tracking-tight text-gradient flex items-center gap-2">
        <Activity size={20} className="text-gemini-purple" />
        GeminiPulse
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
        <a href="#pulse" className="hover:text-text-primary hover:-translate-y-[1px] transition-all">Pulse Feed</a>
        <a href="#forum" className="hover:text-text-primary hover:-translate-y-[1px] transition-all">Forums</a>
        <a href="#resources" className="hover:text-text-primary hover:-translate-y-[1px] transition-all">Video Hub</a>
      </div>
      <button className="magnetic bg-gemini-grad text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 flex items-center gap-2">
        Join Hub <ArrowRight size={16} />
      </button>
    </nav>
  );
};

const HeroCardFeature = ({ icon: Icon, title, description, badge }) => (
  <div className="glass-card p-6 flex flex-col items-start gap-4">
    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
      <Icon size={20} className="text-gemini-blue" />
    </div>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-lg">{title}</h3>
        {badge && <span className="text-[10px] uppercase font-mono tracking-wider bg-gemini-purple/20 text-gemini-purple px-2 py-0.5 rounded-sm">{badge}</span>}
      </div>
      <p className="text-text-secondary text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const CommunityForum = () => {
  const forumRef = useRef(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no db, use mock data
    if (!db) {
      console.warn("Using mock forum data because Firebase is not configured.");
      setThreads([
        { id: '1', title: "Best prompt structures for code generation using 1.5 Pro?", author: "CodeNinja", replies: 24, createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), tags: ["Prompting", "Code"] },
        { id: '2', title: "Has anyone managed to get the autonomous agent script working?", author: "AI_Explorer", replies: 8, createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), tags: ["Agents", "Help"] },
        { id: '3', title: "Google dropping hints about the next model parameter size 👀", author: "DeepMindFan", replies: 142, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), tags: ["Discussion", "Rumors"] },
        { id: '4', title: "[Showcase] I built a full React App just using Gemini 1.5 Flash", author: "UX_Wizard", replies: 56, createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000), tags: ["Showcase", "React"] }
      ]);
      setLoading(false);
      return;
    }

    // Real-time listener for forum threads
    const q = query(collection(db, 'forum_threads'), orderBy('createdAt', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threadData = [];
      snapshot.forEach((doc) => {
        threadData.push({ id: doc.id, ...doc.data() });
      });
      setThreads(threadData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching forum threads:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return; // Wait for data before animating

    const ctx = gsap.context(() => {
      gsap.from('.thread-card', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.forum-container',
          start: 'top 80%',
        }
      });
    }, forumRef);
    return () => ctx.revert();
  }, [loading]);

  // Format timestamp helper
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    // Handle Firestore Timestamp or Date object
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <section id="forum" className="w-full max-w-6xl px-6 py-24 border-t border-white/5 forum-container" ref={forumRef}>
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Community <span className="text-gradient">Hub</span></h2>
          <p className="text-text-secondary">Discuss agentic workflows, prompts, and the future of AI.</p>
        </div>
        <button className="magnetic hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2.5 rounded-xl font-medium transition-colors">
          <PlusSquare size={18} className="text-gemini-pink" />
          New Thread
        </button>
      </div>

      <div className="flex flex-col gap-3 min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-8 h-8 rounded-full bg-gemini-purple animate-ping opacity-50"></div>
          </div>
        ) : threads.length === 0 ? (
          <div className="glass-card p-8 text-center text-text-secondary">
            No discussions found. Be the first to start a thread!
          </div>
        ) : (
          threads.map((thread) => (
            <div key={thread.id} className="thread-card glass-card p-5 group cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="text-lg font-medium group-hover:text-gemini-blue transition-colors mb-2">{thread.title}</h4>
                <div className="flex items-center gap-4 text-xs font-mono text-text-secondary">
                  <span className="flex items-center gap-1.5"><Activity size={12} className="text-gemini-purple" /> {thread.author}</span>
                  <span>•</span>
                  <span>{formatTime(thread.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 md:w-48 justify-end">
                <div className="flex gap-2">
                  {(thread.tags || []).map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-mono tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm text-text-secondary hidden md:block">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-text-secondary bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                  <MessageSquare size={14} />
                  <span className="font-mono">{thread.replies || 0}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button className="magnetic mt-6 w-full md:hidden flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-3 rounded-xl font-medium transition-colors">
        <PlusSquare size={18} className="text-gemini-pink" />
        New Thread
      </button>
    </section>
  );
}

const ContentPages = () => {
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.content-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.content-container',
          start: 'top 80%',
        }
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={contentRef} className="w-full flex flex-col items-center content-container">
      {/* VIDEO HUB SECTION */}
      <section id="videos" className="w-full max-w-6xl px-6 py-24 border-t border-white/5">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Video <span className="text-gradient">Hub</span></h2>
          <p className="text-text-secondary">Curated YouTube tutorials, updates, and deep dives on the Gemini ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="content-card glass-card overflow-hidden group">
            <div className="aspect-video bg-black/50 relative flex items-center justify-center border-b border-white/10 group-hover:border-gemini-blue/30 transition-colors">
              <Play className="w-12 h-12 text-white/50 group-hover:text-gemini-pink transition-all group-hover:scale-110" />
            </div>
            <div className="p-5">
              <h4 className="text-lg font-medium mb-1">Getting Started with the Gemini API</h4>
              <p className="text-sm text-text-secondary">Learn how to make your first multimodal request using Node.js.</p>
            </div>
          </div>

          <div className="content-card glass-card overflow-hidden group">
            <div className="aspect-video bg-black/50 relative flex items-center justify-center border-b border-white/10 group-hover:border-gemini-blue/30 transition-colors">
              <Play className="w-12 h-12 text-white/50 group-hover:text-gemini-pink transition-all group-hover:scale-110" />
            </div>
            <div className="p-5">
              <h4 className="text-lg font-medium mb-1">Building Autonomous Agents with 1.5 Pro</h4>
              <p className="text-sm text-text-secondary">A deep dive into tool-use and multi-step reasoning architectures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RESOURCES & AFFILIATES SECTION */}
      <section id="resources" className="w-full max-w-6xl px-6 py-24 mb-24 border-t border-white/5">
        <div className="mb-12 text-center flex flex-col items-center">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Resources & <span className="text-gradient">Tools</span></h2>
          <p className="text-text-secondary max-w-2xl">Premium tools, hardware, and services recommended by the GeminiPulse community to accelerate your AI workflow.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Google Workspace API", desc: "Integrate Gemini directly into Docs and Sheets.", badge: "Recommended" },
            { name: "Cloud Run Hosting", desc: "Deploy your agentic workflows effortlessly.", badge: "Partner" },
            { name: "Firebase Pro", desc: "Real-time DBs and Authentication for AI Apps.", badge: "Tool" },
            { name: "Gemini Advanced", desc: "Subscribe to the Gemini Advanced tier.", badge: "AI" }
          ].map((item, i) => (
            <a href="#" key={i} className="content-card glass-card p-6 flex flex-col items-center text-center gap-3 hover:-translate-y-1 transition-all">
              <span className="text-[10px] uppercase font-mono tracking-wider bg-white/5 text-text-secondary px-2 py-0.5 rounded-sm mb-2">{item.badge}</span>
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              <div className="mt-4 text-xs font-mono text-gemini-blue flex items-center gap-1 group-hover:text-gemini-pink transition-colors">
                Explore <ArrowRight size={12} />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Application
// ----------------------------------------------------------------------

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Entrance
      gsap.from('.hero-text', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });

      // Feature Cards Entrance
      gsap.from('.feature-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-grid',
          start: 'top 80%',
        }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* The Breathing Pulse Background */}
      <div className="fixed -bottom-[20vh] -left-[10vw] w-[60vw] h-[60vw] rounded-full bg-gemini-purple opacity-[0.05] blur-[120px] animate-pulse-slow pointer-events-none z-0"></div>
      <div className="fixed top-[10vh] -right-[10vw] w-[50vw] h-[50vw] rounded-full bg-gemini-blue opacity-[0.03] blur-[100px] animate-pulse-slow pointer-events-none z-0" style={{ animationDelay: '2s' }}></div>

      <Navbar />

      <main className="relative z-10 w-full flex flex-col items-center">

        {/* HERO SECTION */}
        <section className="min-h-[90vh] w-full max-w-6xl px-6 flex flex-col justify-end pb-24 relative pt-32">

          <div className="hero-text font-mono text-xs text-gemini-purple tracking-widest uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gemini-pink animate-pulse"></span>
            System Online • 1M Context Window Active
          </div>

          <h1 className="hero-text text-5xl md:text-7xl lg:text-[84px] font-bold leading-[1.05] tracking-tight mb-8 max-w-4xl">
            Tracking the <br />
            <span className="text-gradient">Heartbeat</span> of <br />
            Google AI.
          </h1>

          <p className="hero-text text-lg md:text-xl text-text-secondary max-w-2xl mb-12">
            The premier intelligence dashboard and community hub for tracking Gemini models, API updates, and agentic workflows.
          </p>

          <div className="hero-text flex gap-4">
            <button className="magnetic bg-white text-gemini-void px-8 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-200 transition-colors">
              Access the Pulse <ArrowRight size={18} />
            </button>
            <button className="magnetic border border-white/20 bg-black/20 backdrop-blur-sm hover:bg-white/10 text-white px-8 py-3 rounded-full font-semibold transition-colors">
              View Forums
            </button>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="w-full max-w-6xl px-6 py-24 border-t border-white/5 features-grid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="feature-card">
              <HeroCardFeature
                icon={Zap}
                title="The Live Feed Radar"
                badge="Real-time"
                description="A constantly updating chronological stream of Gemini API updates, model releases, and official Google AI news."
              />
            </div>
            <div className="feature-card">
              <HeroCardFeature
                icon={ShieldAlert}
                title="Autonomous Moderation"
                badge="Gemini 1.5"
                description="Experience a forum operated by the model itself, scanning and filtering threads for high-signal technical discussions."
              />
            </div>
            <div className="feature-card">
              <HeroCardFeature
                icon={Workflow}
                title="Agentic Workflows"
                badge="Community"
                description="Discover and share complex prompts where Gemini acts as an autonomous agent passing data between multi-step tasks."
              />
            </div>
          </div>
        </section>

        {/* FORUM SECTION */}
        <CommunityForum />

        {/* CONTENT & MONETIZATION */}
        <ContentPages />

        <footer className="w-full border-t border-white/10 bg-[#040507] py-12 flex flex-col items-center text-center text-text-secondary text-sm">
          <div className="font-sans font-bold text-lg tracking-tight text-gradient flex items-center gap-2 mb-4">
            <Activity size={18} className="text-gemini-purple" />
            GeminiPulse
          </div>
          <p className="mb-6 max-w-sm">The premier intelligence dashboard for tracking Google's Gemini models and agentic workflows.</p>

          <div className="flex gap-6 mb-8 font-mono text-xs">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Affiliate Disclosure</a>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/10 text-green-400 font-mono text-[10px] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            System Operational
          </div>
        </footer>

      </main>
    </div>
  );
}

export default App;
