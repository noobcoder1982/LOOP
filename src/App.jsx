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

  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [view, setView] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [showThemeHint, setShowThemeHint] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const [dashboardState, setDashboardState] = useState('data');
  const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');
  const [workspace, setWorkspace] = useState('loop.intel');
  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'hello. i am the loop customer feedback intelligence agent. ask me anything about your product logs, feedback trends, or user complaints.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [selectedFeedbackIndex, setSelectedFeedbackIndex] = useState(0);


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

    const splitHuman = new SplitText(".human-desc", {
      type: "lines,words",
      linesClass: "text-line multi-word",
      wordsClass: "word"
    });

    const splitArtificial = new SplitText(".artificial-desc", {
      type: "lines,words",
      linesClass: "text-line multi-word",
      wordsClass: "word"
    });

    // Custom check: if a split line has only 1 word, make it justify-content: flex-start
    splitHuman.lines.forEach(line => {
      if (line.querySelectorAll('.word').length <= 1) {
        line.classList.remove('multi-word');
        line.classList.add('single-word');
      }
    });

    splitArtificial.lines.forEach(line => {
      if (line.querySelectorAll('.word').length <= 1) {
        line.classList.remove('multi-word');
        line.classList.add('single-word');
      }
    });

    // Lock scrolling during preloader
    document.body.style.overflow = 'hidden';

    // 2. Timeline Boot Sequence
    const mainTl = gsap.timeline({
      onComplete: () => {
        setShowPreloader(false);
        document.body.style.overflow = '';
      }
    });

    const counterObj = { value: 0 };

    // Fade in the elegant counter
    mainTl.fromTo('.preloader-counter-wrapper',
      { opacity: 0, y: 15 },
      { opacity: 0.45, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // Tick count 00 to 100
    mainTl.to(counterObj, {
      value: 100,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        const numNode = document.querySelector('.preloader-counter-num');
        if (numNode) {
          const val = Math.floor(counterObj.value);
          numNode.textContent = val < 10 ? `0${val}` : val;
        }
      }
    });

    // Fade out the counter once finished
    mainTl.to('.preloader-counter-wrapper', {
      opacity: 0,
      y: -10,
      duration: 0.45,
      ease: 'power2.in'
    }, '+=0.1');

    // Seam subtly catches light
    mainTl.fromTo('.preloader-seam',
      { opacity: 0.05, background: 'rgba(255, 255, 255, 0.04)', boxShadow: '0 0 0px rgba(255, 255, 255, 0)' },
      { opacity: 1, background: 'rgba(255, 255, 255, 0.95)', boxShadow: '0 0 12px rgba(255, 255, 255, 0.5)', duration: 0.5, ease: 'power2.inOut', yoyo: true, repeat: 1 }
    );

    // Splitting curtain panels slide open like sliding doors
    mainTl.to('.preloader-panel-left', {
      xPercent: -100,
      duration: 1.6,
      ease: 'power4.inOut'
    }, '+=0.1');

    mainTl.to('.preloader-panel-right', {
      xPercent: 100,
      duration: 1.6,
      ease: 'power4.inOut'
    }, '<');

    mainTl.to('.preloader-seam', {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.inOut'
    }, '<');

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
    mainTl.fromTo([...splitHuman.words, ...splitArtificial.words],
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
  }, { scope: containerRef });

  if (view === 'dashboard') {
    // Icons mapping using clean inline SVG definitions
    const getSidebarIcon = (tabName) => {
      switch (tabName) {
        case 'Dashboard':
          return (
            <svg className="dash-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/>
              <rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
            </svg>
          );
        case 'Feedback Inbox':
          return (
            <svg className="dash-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
          );
        case 'Analytics':
          return (
            <svg className="dash-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M18 20V10M12 20V4M6 20v-6"/>
            </svg>
          );
        case 'Themes':
          return (
            <svg className="dash-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01"/>
            </svg>
          );
        case 'Ask LOOP':
          return (
            <svg className="dash-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          );
        case 'Reports':
          return (
            <svg className="dash-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
          );
        case 'Members':
          return (
            <svg className="dash-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          );
        case 'Settings':
          return (
            <svg className="dash-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          );
        default:
          return null;
      }
    };

    const sidebarTabs = [
      'Dashboard',
      'Feedback Inbox',
      'Analytics',
      'Themes',
      'Ask LOOP',
      'Reports',
      'Members',
      'Settings'
    ];

    // Workspace-specific demo data sets
    const getWorkspaceData = () => {
      switch (workspace) {
        case 'linear.dev':
          return {
            welcome: 'linear.dev workspace',
            kpis: {
              total: '24,190',
              totalChange: '+18.6%',
              newThisWeek: '2,408',
              newChange: '+12.4%',
              positive: '68.2%',
              positiveChange: '+1.5%',
              negative: '22.8%',
              negativeChange: '-2.4%',
              activeThemes: '16',
              reports: '48'
            },
            feedback: [
              { customer: 'cycles_master_4', channel: 'Slack', theme: 'git sync latency', sentiment: 'negative', status: 'NEW', date: 'Jul 7, 2026', text: 'VCS sync is dragging today. Commits taken on local git repository are taking up to 4 minutes to reflect on the linear issue boards. Highly disrupting our sprint cycles.' },
              { customer: 'roadmap_lead_7', channel: 'Email', theme: 'subtask creation speed', sentiment: 'positive', status: 'REVIEWED', date: 'Jul 6, 2026', text: 'Subtask creation bulk workflows are incredibly fast now! Loving the keyboard shortcut overrides. Saved our PM team hours during sprint planning.' },
              { customer: 'linear_enterprise_99', channel: 'Intercom', theme: 'issue board sorting', sentiment: 'neutral', status: 'ACTIONED', date: 'Jul 5, 2026', text: 'Can we add custom field sorting to board columns directly? Right now we have to go to list view first to filter, which is double work.' },
              { customer: 'sprint_dev_03', channel: 'API', theme: 'notification spam', sentiment: 'negative', status: 'NEW', date: 'Jul 5, 2026', text: 'API integration pushes duplicate notification logs to Slack channels whenever a comment is edited. Need filters to prevent spam.' },
              { customer: 'milestones_builder', channel: 'Slack', theme: 'git sync latency', sentiment: 'positive', status: 'REVIEWED', date: 'Jul 4, 2026', text: 'GitHub migration wizard was seamless. Mapped 400 issues with descriptions and assignees accurately in less than 5 minutes.' }
            ],
            themes: [
              { name: 'git sync latency', count: 312, trend: '+18%', dir: 'up' },
              { name: 'subtask creation speed', count: 204, trend: '+14%', dir: 'up' },
              { name: 'issue board sorting', count: 188, trend: '-2%', dir: 'down' },
              { name: 'notification spam', count: 142, trend: '+10%', dir: 'up' }
            ],
            ai: {
              summary: 'Git sync sync bottlenecks causing cycle delays for developers',
              rec: 'Optimize Webhook listener threads to clear queue backlogs',
              req: 'Bulk subtask editor dialog interface',
              pain: 'VCS updates taking >3m to display on lists'
            },
            voc: 'Linear user satisfaction remains high regarding keyboard-first UX, but external integration bottlenecks (especially GitHub/GitLab webhook latency) are causing a noticeable spike in friction for larger engineering teams.'
          };
        case 'stripe.int':
          return {
            welcome: 'stripe.int workspace',
            kpis: {
              total: '84,120',
              totalChange: '+24.1%',
              newThisWeek: '9,814',
              newChange: '+16.8%',
              positive: '81.4%',
              positiveChange: '+3.1%',
              negative: '11.6%',
              negativeChange: '-0.8%',
              activeThemes: '22',
              reports: '92'
            },
            feedback: [
              { customer: 'billing_merchant_8', channel: 'Slack', theme: 'checkout validation', sentiment: 'negative', status: 'NEW', date: 'Jul 7, 2026', text: 'Postal code input validation is failing for Canadian credit cards. Merchants are reporting checkout conversion drop-offs due to invalid zip warnings.' },
              { customer: 'saas_platform_0', channel: 'Email', theme: 'dispute portal charts', sentiment: 'positive', status: 'REVIEWED', date: 'Jul 6, 2026', text: 'Direct chargeback response automation templates are outstanding. Already successfully disputed three claims in the sandbox workspace.' },
              { customer: 'fintech_partner_3', channel: 'Intercom', theme: 'API throttle limits', sentiment: 'neutral', status: 'ACTIONED', date: 'Jul 5, 2026', text: 'Requesting details on extending the webhook rate limits during high volume events. Our nodes are getting rate limited at 100 req/sec.' },
              { customer: 'payouts_controller', channel: 'API', theme: 'instant payouts delay', sentiment: 'negative', status: 'NEW', date: 'Jul 5, 2026', text: 'Instant payouts validation checks are taking hours instead of minutes for UK debit cards. Customers complaining about delayed funds access.' },
              { customer: 'checkout_customizer', channel: 'Slack', theme: 'checkout validation', sentiment: 'positive', status: 'REVIEWED', date: 'Jul 4, 2026', text: 'Embedded payment elements match our dark theme perfectly. Conversion rate increased by 4.2% on mobile layouts.' }
            ],
            themes: [
              { name: 'checkout validation', count: 580, trend: '+22%', dir: 'up' },
              { name: 'instant payouts delay', count: 412, trend: '+15%', dir: 'up' },
              { name: 'dispute portal charts', count: 320, trend: '-5%', dir: 'down' },
              { name: 'API throttle limits', count: 240, trend: '+8%', dir: 'up' }
            ],
            ai: {
              summary: 'Canadian zip code checkout validation rejects valid inputs',
              rec: 'Modify postal validation regex to support space chars',
              req: 'Apple Pay direct checkout UI element',
              pain: 'Instant payouts taking >4h in EU region'
            },
            voc: 'Stripe merchants appreciate checkout element styling capabilities, but validation irregularities in postal inputs and debit payout processing delays for UK banks are creating transaction bottlenecks.'
          };
        case 'loop.intel':
        default:
          return {
            welcome: 'loop.intel workspace',
            kpis: {
              total: '12,840',
              totalChange: '+14.2%',
              newThisWeek: '1,204',
              newChange: '+8.1%',
              positive: '72.6%',
              positiveChange: '+2.4%',
              negative: '18.4%',
              negativeChange: '-1.2%',
              activeThemes: '12',
              reports: '34'
            },
            feedback: [
              { customer: 'linear_user_44', channel: 'Slack', theme: 'performance latency', sentiment: 'negative', status: 'NEW', date: 'Jul 7, 2026', text: 'Ingested logs and chat summaries are taking up to 10 seconds to load on the search pane. Performance latency is rendering live telemetry unusable.' },
              { customer: 'stripe_merch_09', channel: 'Email', theme: 'API keys security', sentiment: 'positive', status: 'REVIEWED', date: 'Jul 6, 2026', text: 'The new read-only API token generator is excellent. Safely integrated our Slack signals streams without exposing administrative credentials.' },
              { customer: 'vercel_builder_dx', channel: 'Intercom', theme: 'navigation UX', sentiment: 'neutral', status: 'ACTIONED', date: 'Jul 5, 2026', text: 'Can we get an adaptive sticky navigation bar for the telemetry dashboard views? Scroll fatigue is high when looking through 50 columns.' },
              { customer: 'notion_workspace_pro', channel: 'API', theme: 'billing subscription', sentiment: 'negative', status: 'NEW', date: 'Jul 5, 2026', text: 'Webhook payouts failed to process after invoice cycle update. Customer success rep was unresponsive for two business days.' },
              { customer: 'figma_designer_88', channel: 'Slack', theme: 'performance latency', sentiment: 'positive', status: 'REVIEWED', date: 'Jul 4, 2026', text: 'The horizontal logo marquee stop-on-hover interaction is very slick. Highlight transition to brand colors is beautifully polished.' }
            ],
            themes: [
              { name: 'performance latency', count: 184, trend: '+12%', dir: 'up' },
              { name: 'navigation UX', count: 128, trend: '+8%', dir: 'up' },
              { name: 'API keys security', count: 96, trend: '-3%', dir: 'down' },
              { name: 'billing subscription', count: 64, trend: '+5%', dir: 'up' }
            ],
            ai: {
              summary: 'Telemetry interface displaying high load query timeouts',
              rec: 'Add secondary database index parameters for user workspaces',
              req: 'Export raw table arrays to CSV sheets directly',
              pain: 'API logs loading speeds average 8.4 seconds'
            },
            voc: 'Workspace signals indicate solid feedback summaries processing, but UI latency on massive log arrays is causing user fatigue. Prompt database caching index optimizations are strongly advised.'
          };
      }
    };

    const wsData = getWorkspaceData();

    // Trigger workspace change simulation (loading state skeleton)
    const handleWorkspaceChange = (wsName) => {
      setWorkspace(wsName);
      setWorkspaceDropdownOpen(false);
      setDashboardState('loading');
      setTimeout(() => {
        setDashboardState('data');
      }, 1200);
    };

    // Chat completion API submit (using NVIDIA API key integrate client)
    const handleSendChat = async (directMsgInput = null) => {
      const targetMsg = directMsgInput || chatInput;
      if (!targetMsg.trim() || isSendingChat) return;
      
      setChatInput('');
      setChatMessages(prev => [...prev, { sender: 'user', text: targetMsg }]);
      setIsSendingChat(true);

      // Loader message
      setChatMessages(prev => [...prev, { sender: 'ai', text: 'Thinking...' }]);

      try {
        const response = await fetch("/api/nvidia/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_NVIDIA_API_KEY}`,
            "Accept": "application/json"
          },
          body: JSON.stringify({
            model: "deepseek-ai/deepseek-v4-flash",
            messages: [
              {
                role: "user",
                content: `You are LOOP AI, an executive customer feedback assistant. Explain briefly (2-3 sentences max). Question: ${targetMsg}`
              }
            ],
            temperature: 1,
            top_p: 0.95,
            max_tokens: 4096,
            chat_template_kwargs: { "thinking": true, "reasoning_effort": "high" },
            stream: false
          })
        });

        const contentType = response.headers.get("content-type") || "";
        let aiText = "";

        if (contentType.includes("text/event-stream") || response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          let finished = false;
          let buffer = "";

          while (!finished) {
            const { value, done } = await reader.read();
            if (done) {
              finished = true;
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop();

            for (const line of lines) {
              const cleanLine = line.trim();
              if (cleanLine.startsWith("data: ")) {
                const jsonStr = cleanLine.substring(6).trim();
                if (jsonStr === "[DONE]") continue;
                try {
                  const chunkObj = JSON.parse(jsonStr);
                  const reasoning = chunkObj.choices[0]?.delta?.reasoning || chunkObj.choices[0]?.delta?.reasoning_content || "";
                  const content = chunkObj.choices[0]?.delta?.content || "";
                  if (reasoning) {
                    aiText += reasoning;
                  }
                  aiText += content;
                } catch (e) {}
              } else if (cleanLine) {
                try {
                  const chunkObj = JSON.parse(cleanLine);
                  const reasoning = chunkObj.choices[0]?.message?.reasoning || chunkObj.choices[0]?.message?.reasoning_content || "";
                  const content = chunkObj.choices[0]?.message?.content || chunkObj.choices[0]?.delta?.content || "";
                  if (reasoning) {
                    aiText += `--- Thinking Process ---\n${reasoning}\n--- Response ---\n`;
                  }
                  aiText += content;
                } catch (e) {}
              }
            }
          }
        } else {
          const rawText = await response.text();
          try {
            const data = JSON.parse(rawText);
            const reasoningText = data.choices[0]?.message?.reasoning || data.choices[0]?.message?.reasoning_content || "";
            const contentText = data.choices[0]?.message?.content || "";
            aiText = reasoningText ? `--- Thinking Process ---\n${reasoningText}\n--- Response ---\n${contentText}` : contentText;
          } catch (e) {
            if (rawText.includes("data: ")) {
              const lines = rawText.split("\n");
              for (const line of lines) {
                const cleanLine = line.trim();
                if (cleanLine.startsWith("data: ")) {
                  const jsonStr = cleanLine.substring(6).trim();
                  if (jsonStr === "[DONE]") continue;
                  try {
                    const chunkObj = JSON.parse(jsonStr);
                    aiText += chunkObj.choices[0]?.delta?.content || "";
                  } catch (err) {}
                }
              }
            } else {
              throw e;
            }
          }
        }

        if (!aiText) {
          throw new Error("No response content from model");
        }

        setChatMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { sender: 'ai', text: aiText };
          return updated;
        });
      } catch (error) {
        console.error("NVIDIA API error, using simulation:", error);
        setTimeout(() => {
          let fallbackAnswer = "Based on our telemetry models, we detected a 12% increase in latency over the API gateways. Caching replicas are suggested.";
          if (targetMsg.toLowerCase().includes('latency') || targetMsg.toLowerCase().includes('slow')) {
            fallbackAnswer = "I've analyzed the logs for the latency themes. Response times spikes correlate to database invite lookups during peaks. Optimizing indexes will solve this.";
          } else if (targetMsg.toLowerCase().includes('security') || targetMsg.toLowerCase().includes('key')) {
            fallbackAnswer = "The read-only token feature has been verified. No administrative leakage detected. All tokens are encrypted using SHA-256.";
          } else if (targetMsg.toLowerCase().includes('advice') || targetMsg.toLowerCase().includes('youtube') || targetMsg.toLowerCase().includes('kratos')) {
            fallbackAnswer = "I suggest reviewing your API ingestion filters. We noticed duplications on webhooks events.";
          }
          
          setChatMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { sender: 'ai', text: fallbackAnswer };
            return updated;
          });
        }, 800);
      } finally {
        setIsSendingChat(false);
      }
    };

    return (
      <div className="dash-container">
        {/* Redesigned Sidebar Layout */}
        <aside className={`dash-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="dash-sidebar-top">
            <div className="dash-logo">
              {sidebarCollapsed ? 'l' : 'loop'}<span className="dash-logo-dot">.</span>
            </div>
            
            <ul className="dash-menu-list">
              {sidebarTabs.map((tab) => (
                <li 
                  key={tab} 
                  className={`dash-menu-item ${activeSidebarTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveSidebarTab(tab)}
                  title={sidebarCollapsed ? tab : undefined}
                >
                  {getSidebarIcon(tab)}
                  {!sidebarCollapsed && <span>{tab}</span>}
                </li>
              ))}
            </ul>

            <button 
              className="dash-sidebar-collapse-btn" 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? '→' : '← collapse'}
            </button>
          </div>

          <div className="dash-sidebar-footer">
            <div className="dash-profile-card">
              <div className="dash-avatar">G</div>
              <div className="dash-profile-info">
                <span className="dash-username">guest user</span>
                <span className="dash-workspace">{workspace}</span>
              </div>
            </div>
            <span className="dash-logout-btn" onClick={() => setView('landing')}>
              {sidebarCollapsed ? 'out ↗' : 'logout ↗'}
            </span>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dash-main">
          {/* Top Navigation */}
          <header className="dash-top-bar">
            {/* Workspace selection dropdown with clean toggle action */}
            <div className="dash-workspace-select-container">
              <div className="dash-workspace-select" onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}>
                <span>{workspace}</span>
                <span className="dash-workspace-select-arrow">▼</span>
              </div>

              {workspaceDropdownOpen && (
                <div className="dash-workspace-dropdown">
                  <div 
                    className={`dash-workspace-dropdown-item ${workspace === 'loop.intel' ? 'active' : ''}`}
                    onClick={() => handleWorkspaceChange('loop.intel')}
                  >
                    <span>loop.intel</span>
                    {workspace === 'loop.intel' && <span>✓</span>}
                  </div>
                  <div 
                    className={`dash-workspace-dropdown-item ${workspace === 'linear.dev' ? 'active' : ''}`}
                    onClick={() => handleWorkspaceChange('linear.dev')}
                  >
                    <span>linear.dev</span>
                    {workspace === 'linear.dev' && <span>✓</span>}
                  </div>
                  <div 
                    className={`dash-workspace-dropdown-item ${workspace === 'stripe.int' ? 'active' : ''}`}
                    onClick={() => handleWorkspaceChange('stripe.int')}
                  >
                    <span>stripe.int</span>
                    {workspace === 'stripe.int' && <span>✓</span>}
                  </div>
                </div>
              )}
            </div>

            {/* Right: States switcher control */}
            <div className="dash-top-right">
              <div className="dash-state-toggles">
                <div 
                  className={`dash-state-btn ${dashboardState === 'data' ? 'active' : ''}`}
                  onClick={() => setDashboardState('data')}
                >
                  Full Data
                </div>
                <div 
                  className={`dash-state-btn ${dashboardState === 'loading' ? 'active' : ''}`}
                  onClick={() => setDashboardState('loading')}
                >
                  Loading
                </div>
                <div 
                  className={`dash-state-btn ${dashboardState === 'empty' ? 'active' : ''}`}
                  onClick={() => setDashboardState('empty')}
                >
                  Empty
                </div>
                <div 
                  className={`dash-state-btn ${dashboardState === 'error' ? 'active' : ''}`}
                  onClick={() => setDashboardState('error')}
                >
                  Error
                </div>
              </div>

              <button className="dash-notify-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="dash-notify-dot" />
              </button>
            </div>
          </header>

          {/* Render individual page based on selected tab */}
          <div className="dash-content">
            {/* Error Banner */}
            {dashboardState === 'error' && (
              <div className="error-state-panel">
                <div className="error-info">
                  <span className="error-title">Failed to fetch feedback intelligence data</span>
                  <span className="error-desc">A socket connection timed out during request parsing.</span>
                </div>
                <button className="error-btn" onClick={() => setDashboardState('data')}>
                  Retry
                </button>
              </div>
            )}

            {/* TAB 1: DASHBOARD */}
            {activeSidebarTab === 'Dashboard' && (
              <>
                <div className="dash-welcome-header">
                  <div>
                    <h1 className="dash-welcome-title">{wsData.welcome}</h1>
                    <span className="dash-welcome-sub">executive customer feedback intelligence overview</span>
                  </div>
                  <div className="dash-date-selector">
                    <span>July 7, 2026</span>
                    <span style={{ fontSize: '0.6rem' }}>▼</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="dash-quick-actions-bar">
                  <button className="quick-action-btn primary" onClick={() => alert('Add Feedback Modal')}>
                    + Add Feedback
                  </button>
                  <button className="quick-action-btn" onClick={() => alert('Upload CSV')}>
                    Upload CSV
                  </button>
                  <button className="quick-action-btn" onClick={() => handleWorkspaceChange(workspace)}>
                    Reload Data
                  </button>
                  <button className="quick-action-btn" onClick={() => setActiveSidebarTab('Ask LOOP')}>
                    Ask LOOP
                  </button>
                </div>

                {/* Top KPI Cards Grid */}
                <div className="dash-kpi-grid">
                  <div className="kpi-card">
                    <span className="kpi-label">Total Feedback</span>
                    <div className="kpi-value-container">
                      {dashboardState === 'loading' ? (
                        <div className="skeleton-box skeleton-shimmer" style={{ width: '80px', height: '28px' }} />
                      ) : dashboardState === 'empty' ? (
                        <span className="kpi-value">0</span>
                      ) : (
                        <>
                          <span className="kpi-value">{wsData.kpis.total}</span>
                          <span className="kpi-change up">{wsData.kpis.totalChange}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="kpi-card">
                    <span className="kpi-label">New This Week</span>
                    <div className="kpi-value-container">
                      {dashboardState === 'loading' ? (
                        <div className="skeleton-box skeleton-shimmer" style={{ width: '80px', height: '28px' }} />
                      ) : dashboardState === 'empty' ? (
                        <span className="kpi-value">0</span>
                      ) : (
                        <>
                          <span className="kpi-value">{wsData.kpis.newThisWeek}</span>
                          <span className="kpi-change up">{wsData.kpis.newChange}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="kpi-card">
                    <span className="kpi-label">Positive Sentiment %</span>
                    <div className="kpi-value-container">
                      {dashboardState === 'loading' ? (
                        <div className="skeleton-box skeleton-shimmer" style={{ width: '80px', height: '28px' }} />
                      ) : dashboardState === 'empty' ? (
                        <span className="kpi-value">0%</span>
                      ) : (
                        <>
                          <span className="kpi-value">{wsData.kpis.positive}</span>
                          <span className="kpi-change up">{wsData.kpis.positiveChange}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="kpi-card">
                    <span className="kpi-label">Negative Sentiment %</span>
                    <div className="kpi-value-container">
                      {dashboardState === 'loading' ? (
                        <div className="skeleton-box skeleton-shimmer" style={{ width: '80px', height: '28px' }} />
                      ) : dashboardState === 'empty' ? (
                        <span className="kpi-value">0%</span>
                      ) : (
                        <>
                          <span className="kpi-value">{wsData.kpis.negative}</span>
                          <span className="kpi-change down">{wsData.kpis.negativeChange}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Analytics Grid */}
                <div className="dash-analytics-grid">
                  <div className="dash-chart-card">
                    <span className="chart-card-title">Feedback Volume Over Time</span>
                    <div className="chart-body">
                      {dashboardState === 'loading' ? (
                        <div className="skeleton-box skeleton-shimmer" style={{ height: '100%' }} />
                      ) : dashboardState === 'empty' ? (
                        <div className="empty-state-panel" style={{ height: '100%' }}>
                          <span className="empty-state-title">No volume data</span>
                        </div>
                      ) : (
                        <svg className="chart-svg" viewBox="0 0 500 200">
                          <line x1="0" y1="50" x2="500" y2="50" className="chart-grid-line" />
                          <line x1="0" y1="100" x2="500" y2="100" className="chart-grid-line" />
                          <line x1="0" y1="150" x2="500" y2="150" className="chart-grid-line" />
                          <text x="10" y="195" className="chart-axis-text">Mon</text>
                          <text x="90" y="195" className="chart-axis-text">Tue</text>
                          <text x="170" y="195" className="chart-axis-text">Wed</text>
                          <text x="250" y="195" className="chart-axis-text">Thu</text>
                          <text x="330" y="195" className="chart-axis-text">Fri</text>
                          <text x="410" y="195" className="chart-axis-text">Sat</text>
                          <text x="480" y="195" className="chart-axis-text">Sun</text>
                          <path d="M 10 140 Q 90 90 170 120 T 330 60 T 490 80" className="chart-line-path" />
                          <circle cx="10" cy="140" r="4" className="chart-node" />
                          <circle cx="90" cy="90" r="4" className="chart-node" />
                          <circle cx="170" cy="120" r="4" className="chart-node" />
                          <circle cx="330" cy="60" r="4" className="chart-node" />
                          <circle cx="490" cy="80" r="4" className="chart-node" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="dash-chart-card">
                    <span className="chart-card-title">Sentiment Distribution</span>
                    <div className="donut-body">
                      {dashboardState === 'loading' ? (
                        <div className="skeleton-box skeleton-shimmer" style={{ height: '100%', width: '100%' }} />
                      ) : dashboardState === 'empty' ? (
                        <div className="empty-state-panel" style={{ width: '100%' }}>
                          <span className="empty-state-title">No sentiment recorded</span>
                        </div>
                      ) : (
                        <>
                          <div className="donut-graphic">
                            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                              <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeDasharray="72 28" />
                              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ff2a2a" strokeWidth="3.5" strokeDasharray="18 82" strokeDashoffset="-72" />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'Space Mono', fontSize: '0.85rem', fontWeight: 700 }}>
                              {wsData.kpis.positive}
                            </div>
                          </div>
                          <div className="donut-legend">
                            <div className="legend-item">
                              <span className="legend-color" style={{ background: '#ffffff' }} />
                              <span>Positive ({wsData.kpis.positive})</span>
                            </div>
                            <div className="legend-item">
                              <span className="legend-color" style={{ background: '#ff2a2a' }} />
                              <span>Negative ({wsData.kpis.negative})</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Insights row */}
                <div className="dash-insights-row">
                  <div className="voc-preview-card">
                    <span className="chart-card-title">Voice of Customer Summary</span>
                    {dashboardState === 'loading' ? (
                      <div className="skeleton-box skeleton-shimmer" style={{ height: '100px' }} />
                    ) : (
                      <>
                        <p className="voc-summary">"{wsData.voc}"</p>
                        <button className="voc-btn" onClick={() => setActiveSidebarTab('Reports')}>View Full Report</button>
                      </>
                    )}
                  </div>

                  <div className="ai-panel-card">
                    <span className="chart-card-title">LOOP AI Insights Engine</span>
                    <div className="ai-panel-grid">
                      <div className="ai-widget-item">
                        <span className="ai-widget-lbl">Latest AI Summary</span>
                        <span className="ai-widget-val">{wsData.ai.summary}</span>
                      </div>
                      <div className="ai-widget-item">
                        <span className="ai-widget-lbl">Top Recommendation</span>
                        <span className="ai-widget-val highlight">{wsData.ai.rec}</span>
                      </div>
                      <div className="ai-widget-item">
                        <span className="ai-widget-lbl">Most Requested Feature</span>
                        <span className="ai-widget-val">{wsData.ai.req}</span>
                      </div>
                      <div className="ai-widget-item">
                        <span className="ai-widget-lbl">Biggest Customer Pain Point</span>
                        <span className="ai-widget-val">{wsData.ai.pain}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ingestion Table */}
                <div className="dash-table-card">
                  <span className="chart-card-title">Recent Feedback Ingestion</span>
                  <div className="table-wrapper">
                    <table className="feedback-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Channel</th>
                          <th>Theme</th>
                          <th>Sentiment</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wsData.feedback.map((item, idx) => (
                          <tr key={idx}>
                            <td style={{ fontFamily: 'Space Mono', fontWeight: 600 }}>{item.customer}</td>
                            <td><span className="badge-channel">{item.channel}</span></td>
                            <td>{item.theme}</td>
                            <td><span className={`badge-sentiment ${item.sentiment}`}>{item.sentiment}</span></td>
                            <td><span className={`badge-status ${item.status}`}>{item.status}</span></td>
                            <td>{item.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: FEEDBACK INBOX */}
            {activeSidebarTab === 'Feedback Inbox' && (
              <div className="inbox-layout">
                {/* Left Panel: List */}
                <div className="inbox-list">
                  {wsData.feedback.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`inbox-item-card ${selectedFeedbackIndex === idx ? 'active' : ''}`}
                      onClick={() => setSelectedFeedbackIndex(idx)}
                    >
                      <div className="inbox-item-header">
                        <span className="inbox-item-customer">{item.customer}</span>
                        <span className={`badge-sentiment ${item.sentiment}`} style={{ fontSize: '0.6rem' }}>
                          {item.sentiment}
                        </span>
                      </div>
                      <p className="inbox-item-preview">{item.text}</p>
                    </div>
                  ))}
                </div>

                {/* Right Panel: Detail view */}
                <div className="inbox-detail-panel">
                  <div className="inbox-detail-header">
                    <div className="inbox-detail-title-block">
                      <h2 className="dash-welcome-title" style={{ fontSize: '1.2rem' }}>
                        {wsData.feedback[selectedFeedbackIndex]?.customer}
                      </h2>
                      <div className="inbox-detail-meta-row">
                        <span className="badge-channel">{wsData.feedback[selectedFeedbackIndex]?.channel}</span>
                        <span className={`badge-status ${wsData.feedback[selectedFeedbackIndex]?.status}`}>
                          {wsData.feedback[selectedFeedbackIndex]?.status}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                      Ingested {wsData.feedback[selectedFeedbackIndex]?.date}
                    </span>
                  </div>

                  <div className="inbox-detail-body">
                    <p style={{ margin: 0 }}>{wsData.feedback[selectedFeedbackIndex]?.text}</p>
                  </div>

                  {/* AI response draft suggestion box */}
                  <div className="inbox-ai-draft-card">
                    <span className="inbox-ai-draft-hdr">AI Auto-Reply Suggestion Draft</span>
                    <p className="inbox-ai-draft-content">
                      {wsData.feedback[selectedFeedbackIndex]?.sentiment === 'negative'
                        ? `Hello. Thank you for reporting this issue regarding "${wsData.feedback[selectedFeedbackIndex]?.theme}". We have identified the spike in queue processing delays on our integration webhook handlers. A replica node deployment has been initiated to resolve this immediately.`
                        : `Hi! Thank you for the positive logs. We are glad that the bulk keyboard workflows are improving your team speed. The direct integration options for secondary pipelines are set to launch shortly.`}
                    </p>
                    <div className="inbox-ai-action-row">
                      <button className="quick-action-btn primary" onClick={() => alert('Reply Sent')}>
                        Send Reply
                      </button>
                      <button className="quick-action-btn" onClick={() => alert('Draft Copied')}>
                        Copy Draft
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ANALYTICS */}
            {activeSidebarTab === 'Analytics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="dash-welcome-header">
                  <div>
                    <h1 className="dash-welcome-title">analytics telemetry logs</h1>
                    <span className="dash-welcome-sub">detailed database speed indexing metrics</span>
                  </div>
                </div>

                <div className="dash-kpi-grid">
                  <div className="kpi-card">
                    <span className="kpi-label">Average API Latency</span>
                    <div className="kpi-value-container">
                      <span className="kpi-value">8.4s</span>
                      <span className="kpi-change down">-1.2s</span>
                    </div>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-label">Webhook success rate</span>
                    <div className="kpi-value-container">
                      <span className="kpi-value">99.98%</span>
                      <span className="kpi-change up">stable</span>
                    </div>
                  </div>
                  <div className="kpi-card">
                    <span className="kpi-label">active conversion metrics</span>
                    <div className="kpi-value-container">
                      <span className="kpi-value">4.2%</span>
                      <span className="kpi-change up">+0.8%</span>
                    </div>
                  </div>
                </div>

                <div className="dash-chart-card">
                  <span className="chart-card-title">Prompt telemetries conversion tracks</span>
                  <div className="table-wrapper">
                    <table className="feedback-table">
                      <thead>
                        <tr>
                          <th>Prompt query class</th>
                          <th>Ingestion volume</th>
                          <th>success index</th>
                          <th>avg execution times</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Slack events listener webhook</td>
                          <td>12,408</td>
                          <td style={{ color: '#27c93f' }}>99.9%</td>
                          <td style={{ fontFamily: 'Space Mono' }}>242ms</td>
                        </tr>
                        <tr>
                          <td>Stripe subscription event parser</td>
                          <td>8,422</td>
                          <td style={{ color: '#27c93f' }}>100.0%</td>
                          <td style={{ fontFamily: 'Space Mono' }}>180ms</td>
                        </tr>
                        <tr>
                          <td>loop.intel summarizer nodes</td>
                          <td>3,110</td>
                          <td style={{ color: '#ff5f56' }}>98.2%</td>
                          <td style={{ fontFamily: 'Space Mono' }}>8.4s</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: THEMES */}
            {activeSidebarTab === 'Themes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="dash-welcome-header">
                  <div>
                    <h1 className="dash-welcome-title">customer themes log</h1>
                    <span className="dash-welcome-sub">recurring tags sorted by mentions velocity</span>
                  </div>
                </div>

                <div className="dash-quick-actions-bar">
                  <input 
                    type="text" 
                    placeholder="Search recurring customer tags..." 
                    className="dash-search-input"
                    style={{ width: '300px' }}
                  />
                </div>

                <div className="dash-themes-card">
                  <div className="themes-flex">
                    {wsData.themes.map((theme) => (
                      <div key={theme.name} className="theme-pill-item">
                        <div className="theme-pill-info">
                          <span className="theme-pill-title">{theme.name}</span>
                          <span className="theme-pill-count">{theme.count} mentions this week</span>
                        </div>
                        <span className={`theme-pill-trend ${theme.dir}`}>
                          {theme.trend}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ASK LOOP (AI CHAT) */}
            {activeSidebarTab === 'Ask LOOP' && (
              <div className="chat-layout">
                {chatMessages.length <= 1 ? (
                  /* Central Welcome Screen Empty State */
                  <div className="chat-welcome-container">
                    <div className="chat-welcome-icon-box">
                      <div className="chat-welcome-icon-inner">l</div>
                    </div>
                    <h3 className="chat-welcome-title">Good to See You!</h3>
                    <h2 className="chat-welcome-heading">How Can I be of Assistance?</h2>
                    <p className="chat-welcome-subtitle">I'm available 24/7 for you, ask me anything.</p>

                    <div className="chat-prompt-wrapper">
                      {/* Extensions / Pro panel */}
                      <div className="chat-extension-bar">
                        <span className="chat-extension-pro">⚡ Unlock more features with the Pro plan.</span>
                        <span className="chat-extension-active">
                          <span className="chat-pulse-dot" /> Active extensions
                        </span>
                      </div>

                      {/* Input Capsule */}
                      <div className="chat-input-capsule">
                        <button className="chat-capsule-plus-btn" onClick={() => alert('Add attachments')}>+</button>
                        <input 
                          type="text" 
                          placeholder="Ask anything..." 
                          className="chat-capsule-field"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                          disabled={isSendingChat}
                        />
                        <span className="chat-capsule-wave" onClick={() => handleSendChat('Analyze recent latency logs')}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v20M17 5v14M22 9v6M7 5v14M2 9v6" />
                          </svg>
                        </span>
                      </div>

                      {/* Quick Suggestions Pills */}
                      <div className="chat-suggestions-row">
                        <div className="chat-suggestion-pill" onClick={() => handleSendChat('Any advice for me?')}>
                          👤 Any advice for me?
                        </div>
                        <div className="chat-suggestion-pill" onClick={() => handleSendChat('Analyze checkout postal validation errors')}>
                          💳 Dispute validations
                        </div>
                        <div className="chat-suggestion-pill" onClick={() => handleSendChat('Review webhook database latency logs')}>
                          ⚡ Index telemetries
                        </div>
                        <div className="chat-suggestion-pill" onClick={() => handleSendChat('Summarize loop executive summary')}>
                          📝 Summarize briefing
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Active message thread */
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 10px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '15px' }}>
                      <div>
                        <h2 className="dash-welcome-title" style={{ fontSize: '1rem', margin: 0 }}>ask loop intelligence agent</h2>
                        <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.35)' }}>active thread using deepseek-v4</span>
                      </div>
                      <button 
                        className="quick-action-btn" 
                        style={{ fontSize: '0.68rem', padding: '6px 12px' }}
                        onClick={() => setChatMessages([{ sender: 'ai', text: 'hello. i am the loop customer feedback intelligence agent. ask me anything about your product logs, feedback trends, or user complaints.' }])}
                      >
                        Reset Chat
                      </button>
                    </div>

                    <div className="chat-thread-container">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`chat-bubble ${msg.sender}`}>
                          <span className={`chat-avatar-lbl ${msg.sender}`}>
                            {msg.sender === 'user' ? 'developer query' : 'loop intelligence agent'}
                          </span>
                          {msg.text.includes("--- Thinking Process ---") ? (
                            (() => {
                              const parts = msg.text.split("--- Response ---");
                              const thinking = parts[0].replace("--- Thinking Process ---", "").trim();
                              const responseText = parts[1]?.trim() || "";
                              return (
                                <div>
                                  <details open style={{ background: 'rgba(255, 42, 42, 0.03)', border: '1px solid rgba(255, 42, 42, 0.1)', padding: '10px 14px', borderRadius: '8px', marginBottom: '12px', fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                                    <summary style={{ cursor: 'pointer', outline: 'none', fontWeight: 600, fontFamily: 'Space Mono', color: '#ff2a2a' }}>thinking process</summary>
                                    <p style={{ marginTop: '8px', marginBottom: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{thinking}</p>
                                  </details>
                                  <p style={{ margin: 0 }}>{responseText}</p>
                                </div>
                              );
                            })()
                          ) : (
                            <p style={{ margin: 0 }}>{msg.text}</p>
                          )}
                        </div>
                      ))}
                      {isSendingChat && (
                        <div className="chat-bubble ai">
                          <span className="chat-avatar-lbl ai">loop intelligence agent</span>
                          <div className="skeleton-box skeleton-shimmer" style={{ width: '120px', height: '14px' }} />
                        </div>
                      )}
                    </div>

                    {/* Anchored Input Bar at bottom */}
                    <div className="chat-thread-input-sticky">
                      <div className="chat-prompt-wrapper">
                        <div className="chat-input-capsule">
                          <button className="chat-capsule-plus-btn" onClick={() => alert('Add attachments')}>+</button>
                          <input 
                            type="text" 
                            placeholder="Ask anything..." 
                            className="chat-capsule-field"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                            disabled={isSendingChat}
                          />
                          <span className="chat-capsule-wave" onClick={() => handleSendChat()}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 2v20M17 5v14M22 9v6M7 5v14M2 9v6" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 6: REPORTS */}
            {activeSidebarTab === 'Reports' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="dash-welcome-header">
                  <div>
                    <h1 className="dash-welcome-title">generated customer intelligence reports</h1>
                    <span className="dash-welcome-sub">download executive Voice of Customer briefings</span>
                  </div>
                  <button className="quick-action-btn primary" onClick={() => alert('Generating new brief...')}>
                    Generate Report
                  </button>
                </div>

                <div className="reports-grid">
                  <div className="report-card">
                    <div className="report-hdr">
                      <span className="report-title">July Executive Summary</span>
                      <span className="report-date">Jul 7, 2026</span>
                    </div>
                    <p className="report-summary">
                      Analyzed 12,840 customer feedback inputs across Slack, Stripe checkout, and Intercom logs. Identifies latency peaks and suggests index replication strategies.
                    </p>
                    <button className="voc-btn" style={{ marginTop: 'auto' }}>Download PDF</button>
                  </div>

                  <div className="report-card">
                    <div className="report-hdr">
                      <span className="report-title">Q2 Integration Audit</span>
                      <span className="report-date">Jun 30, 2026</span>
                    </div>
                    <p className="report-summary">
                      Deep-dive review of checkout conversion metrics, payment element failures, and disputes timeline tracking structures.
                    </p>
                    <button className="voc-btn" style={{ marginTop: 'auto' }}>Download PDF</button>
                  </div>

                  <div className="report-card">
                    <div className="report-hdr">
                      <span className="report-title">Infrastructure Latency Brief</span>
                      <span className="report-date">Jun 15, 2026</span>
                    </div>
                    <p className="report-summary">
                      Examines database socket timeout spikes and webhook ingestion logs across US-East and EU-West clusters.
                    </p>
                    <button className="voc-btn" style={{ marginTop: 'auto' }}>Download PDF</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: MEMBERS */}
            {activeSidebarTab === 'Members' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="dash-welcome-header">
                  <div>
                    <h1 className="dash-welcome-title">workspace team access</h1>
                    <span className="dash-welcome-sub">manage reviewers and administrators credentials</span>
                  </div>
                  <button className="quick-action-btn primary" onClick={() => alert('Invite member modal')}>
                    Invite Member
                  </button>
                </div>

                <div className="members-card">
                  <div className="table-wrapper">
                    <table className="feedback-table">
                      <thead>
                        <tr>
                          <th>Member Name</th>
                          <th>Role</th>
                          <th>Email Address</th>
                          <th>Last active</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: 600 }}>Anastasiia S.</td>
                          <td><span className="badge-channel">Owner</span></td>
                          <td>anastasiia@loop.intel</td>
                          <td>Active now</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 600 }}>Ageeva PM</td>
                          <td><span className="badge-channel">Admin</span></td>
                          <td>ageeva@loop.intel</td>
                          <td>Jul 6, 2026</td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: 600 }}>guest reviewer</td>
                          <td><span className="badge-channel" style={{ opacity: 0.6 }}>Guest Reviewer</span></td>
                          <td>guest@loop.intel</td>
                          <td>Active now</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: SETTINGS */}
            {activeSidebarTab === 'Settings' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div className="dash-welcome-header">
                  <div>
                    <h1 className="dash-welcome-title">console workspace settings</h1>
                    <span className="dash-welcome-sub">configure data streams and webhooks credentials</span>
                  </div>
                </div>

                <div className="settings-layout">
                  <div className="settings-nav">
                    <div className="settings-nav-item active">General Settings</div>
                    <div className="settings-nav-item" onClick={() => alert('API keys selected')}>API Keys</div>
                    <div className="settings-nav-item" onClick={() => alert('Webhook selected')}>Webhooks</div>
                    <div className="settings-nav-item" onClick={() => alert('Integrations selected')}>Integrations</div>
                  </div>

                  <div className="settings-panel">
                    <div>
                      <h3 className="settings-section-title">General Configurations</h3>
                      <div className="auth-form" style={{ maxWidth: '400px', marginTop: '15px' }}>
                        <div className="auth-input-group">
                          <label className="auth-label">Workspace Identifier</label>
                          <input type="text" className="auth-input" value={workspace} readOnly />
                        </div>
                        <div className="auth-input-group">
                          <label className="auth-label">Default Intake Alert Threshold</label>
                          <input type="text" className="auth-input" defaultValue="15 minutes" />
                        </div>
                        <button className="quick-action-btn primary" style={{ alignSelf: 'flex-start', marginTop: '10px' }} onClick={() => alert('Settings Saved!')}>
                          Save Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <div className="auth-container">
        {/* Glow Effects */}
        <div className="auth-glow-left" />
        <div className="auth-glow-right" />

        {/* Minimalist Nav */}
        <nav className="auth-nav">
          <div 
            className="nav-brand" 
            onClick={() => setView('landing')} 
            style={{ cursor: 'pointer' }}
          >
            <span>loop</span>
            <span className="nav-brand-dot">.</span>
          </div>
          <a 
            href="#landing" 
            className="auth-back-link" 
            onClick={(e) => { e.preventDefault(); setView('landing'); }}
          >
            back to site ←
          </a>
        </nav>

        {/* Auth Glassmorphic Card */}
        <div className="auth-card-glass">
          <div className="auth-header">
            <span className="auth-brand-logo">
              loop<span className="auth-logo-dot">.</span>
            </span>
            <h2 className="auth-title">
              {authMode === 'login' ? 'welcome back' : 'create account'}
            </h2>
            <p className="auth-subtext">
              {authMode === 'login' ? 'continue to loop intelligence console' : 'start your 14-day premium console trial'}
            </p>
          </div>

          {/* Toggle Switch Tabs */}
          <div className="auth-mode-selector">
            <div 
              className={`auth-mode-btn ${authMode === 'login' ? 'active' : ''}`}
              onClick={() => setAuthMode('login')}
            >
              login
            </div>
            <div 
              className={`auth-mode-btn ${authMode === 'signup' ? 'active' : ''}`}
              onClick={() => setAuthMode('signup')}
            >
              sign up
            </div>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {authMode === 'signup' && (
              <div className="auth-input-group">
                <label className="auth-label">name</label>
                <input 
                  type="text" 
                  placeholder="your name" 
                  className="auth-input" 
                  required 
                />
              </div>
            )}
            <div className="auth-input-group">
              <label className="auth-label">email address</label>
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="auth-input" 
                required 
              />
            </div>
            <div className="auth-input-group">
              <label className="auth-label">password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="auth-input" 
                required 
              />
            </div>

            <button type="submit" className="auth-submit-btn" onClick={() => setView('dashboard')}>
              {authMode === 'login' ? 'login to console' : 'create workspace'}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span className="auth-divider-line" />
            <span className="auth-divider-text">or continue with</span>
            <span className="auth-divider-line" />
          </div>

          {/* Social Row */}
          <div className="auth-social-row">
            <button className="auth-social-btn" onClick={() => setView('dashboard')}>
              <svg className="auth-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
              guest login
            </button>
            <button className="auth-social-btn" onClick={() => {}}>
              <svg className="auth-social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.36-2.85-6.36-6.36 0-3.51 2.85-6.36 6.36-6.36 1.63 0 3.117.618 4.256 1.63L21.2 4.4C19.06 2.378 16.035 1.143 12.24 1.143 6.25 1.143 1.4 6 1.4 12s4.85 10.857 10.84 10.857c5.96 0 10.663-4.234 10.663-10.857 0-.713-.083-1.393-.245-1.715H12.24z" />
              </svg>
              google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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

        {/* Right side: theme toggle + hint + CTA */}
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

      <div className="app-container" ref={containerRef}>
        {/* 0. MINIMALIST PRELOADER */}
        {showPreloader && (
          <div className="preloader-container">
            <div className="preloader-panel-left" />
            <div className="preloader-panel-right" />
            <div className="preloader-seam" />
            <div className="preloader-counter-wrapper">
              <span className="preloader-counter-num">00</span>
              <span className="preloader-counter-unit">%</span>
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
            <ASCIIText text="loop" enableWaves={true} asciiFontSize={8} />
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
    </>
  );
}

export default App;
