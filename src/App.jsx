import React, { useRef, useState, useEffect } from 'react';
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import { CustomEase } from "gsap/CustomEase";
import { RoughEase } from "gsap/EasePack";
    
import { Draggable } from "gsap/Draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";

import { TerminalAnimationDemo } from './components/ui/terminal-animation';
import ASCIIText from './components/ui/ASCIIText';
import Dashboard from './components/Dashboard';
import { useAuth } from './lib/AuthContext.jsx';

import './App.css';

gsap.registerPlugin(useGSAP,Draggable,MotionPathPlugin,ScrollTrigger,ScrollToPlugin,ScrollSmoother,SplitText,TextPlugin,RoughEase,CustomEase);


// Trust Marquee Component
const Marquee = () => {
  const companies = [
    { 
      name: 'stripe', 
      color: '#635bff', 
      path: 'M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z' 
    },
    { 
      name: 'google', 
      color: '#ea4335', 
      path: 'M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z' 
    },
    { 
      name: 'vercel', 
      color: '#ffffff', 
      path: 'm12 1.608 12 20.784H0Z' 
    },
    { 
      name: 'slack', 
      color: '#2eb67d', 
      path: 'M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z' 
    },
    { 
      name: 'figma', 
      color: '#f24e1e', 
      path: 'M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z' 
    },
    { 
      name: 'linear', 
      color: '#5e6ad2', 
      path: 'M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z' 
    },
    { 
      name: 'airbnb', 
      color: '#ff5a5f', 
      path: 'M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z' 
    },
    { 
      name: 'replicate', 
      color: '#00f0ff', 
      path: 'M24 10.262v2.712h-9.518V24h-3.034V10.262zm0-5.131v2.717H8.755V24H5.722V5.131zM24 0v2.717H3.034V24H0V0z' 
    }
  ];
  

  // Duplicate list to ensure seamless looping marquee
  const marqueeList = [...companies, ...companies, ...companies];

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {marqueeList.map((company, index) => (
          <div 
            key={index} 
            className="marquee-item" 
            style={{ '--hover-color': company.color }}
          >
            <svg 
              role="img" 
              viewBox="0 0 24 24" 
              className="marquee-logo-svg" 
              width="20"
              height="20"
            >
              <path d={company.path} />
            </svg>
            <span className="marquee-logo-text">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const containerRef = useRef(null);
  const leftHandRef = useRef(null);
  const rightHandRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);
  const centerLogoRef = useRef(null);
  const navIndicatorRef = useRef(null);

  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [view, setView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [showThemeHint, setShowThemeHint] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth form state
  const [authFullName, setAuthFullName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoaderActive, setAuthLoaderActive] = useState(false);
  const [showVerifyPopup, setShowVerifyPopup] = useState(false);

  // If auth session exists, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      setView('dashboard');
    }
  }, [user, authLoading]);

  const navItems = ['home', 'product', 'solutions', 'pricing', 'docs', 'about'];


  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
    setShowThemeHint(false);
  };

  // 'T' key to toggle theme
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 't' || e.key === 'T') {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        toggleTheme();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [theme]);

  // Set initial theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  // Function to handle smooth scrolling to targeted page ID
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (!element) return;
    setActiveTab(id);
    const smoother = window.__scrollSmoother;
    if (smoother) {
      smoother.scrollTo(element, true, 'top top');
    } else {
      gsap.to(window, {
        duration: 1.1,
        scrollTo: { y: element, offsetY: 0 },
        ease: 'power3.inOut'
      });
    }
  };

  // IntersectionObserver to auto-update active navigation link on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    navItems.forEach((item) => {
      const el = document.getElementById(item);
      if (el) observer.observe(el);
    });

    return () => {
      navItems.forEach((item) => {
        const el = document.getElementById(item);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Sync nav background slider on tab changes
  useEffect(() => {
    const activeNode = document.querySelector(`.nav-item[data-tab="${activeTab}"]`);
    if (activeNode && navIndicatorRef.current) {
      const parent = activeNode.parentNode;
      const rect = activeNode.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      gsap.to(navIndicatorRef.current, {
        left: rect.left - parentRect.left,
        width: rect.width,
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out'
      });
    }
  }, [activeTab]);

  // Pill Nav hover animations
  const handleNavHover = (e) => {
    if (!navIndicatorRef.current) return;
    const target = e.target;
    const parent = target.parentNode;
    const rect = target.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    gsap.to(navIndicatorRef.current, {
      left: rect.left - parentRect.left,
      width: rect.width,
      opacity: 1,
      duration: 0.25,
      ease: 'power2.out'
    });
  };

  const handleNavLeave = () => {
    if (!navIndicatorRef.current) return;
    const activeNode = document.querySelector(`.nav-item[data-tab="${activeTab}"]`);
    if (activeNode) {
      const parent = activeNode.parentNode;
      const rect = activeNode.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      gsap.to(navIndicatorRef.current, {
        left: rect.left - parentRect.left,
        width: rect.width,
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out'
      });
    } else {
      gsap.to(navIndicatorRef.current, {
        opacity: 0,
        duration: 0.25
      });
    }
  };

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mx', `${x}px`);
    e.currentTarget.style.setProperty('--my', `${y}px`);
  };

  // Entrance animations with GSAP (featuring sequenced curtain preloader & blur reveals)
  useGSAP(() => {
    if (view !== 'landing') return;

    // 0. Initialize ScrollSmoother (only on landing page view)
    let smoother;
    if (document.querySelector('#smooth-wrapper')) {
      smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: true
      });
      window.__scrollSmoother = smoother;
    }

    // 1. Text Splitting with GSAP SplitText
    const logoNode = document.querySelector(".logo-text");
    const logoTarget = logoNode ? new SplitText(logoNode, { type: "chars" }).chars : ".logo-text-ascii-wrapper";

    const humanDescNode = document.querySelector(".human-desc");
    const artificialDescNode = document.querySelector(".artificial-desc");
    
    let splitHumanWords = [];
    if (humanDescNode) {
      const splitHuman = new SplitText(humanDescNode, {
        type: "lines,words",
        linesClass: "text-line multi-word",
        wordsClass: "word"
      });
      splitHuman.lines.forEach(line => {
        if (line.querySelectorAll('.word').length <= 1) {
          line.classList.remove('multi-word');
          line.classList.add('single-word');
        }
      });
      splitHumanWords = splitHuman.words;
    }

    let splitArtificialWords = [];
    if (artificialDescNode) {
      const splitArtificial = new SplitText(artificialDescNode, {
        type: "lines,words",
        linesClass: "text-line multi-word",
        wordsClass: "word"
      });
      splitArtificial.lines.forEach(line => {
        if (line.querySelectorAll('.word').length <= 1) {
          line.classList.remove('multi-word');
          line.classList.add('single-word');
        }
      });
      splitArtificialWords = splitArtificial.words;
    }


    // Lock scrolling during preloader
    document.body.style.overflow = 'hidden';

    // ─── CINEMATIC PRELOADER TIMELINE ───────────────────────────────
    // Scene 1 → 2 → 3 per the design brief
    const mainTl = gsap.timeline({
      onComplete: () => {
        setShowPreloader(false);
        document.body.style.overflow = '';
      }
    });

    // ── SCENE 1: Reveal "LOOP X HUMAN" via horizontal clip-path masks ──
    // Each word's .preloader-word-mask starts clipped (height 0) and opens downward
    // revealing the text as if a shutter is pulled away.

    const hasPreloader = gsap.utils.toArray('.preloader-word-mask').length > 0;

    if (hasPreloader) {
      // Start: all word masks fully closed (clipPath height = 0%)
      gsap.set('.preloader-word-mask', { clipPath: 'inset(0 0 100% 0)' });
      gsap.set('.preloader-slice', { scaleX: 0, opacity: 0 });

      // Reveal LOOP X HUMAN with staggered shutter-open (bottom edge of mask rises up)
      // At t=0.3s
      mainTl.to('.preloader-word-mask', {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.9,
        ease: 'expo.inOut',
        stagger: 0.1
      }, 0.3);
    }

    // Brief hold after full reveal (timeline position ~1.3s)

    if (hasPreloader) {
      // ── SCENE 2: Slicing lines travel across, destroying X and HUMAN ──
      // At t=1.3s, horizontal slice lines scan across the type stage
      const slices = gsap.utils.toArray('.preloader-slice');
      const stageHeight = 1; // normalized, we space slices across the type area height

      // Animate each slice line: it scans from left to right then vanishes
      slices.forEach((slice, i) => {
        // Offset slices vertically by setting their top position
        gsap.set(slice, {
          top: `${28 + i * 10}%`, // spread across the typography area
          transformOrigin: 'left center',
        });
        mainTl.fromTo(slice,
          { scaleX: 0, opacity: 1 },
          { scaleX: 1, opacity: 1, duration: 0.22, ease: 'power4.inOut' },
          1.3 + i * 0.1
        );
        // After each slice passes, it fades while cutting through text
        mainTl.to(slice, {
          scaleX: 1, opacity: 0, duration: 0.15, ease: 'power2.in'
        }, 1.3 + i * 0.1 + 0.22);
      });

      // X word: clip it out (masked to 0 height) as slices cut through at t=1.55s
      mainTl.to('#pl-word-x .preloader-word-mask', {
        clipPath: 'inset(50% 0 50% 0)',
        duration: 0.4,
        ease: 'power4.inOut'
      }, 1.5);

      // HUMAN word: collapse via horizontal clip a moment later
      mainTl.to('#pl-word-human .preloader-word-mask', {
        clipPath: 'inset(50% 0 50% 0)',
        duration: 0.45,
        ease: 'power4.inOut'
      }, 1.7);

      // ── LOOP word recenters itself after X & HUMAN are gone ──
      // The type-stage has flexbox so LOOP naturally centers when siblings disappear.
      // We also subtly nudge its position for a breathing-room feel.
      mainTl.to('#pl-word-loop', {
        x: 0,
        duration: 0.6,
        ease: 'expo.inOut'
      }, 2.0);

      // Brief hold with only LOOP visible (~2.2–3.0s)

      // ── SCENE 3: Curtain cut middle slice (top / down open) ──
      // At t=3.1s, the top and bottom panels split open, revealing the site underneath
      mainTl.to('.preloader-panel-top', {
        yPercent: -100,
        duration: 1.2,
        ease: 'power4.inOut'
      }, 3.1);

      mainTl.to('.preloader-panel-bottom', {
        yPercent: 100,
        duration: 1.2,
        ease: 'power4.inOut'
      }, 3.1);

      // Simultaneously fade out and scale up the LOOP text smoothly
      mainTl.to('.preloader-type-stage', {
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        ease: 'power3.out'
      }, 3.1);
    }

    // 3. Hero Elements Entrance Reveals
    mainTl.fromTo(leftHandRef.current, 
      { x: -500, opacity: 0, filter: 'blur(15px)' },
      { x: 0, opacity: 1, filter: 'blur(0px)', duration: 2.2, ease: 'power3.out' },
      '-=1.2'
    );

    mainTl.fromTo(rightHandRef.current, 
      { x: 500, opacity: 0, filter: 'blur(15px)' },
      { x: 0, opacity: 1, filter: 'blur(0px)', duration: 2.2, ease: 'power3.out' },
      '-=2.2' // Sync left & right hands
    );

    // Stagger letters or animate the ASCIIText container of the logo
    mainTl.fromTo(logoTarget,
      { y: 80, opacity: 0, filter: 'blur(15px)', scale: 0.8 },
      { 
        y: 0, 
        opacity: 1, 
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.4, 
        stagger: 0.08,
        ease: 'power4.out' 
      },
      '-=1.6'
    );

    mainTl.fromTo('.logo-glow-human, .logo-glow-artificial',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.4, ease: 'power2.out' },
      '-=1.4'
    );

    mainTl.fromTo('.logo-subtext',
      { opacity: 0, filter: 'blur(6px)', y: (i) => (i === 0 ? -15 : 15) },
      { opacity: 0.75, filter: 'blur(0px)', y: 0, duration: 1.4, stagger: 0.15, ease: 'power2.out' },
      '-=1.2'
    );

    // Blur text reveal for description paragraphs split words
    const wordsToAnimate = [...splitHumanWords, ...splitArtificialWords];
    if (wordsToAnimate.length > 0) {
      mainTl.fromTo(wordsToAnimate,
        { opacity: 0, filter: 'blur(12px)', y: 15 },
        { 
          opacity: 0.75, 
          filter: 'blur(0px)', 
          y: 0, 
          duration: 1.2, 
          stagger: 0.012, 
          ease: 'power3.out'
        },
        '-=1.0'
      );
    }

    mainTl.fromTo('.nav-pill',
      { y: -30, opacity: 0, filter: 'blur(6px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out' },
      '-=0.8'
    );

    // 4. ScrollTrigger section titles blur reveal
    const secTitles = gsap.utils.toArray('.sec-title');
    secTitles.forEach(title => {
      const splitTitle = new SplitText(title, { type: "words" });
      gsap.fromTo(splitTitle.words,
        { opacity: 0, filter: 'blur(12px)', y: 20 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          y: 0,
          duration: 1.4,
          stagger: 0.03,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    const secHeaders = gsap.utils.toArray('.sec-header');
    secHeaders.forEach(header => {
      const splitHeader = new SplitText(header, { type: "chars" });
      gsap.fromTo(splitHeader.chars,
        { opacity: 0, filter: 'blur(6px)', x: -10 },
        {
          opacity: 1,
          filter: 'blur(0px)',
          x: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }, { scope: containerRef, dependencies: [view] });

  if (view === 'dashboard') {
    return (
      <div ref={containerRef}>
        <Dashboard setView={setView} signOut={signOut} />
      </div>
    );
  }

  // Auth form submit handler
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoaderActive(true);

    try {
      if (authMode === 'login') {
        const { error } = await signIn({ email: authEmail, password: authPassword });
        if (error) {
          setAuthError(error.message || 'Login failed. Please check your credentials.');
        }
        // On success, useEffect above will redirect to dashboard
      } else {
        const { data, error } = await signUp({ email: authEmail, password: authPassword, fullName: authFullName });
        if (error) {
          setAuthError(error.message || 'Sign up failed. Please try again.');
        } else {
          // Show email verification popup
          setShowVerifyPopup(true);
        }
      }
    } catch (err) {
      setAuthError('An unexpected error occurred. Please try again.');
    } finally {
      setAuthLoaderActive(false);
    }
  };


  if (view === 'auth') {
    return (
      <div ref={containerRef} className="auth-split-wrapper">
        {/* Email Verification Popup Overlay */}
        {showVerifyPopup && (
          <div className="auth-verify-overlay">
            <div className="auth-verify-modal">
              <div className="auth-verify-icon">✉️</div>
              <h2 className="auth-verify-title">Check your email</h2>
              <p className="auth-verify-desc">
                We&apos;ve sent a verification link to <strong>{authEmail}</strong>.<br />
                Please verify your email before logging in.
              </p>
              <button
                className="auth-action-submit"
                onClick={() => {
                  setShowVerifyPopup(false);
                  setAuthMode('login');
                  setAuthPassword('');
                }}
              >
                BACK TO LOGIN ↗
              </button>
            </div>
          </div>
        )}

        {/* Left Hero Showcase Panel */}
        <div className="auth-left-hero">
          <div className="auth-hero-glow-top" />
          <div className="auth-hero-glow-bottom" />

          {/* Header */}
          <div className="auth-hero-header">
            <div 
              className="auth-hero-brand"
              onClick={() => setView('landing')}
              style={{ cursor: 'pointer' }}
            >
              loop<span>.</span>
            </div>
            <div className="auth-hero-badge">
              [ CONSOLE v2.6 ]
            </div>
          </div>

          {/* Hero Content */}
          <div className="auth-hero-body">
            <div className="auth-hero-tagline">
              <span className="auth-hero-tagline-dot" />
              Realtime Feedback Telemetry
            </div>

            <h1 className="auth-hero-title">
              the continuous <em>intelligence</em> system for product teams.
            </h1>

            {/* Live Telemetry Ticker Box */}
            <div className="auth-hero-telemetry-box">
              <div className="auth-telemetry-item">
                <span className="auth-telemetry-label">ingestion speed</span>
                <span className="auth-telemetry-val accent">3.4M/s</span>
              </div>
              <div className="auth-telemetry-item">
                <span className="auth-telemetry-label">uptime sla</span>
                <span className="auth-telemetry-val">99.99%</span>
              </div>
              <div className="auth-telemetry-item">
                <span className="auth-telemetry-label">drift alerts</span>
                <span className="auth-telemetry-val">0 active</span>
              </div>
            </div>

            {/* Testimonial */}
            <div className="auth-hero-testimonial">
              <p className="auth-testimonial-quote">
                &quot;LOOP completely streamlined how our engineering team triages user feedback into actionable code commits.&quot;
              </p>
              <div className="auth-testimonial-author">
                — Sarah Lin, Lead Systems Architect at Vercel
              </div>
            </div>
          </div>

          {/* Hero Footer */}
          <div className="auth-hero-footer">
            &copy; {new Date().getFullYear()} LOOP INTELLIGENCE SYSTEMS INC. ALL RIGHTS RESERVED.
          </div>
        </div>

        {/* Right Auth Portal Side */}
        <div className="auth-right-portal">
          <nav className="auth-portal-nav">
            <a 
              href="#landing" 
              className="auth-portal-back"
              onClick={(e) => { e.preventDefault(); setView('landing'); }}
            >
              ← return to site
            </a>
          </nav>

          <div className="auth-form-card">
            {/* Header */}
            <div className="auth-card-header">
              <div className="auth-card-logo-row">
                <div className="auth-card-brand">
                  loop<span>.</span>
                </div>
                <div className="auth-status-indicator">
                  <span className="auth-status-dot" />
                  LIVE CONSOLE
                </div>
              </div>

              <h2 className="auth-card-title">
                {authMode === 'login' ? 'welcome back' : 'create instance'}
              </h2>
              <p className="auth-card-subtitle">
                {authMode === 'login' 
                  ? 'enter your credentials to access the intelligence console' 
                  : 'sign up to start using the LOOP intelligence console'}
              </p>
            </div>

            {/* Mode Selector Switcher */}
            <div className="auth-tabs-row">
              <button 
                type="button"
                className={`auth-tab-btn ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
              >
                login
              </button>
              <button 
                type="button"
                className={`auth-tab-btn ${authMode === 'signup' ? 'active' : ''}`}
                onClick={() => { setAuthMode('signup'); setAuthError(''); }}
              >
                sign up
              </button>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="auth-error-banner">
                {authError}
              </div>
            )}

            {/* Auth Form */}
            <form className="auth-input-form" onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <div className="auth-field">
                  <label className="auth-field-label">Full Name</label>
                  <div className="auth-field-input-wrap">
                    <input 
                      type="text" 
                      placeholder="Alex Mercer" 
                      className="auth-field-input" 
                      required 
                      value={authFullName}
                      onChange={e => setAuthFullName(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label className="auth-field-label">Work Email</label>
                <div className="auth-field-input-wrap">
                  <input 
                    type="email" 
                    placeholder="alex@company.com" 
                    className="auth-field-input" 
                    required 
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-field-label">Password</label>
                <div className="auth-field-input-wrap">
                  <input 
                    type="password" 
                    placeholder="••••••••••••" 
                    className="auth-field-input" 
                    required 
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    minLength={6}
                  />
                </div>
              </div>

              {authMode === 'login' && (
                <div className="auth-form-options">
                  <label className="auth-checkbox-label">
                    <input type="checkbox" defaultChecked style={{ accentColor: '#ff3c3c' }} />
                    <span>Remember instance</span>
                  </label>
                  <a href="#forgot" className="auth-forgot-link" onClick={(e) => e.preventDefault()}>
                    forgot password?
                  </a>
                </div>
              )}

              <button type="submit" className="auth-action-submit" disabled={authLoaderActive}>
                {authLoaderActive
                  ? 'Processing...'
                  : authMode === 'login'
                    ? 'LOGIN TO CONSOLE ↗'
                    : 'CREATE INSTANCE ↗'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>

      {/* SaaS Pill Navigation */}
      <nav className={`nav-pill ${activeTab === 'about' ? 'about-active' : ''} ${theme === 'light' ? 'light-mode' : ''}`}>
        {/* Left Brand */}
        <div className="nav-brand" onClick={() => scrollToSection('home')} style={{ cursor: 'pointer' }}>
          <span>loop</span>
          <span className="nav-brand-dot">.</span>
        </div>

        {/* Center Links */}
        <div className="nav-links" onMouseLeave={handleNavLeave}>
          <div ref={navIndicatorRef} className="nav-indicator" />
          {navItems.map((item) => (
            <a 
              key={item}
              href={`#${item}`} 
              data-tab={item}
              className={`nav-item ${activeTab === item ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item);
              }}
              onMouseEnter={handleNavHover}
            >
              {activeTab === item ? `[ ${item} ]` : item}
            </a>
          ))}
        </div>

        {/* Right: theme toggle + hint + CTA */}
        <div className="nav-right-group">
          {showThemeHint && (
            <span className="nav-theme-hint">press [t] to switch theme</span>
          )}
          <button 
            className="nav-theme-btn" 
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <a href="#auth" className="nav-cta" onClick={(e) => { e.preventDefault(); setView('auth'); }}>
            get started ↗
          </a>
        </div>
      </nav>

      {/* Sliding Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay-menu">
          {/* Left panel (Dark Brand Preview) */}
          <div className="mobile-overlay-left">
            <div className="mobile-overlay-logo">
              loop<span className="dash-logo-dot">.</span>
            </div>
            <div className="mobile-overlay-brand-sub">
              THE FUTURE OF FEEDBACK INTELLIGENCE
            </div>
            <div className="mobile-overlay-meta">
              ALL CONSOLES / PURE TELEMETRY
              <br />
              EST. 2026
            </div>
          </div>

          {/* Right panel (Typographic Menu Links) */}
          <div className="mobile-overlay-right">
            {/* Close trigger */}
            <button className="mobile-overlay-close-btn" onClick={() => setMobileMenuOpen(false)}>
              ✕
            </button>

            <ul className="mobile-overlay-list">
              {navItems.map((item) => (
                <li key={item} className="mobile-overlay-item">
                  <a 
                    href={`#${item}`} 
                    className={`mobile-overlay-link ${activeTab === item ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      scrollToSection(item);
                    }}
                  >
                    {item}
                  </a>
                  <span className="mobile-overlay-item-lbl">GET THE SCOOP</span>
                </li>
              ))}
              <li className="mobile-overlay-item">
                <a 
                  href="#auth" 
                  className="mobile-overlay-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    setView('auth');
                  }}
                >
                  CONSOLE
                </a>
                <span className="mobile-overlay-item-lbl">JOIN US</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Floating Mobile Hamburger Button */}
      <button 
        className="floating-mobile-hamburger" 
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open mobile menu"
      >
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>

      <div className="app-container">
        {/* 0. CINEMATIC PRELOADER */}
        {showPreloader && (
          <div className="preloader-container">
            {/* Top and Bottom panels for curtain cut exit */}
            <div className="preloader-panel-top" />
            <div className="preloader-panel-bottom" />
            
            {/* Scene 1 & 2 — typography */}
            <div className="preloader-type-stage">
              {/* LOOP word group — stays alive into Scene 2 */}
              <div className="preloader-word" id="pl-word-loop">
                <div className="preloader-word-mask">
                  <span className="preloader-word-inner">LOOP</span>
                </div>
              </div>
              {/* X — sliced away in Scene 2 */}
              <div className="preloader-word" id="pl-word-x">
                <div className="preloader-word-mask">
                  <span className="preloader-word-inner pl-accent">X</span>
                </div>
              </div>
              {/* HUMAN — sliced away in Scene 2 */}
              <div className="preloader-word" id="pl-word-human">
                <div className="preloader-word-mask">
                  <span className="preloader-word-inner">HUMAN</span>
                </div>
              </div>
            </div>

            {/* Slice lines overlay — animated in Scene 2 */}
            <div className="preloader-slices" aria-hidden="true">
              <div className="preloader-slice" />
              <div className="preloader-slice" />
              <div className="preloader-slice" />
              <div className="preloader-slice" />
              <div className="preloader-slice" />
            </div>
          </div>
        )}

        <div id="smooth-wrapper">
          <div id="smooth-content">

          {/* 1. HOME SECTION */}
      <section id="home" className="section-container home-section">
        {/* Left Hand (Red) - sliding from left side */}
        <div ref={leftHandRef} className="hand-container left-hand">
          <img 
            src="/left_hand.png" 
            alt="Human Hand" 
            className="hand-img"
          />
        </div>

        {/* Right Hand (Artificial - White) - sliding from right side */}
        <div ref={rightHandRef} className="hand-container right-hand">
          <img 
            src="/right_hand.png" 
            alt="Artificial Hand" 
            className="hand-img"
          />
        </div>

        {/* Center Logo Section */}
        <div className="center-logo-container" ref={centerLogoRef}>
          <div className="logo-glow-container">
            <div className="logo-glow-human"></div>
            <div className="logo-glow-artificial"></div>
          </div>

          <span className="logo-subtext artificial-sub">
            artificial
          </span>

          <div className="logo-text-ascii-wrapper">
            <ASCIIText text="loop" enableWaves={true} asciiFontSize={8} planeBaseHeight={14} />
          </div>

          <span className="logo-subtext human-sub">
            human
          </span>
        </div>

        {/* Left Text Block */}
        <div ref={leftTextRef} className="text-block text-block-left">
          <h3 className="block-header human-hdr">human</h3>
          <p className="human-desc">
            Driven by curiosity and experience, every decision begins with understanding the people behind the feedback.
          </p>
        </div>

        {/* Right Text Block */}
        <div ref={rightTextRef} className="text-block text-block-right">
          <h3 className="block-header artificial-hdr">artificial</h3>
          <p className="artificial-desc">
            Connecting every signal into one continuous intelligence system, transforming conversations into confident product decisions.
          </p>
        </div>
      </section>

      {/* Infinite Logo Marquee Banner */}
      <Marquee />

      {/* 2. PRODUCT SECTION */}
      <section id="product" className="section-container product-section">
        <span className="sec-header">[product]</span>
        <h2 className="sec-title">continuous <em className="serif-italic">intelligence</em> for modern engineering teams.</h2>

        {/* Stat Cards Row */}
        <div className="product-stats-row">
          <div className="product-stat-card">
            <div className="psc-icon">⚡</div>
            <div className="psc-value">{'<'}3ms</div>
            <div className="psc-label">avg ingestion latency</div>
          </div>
          <div className="product-stat-card accent">
            <div className="psc-icon">🔴</div>
            <div className="psc-value">99.99%</div>
            <div className="psc-label">uptime SLA</div>
          </div>
          <div className="product-stat-card">
            <div className="psc-icon">📊</div>
            <div className="psc-value">1B+</div>
            <div className="psc-label">events processed daily</div>
          </div>
          <div className="product-stat-card">
            <div className="psc-icon">🌐</div>
            <div className="psc-value">42</div>
            <div className="psc-label">edge regions</div>
          </div>
        </div>

        {/* Feature list */}
        <div className="product-feature-grid">
          <div className="pfg-card">
            <span className="pfg-num">01</span>
            <div className="pfg-body">
              <h3 className="pfg-title">real-time <em className="serif-italic">signals</em></h3>
              <p className="pfg-desc">Process and correlate system logs, events, metrics, and user feedback instantly as they stream through your platform.</p>
            </div>
            <div className="pfg-line" />
          </div>
          <div className="pfg-card">
            <span className="pfg-num">02</span>
            <div className="pfg-body">
              <h3 className="pfg-title">conversational <em className="serif-italic">context</em></h3>
              <p className="pfg-desc">Inject state context directly into developers' workspaces. Ask questions and review system diagnostics in natural language.</p>
            </div>
            <div className="pfg-line" />
          </div>
          <div className="pfg-card">
            <span className="pfg-num">03</span>
            <div className="pfg-body">
              <h3 className="pfg-title">self-improving <em className="serif-italic">feedback</em></h3>
              <p className="pfg-desc">Loop trace patterns back to optimizing models and APIs. Continuously refine confidence variables automatically.</p>
            </div>
            <div className="pfg-line" />
          </div>
        </div>
      </section>

      {/* 3. SOLUTIONS SECTION */}
      <section id="solutions" className="section-container solutions-section">
        <span className="sec-header">[solutions]</span>
        <h2 className="sec-title">tailored <em className="serif-italic">workflows</em> built for developers and builders.</h2>
        
        <div className="solutions-accordion">
          <div className="sol-acc-card">
            <span className="sol-acc-num">01</span>
            <h3 className="sol-acc-title">incident <em className="serif-italic">response</em></h3>
            <p className="sol-acc-desc">Automatically triage pipeline failures, identify anomalies in codebases, and compile actionable context guides for debugging.</p>
            <span className="sol-acc-cta">telemetry trace ↗</span>
          </div>
          <div className="sol-acc-card">
            <span className="sol-acc-num">02</span>
            <h3 className="sol-acc-title">application <em className="serif-italic">monitoring</em></h3>
            <p className="sol-acc-desc">Track trace routes and user conversions to preemptively optimize core application speeds and UI latency bottlenecks.</p>
            <span className="sol-acc-cta">trace routes ↗</span>
          </div>
          <div className="sol-acc-card">
            <span className="sol-acc-num">03</span>
            <h3 className="sol-acc-title">model <em className="serif-italic">telemetry</em></h3>
            <p className="sol-acc-desc">Analyze production prompt-response chains, monitor token costs, safeguard outputs, and track prompt drift over time.</p>
            <span className="sol-acc-cta">prompt telemetry ↗</span>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section id="pricing" className="pricing-section-container">
        <div className="pricing-header-wrapper">
          <span className="sec-header">[pricing]</span>
          <h2 className="sec-title pricing-center-title">
            transparent <em className="serif-italic">plans</em> that scale.
          </h2>
          
          {/* Toggle Switch */}
          <div 
            className="billing-toggle-container-top"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          >
            <span className={`billing-toggle-label ${billingCycle === 'monthly' ? 'active' : ''}`}>monthly</span>
            <div className={`billing-switch ${billingCycle === 'yearly' ? 'yearly' : ''}`}>
              <span className="billing-switch-handle" />
            </div>
            <span className={`billing-toggle-label ${billingCycle === 'yearly' ? 'active' : ''}`}>
              yearly <span className="discount-badge">-20%</span>
            </span>
          </div>
        </div>

        <div className="sec-grid price-grid-layout" style={{ position: 'relative', zIndex: 2 }}>
          {/* Card 1: Developer / Free */}
          <div className="price-card-glass" onMouseMove={handleCardMouseMove}>
            <span className="price-plan-name">developer</span>
            <div className="price-val-glass">free</div>
            <ul className="price-features-glass">
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>50k telemetry events/mo</span>
              </li>
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>7-day log retention</span>
              </li>
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>Basic anomalies detection</span>
              </li>
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>1 active project integration</span>
              </li>
            </ul>
            <button className="price-btn-glass outlined" onClick={() => setView('auth')}>Start Free</button>
          </div>

          {/* Card 2: Growth Plan (Active) */}
          <div className="price-card-glass featured" onMouseMove={handleCardMouseMove}>
            <span className="price-plan-name">growth</span>
            <div className="price-val-glass">
              {billingCycle === 'monthly' ? '$29' : '$23'}<span className="price-subtext">/mo</span>
            </div>
            <ul className="price-features-glass">
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>1M telemetry events/mo</span>
              </li>
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>30-day log retention</span>
              </li>
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>Full anomalies & drift alerts</span>
              </li>
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>5 active project integrations</span>
              </li>
            </ul>
            <button className="price-btn-glass filled" onClick={() => setView('auth')}>Unlock Growth</button>
          </div>

          {/* Card 3: Enterprise Plan */}
          <div className="price-card-glass" onMouseMove={handleCardMouseMove}>
            <span className="price-plan-name">enterprise</span>
            <div className="price-val-glass">custom</div>
            <ul className="price-features-glass">
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>Unlimited ingestion events</span>
              </li>
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>Custom data retention policies</span>
              </li>
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>Dedicated edge node isolation</span>
              </li>
              <li>
                <span className="price-check-circle"><svg width="8" height="6" viewBox="0 0 10 8" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 4L3.5 6.5L9 1" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                <span>99.99% ingestion SLA support</span>
              </li>
            </ul>
            <button className="price-btn-glass outlined" onClick={() => setView('auth')}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* 5. DOCS SECTION */}
      <section id="docs" className="docs-section-centered">
        <div className="docs-header-block">
          <span className="sec-header">[docs]</span>
          <h2 className="sec-title docs-center-title">
            integrate inside <em className="serif-italic">three lines</em> of code.
          </h2>
          <p className="docs-center-desc">
            Install our lightweight SDK, declare the Loop trace client, and start logging telemetry logs. We support Node, Python, Rust, and Go runtimes natively.
          </p>
        </div>

        <div className="docs-terminal-centered-wrapper">
          <TerminalAnimationDemo />
        </div>
      </section>

      {/* 6. ABOUT SECTION (Custom design guide following the yellow club, but matching our red/black palette) */}
      <section id="about" className="section-container about-section">
        {/* Top bar with handle */}
        <div className="about-top-bar">
          <span className="about-handle">@loop.intelligence</span>
        </div>

        {/* Large blocky uppercase headline text */}
        <h2 className="about-main-text">
          LOOP IS A CONCEPT INTELLIGENCE & CREATIVE SPACE CURATED BY SYSTEMS IN SAN FRANCISCO, CA. DEVELOPER-OWNED. OPEN-SOURCE.
        </h2>

        {/* Inline list & contact blocks */}
        <div className="about-info-grid">
          <p className="about-list-inline">
            Telemetry, Continuous Analytics, Conversations, Feedback Loops, AI Guardrails, Real-Time Optimization, Model Drift Analysis
          </p>
          <div className="about-contacts">
            <span>+1 800-LOOP-INTEL</span>
            <span>info@loop.intel</span>
            <span>120 Hawthorne St. SF, CA 94105</span>
          </div>
        </div>

        {/* Bottom tags list */}
        <div className="about-bottom-bar">
          <span>real-time</span>
          <span>developer-first</span>
          <span>human-in-the-loop</span>
          <span>ai-native</span>
          <span>open-source</span>
          <span>cloud-hosted</span>
          <span>scalable</span>
          <span>secure</span>
        </div>

        {/* Bottom Black outline graphic block */}
        <div className="about-black-block">
          <div className="about-outline-text">loop</div>
          <div className="about-full-width-image-container">
            <img src="/about_hands.png" alt="Loop About Hands" className="about-full-width-img" />
          </div>
        </div>
      </section>


      {/* 7. FOOTER SECTION */}
      <footer className="footer-container">
        <div className="footer-top">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span>loop</span>
              <span className="footer-brand-dot">.</span>
            </div>
            <ul className="footer-links-list">
              <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>home</a></li>
              <li><a href="#product" onClick={(e) => { e.preventDefault(); scrollToSection('product'); }}>product</a></li>
              <li><a href="#solutions" onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }}>solutions</a></li>
              <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>pricing</a></li>
              <li><a href="#docs" onClick={(e) => { e.preventDefault(); scrollToSection('docs'); }}>docs</a></li>
              <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>about</a></li>
            </ul>
          </div>

          {/* Platform Col */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">platform</h4>
            <ul className="footer-links-list">
              <li><a href="#telemetry">signals</a></li>
              <li><a href="#analytics">analytics</a></li>
              <li><a href="#feedback">feedback loops</a></li>
              <li><a href="#drift">model drift</a></li>
            </ul>
          </div>

          {/* Resources Col */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">resources</h4>
            <ul className="footer-links-list">
              <li><a href="#changelog">changelog</a></li>
              <li><a href="#docs" onClick={(e) => { e.preventDefault(); scrollToSection('docs'); }}>documentation</a></li>
              <li><a href="#community">community desk</a></li>
              <li><a href="#status">cloud status</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="footer-newsletter-col">
            <span className="newsletter-title">sign up to our newsletter</span>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <div className="newsletter-pill">
                <input 
                  type="email" 
                  placeholder="your email" 
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-btn">↗</button>
              </div>
            </form>
          </div>
        </div>
        {/* Massive perspective text graphic */}
        <div className="footer-perspective-image-container">
          <img src="/footer_text.png" alt="Human X Loop" className="footer-perspective-img" />
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-links">
            <span>&copy; {new Date().getFullYear()} loop intelligence / all rights reserved</span>
            <a href="#privacy">privacy policy</a>
            <a href="#terms">terms of service</a>
          </div>
          <div className="footer-socials">
            <a href="#twitter" target="_blank" rel="noopener noreferrer">twitter</a>
            <a href="#instagram" target="_blank" rel="noopener noreferrer">instagram</a>
          </div>
        </div>
      </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
