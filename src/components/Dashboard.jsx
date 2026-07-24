import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  BarChart3, 
  Tag, 
  MessageSquare, 
  FileText, 
  Users, 
  User,
  Settings, 
  ChevronDown, 
  Bell, 
  Plus, 
  Sun,
  Upload, 
  RefreshCw, 
  Search, 
  Send, 
  Download, 
  UserPlus, 
  LogOut, 
  Sparkles, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Brain,
  Copy,
  Check,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Key,
  Zap
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext.jsx';
import './Dashboard.css';

// ─── Model Settings Modal ───────────────────────────────────────────────────
function ModelModal({ onClose }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('loop_nvidia_api_key') || '');
  const [model, setModel] = useState(() => localStorage.getItem('loop_model') || 'deepseek-ai/deepseek-v4-flash');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('loop_nvidia_api_key', apiKey);
    localStorage.setItem('loop_model', model);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const modelOptions = [
    { id: 'deepseek-ai/deepseek-v4-flash', label: 'DeepSeek V4 Flash' },
    { id: 'deepseek-ai/deepseek-r1', label: 'DeepSeek R1' },
    { id: 'meta/llama-3.1-70b-instruct', label: 'Meta Llama 3.1 70B' },
    { id: 'mistralai/mistral-large-2-instruct', label: 'Mistral Large 2' },
    { id: 'nvidia/nemotron-4-340b-instruct', label: 'Nvidia Nemotron 4 340B' },
  ];

  return (
    <div className="model-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="model-modal">
        <div className="model-modal-header">
          <div className="model-modal-title-row">
            <Key size={16} color="#ff3c3c" />
            <h2 className="model-modal-title">AI Model Configuration</h2>
          </div>
          <button className="model-modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        <p className="model-modal-desc">
          Configure your NVIDIA NIM API key and select a model to power the LOOP AI assistant.
          Your key is stored locally in your browser and never sent to our servers.
        </p>

        <div className="model-modal-body">
          <div className="db-form-group">
            <label className="db-form-label">NVIDIA NIM API Key</label>
            <input
              type="password"
              className="db-input"
              placeholder="nvapi-••••••••••••••••••••••••••"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              autoComplete="off"
            />
            <span className="db-form-hint">
              Get your key at{' '}
              <a href="https://build.nvidia.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ff3c3c' }}>
                build.nvidia.com
              </a>
            </span>
          </div>

          <div className="db-form-group">
            <label className="db-form-label">AI Model</label>
            <select
              className="db-input"
              value={model}
              onChange={e => setModel(e.target.value)}
            >
              {modelOptions.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="model-modal-status">
            <div className={`model-status-dot ${apiKey ? 'active' : 'inactive'}`} />
            <span>{apiKey ? 'API key configured — AI is ready' : 'No API key — AI will use fallback responses'}</span>
          </div>
        </div>

        <div className="model-modal-footer">
          <button className="db-btn db-btn-primary" onClick={handleSave} disabled={saved}>
            {saved ? <><Check size={14} /> Saved!</> : <><Zap size={14} /> Save & Start Bot</>}
          </button>
          <button className="db-btn db-btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State Component ────────────────────────────────────────────────────
function EmptyState({ icon: Icon, title, desc, action, onAction }) {
  return (
    <div className="db-empty-state-box">
      <div className="db-empty-state-icon">
        <Icon size={28} />
      </div>
      <h3 className="db-empty-state-title">{title}</h3>
      <p className="db-empty-state-desc">{desc}</p>
      {action && (
        <button className="db-btn db-btn-primary" style={{ marginTop: '16px' }} onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard({ setView, signOut }) {
  const { user } = useAuth();
  const [dashboardTheme, setDashboardTheme] = useState(() => {
    return localStorage.getItem('loop_dashboard_theme') || 'dark';
  });
  const [activeSettingsTab, setActiveSettingsTab] = useState('General Settings');
  const [dashboardState, setDashboardState] = useState('data');
  const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'hello. i am the LOOP AI assistant. add your NVIDIA API key in the model settings to get started. click the ⚡ button in the top bar.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState('');

  // Derive user display info from Supabase session
  const userEmail = user?.email || 'user@loop.intel';
  const userFullName = user?.user_metadata?.full_name || userEmail.split('@')[0];
  const userInitials = userFullName
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const themeOptions = [
    { id: 'dark', name: 'Obsidian Dark', desc: 'Default stealth dark mode with crimson accents', bg: '#000000', surface: '#0a0a0c', accent: '#ff3c3c' },
    { id: 'light', name: 'Daylight Light', desc: 'Clean high-contrast slate light mode', bg: '#f8fafc', surface: '#ffffff', accent: '#dc2626' },
    { id: 'midnight', name: 'Midnight Slate', desc: 'Deep navy blue & sapphire developer theme', bg: '#0b0f19', surface: '#111827', accent: '#3b82f6' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', desc: 'Neon pink & violet synthwave console', bg: '#090314', surface: '#120726', accent: '#ff0055' },
    { id: 'emerald', name: 'Emerald Matrix', desc: 'Hacker green terminal obsidian theme', bg: '#02120a', surface: '#052112', accent: '#10b981' }
  ];

  const handleThemeChange = (newThemeKey) => {
    setDashboardTheme(newThemeKey);
    localStorage.setItem('loop_dashboard_theme', newThemeKey);
  };

  const sidebarTabs = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Feedback Inbox', icon: Inbox },
    { name: 'Analytics', icon: BarChart3 },
    { name: 'Themes', icon: Tag },
    { name: 'Ask LOOP', icon: MessageSquare },
    { name: 'Reports', icon: FileText },
    { name: 'Profile', icon: User },
    { name: 'Settings', icon: Settings }
  ];

  // ── Chat handler with real NVIDIA NIM API ──────────────────────────────────
  const handleSendChat = async (directMsgInput = null) => {
    const targetMsg = directMsgInput || chatInput;
    if (!targetMsg.trim() || isSendingChat) return;

    const savedKey = localStorage.getItem('loop_nvidia_api_key') || import.meta.env.VITE_NVIDIA_API_KEY;
    const savedModel = localStorage.getItem('loop_model') || 'deepseek-ai/deepseek-v4-flash';

    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: targetMsg }]);
    setIsSendingChat(true);
    setChatMessages(prev => [...prev, { sender: 'ai', text: 'Thinking...' }]);

    if (!savedKey) {
      setTimeout(() => {
        setChatMessages(prev => {
          const u = [...prev];
          u[u.length - 1] = { sender: 'ai', text: 'No API key configured. Please click the ⚡ Model Settings button and add your NVIDIA NIM API key to enable AI responses.' };
          return u;
        });
        setIsSendingChat(false);
      }, 600);
      return;
    }

    try {
      const response = await fetch("/api/nvidia/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedKey}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          model: savedModel,
          messages: [{ role: "user", content: `You are LOOP AI, an executive customer feedback assistant. Explain briefly (2-3 sentences max). Question: ${targetMsg}` }],
          temperature: 1, top_p: 0.95, max_tokens: 1024,
          stream: false
        })
      });

      const rawText = await response.text();
      let aiText = '';
      try {
        const data = JSON.parse(rawText);
        const reasoning = data.choices?.[0]?.message?.reasoning || '';
        const content = data.choices?.[0]?.message?.content || '';
        aiText = reasoning
          ? `--- Thinking Process ---\n${reasoning}\n--- Response ---\n${content}`
          : content;
      } catch (e) { aiText = rawText; }

      if (!aiText) throw new Error('No response content from model');
      setChatMessages(prev => {
        const u = [...prev];
        u[u.length - 1] = { sender: 'ai', text: aiText };
        return u;
      });
    } catch (error) {
      setChatMessages(prev => {
        const u = [...prev];
        u[u.length - 1] = { sender: 'ai', text: 'Unable to reach the AI model. Please verify your API key in Model Settings and try again.' };
        return u;
      });
    } finally {
      setIsSendingChat(false);
    }
  };

  // ── Handle sign out ────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    await signOut();
    setView('landing');
  };

  // ─── Today's date display ──────────────────────────────────────────────────
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="db-root" data-dashboard-theme={dashboardTheme}>

      {/* ═══════════════ MODEL MODAL ═══════════════ */}
      {showModelModal && <ModelModal onClose={() => setShowModelModal(false)} />}

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className={`db-sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>

        {/* Floating expand tab — visible only when collapsed */}
        <button
          className="db-sidebar-expand-tab"
          onClick={() => setSidebarCollapsed(false)}
          title="Expand sidebar"
        >
          <ChevronRight size={10} />
        </button>

        {/* Brand Row */}
        <div className="db-sidebar-brand">
          {!sidebarCollapsed && (
            <span className="db-sidebar-logo">LOOP<span style={{color: '#ff3c3c'}}>.</span></span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '6px',
              transition: 'color 200ms ease, background 200ms ease',
            }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onMouseEnter={e => { e.currentTarget.style.color='#fff'; e.currentTarget.style.background='rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color='rgba(255,255,255,0.5)'; e.currentTarget.style.background='none'; }}
          >
            {sidebarCollapsed
              ? <ChevronRight size={16} />
              : <ChevronLeft size={16} />
            }
          </button>
        </div>

        {/* Workspace Card */}
        <div className="db-sidebar-ws-card">
          <div className="db-sidebar-ws-icon"><LayoutDashboard size={14} color="#ff3c3c" /></div>
          <div className="db-sidebar-ws-info">
            <div className="db-sidebar-ws-name">{userFullName}</div>
            <div className="db-sidebar-ws-sub">Personal Workspace</div>
          </div>
          <ChevronDown size={14} className="db-sidebar-ws-chevron" />
        </div>

        {/* Nav */}
        <nav className="db-nav">
          {sidebarTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeSidebarTab === tab.name;
            return (
              <button
                key={tab.name}
                className={`db-nav-item${isActive ? ' active' : ''}`}
                onClick={() => setActiveSidebarTab(tab.name)}
                data-label={tab.name}
                title={sidebarCollapsed ? tab.name : undefined}
              >
                <Icon className="db-nav-icon" size={16} />
                <span className="db-nav-label">{tab.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="db-sidebar-section">
          <div className="db-sidebar-section-title">Quick Actions</div>
          <button className="db-sidebar-action"><Plus size={14} /> Add Feedback</button>
          <button className="db-sidebar-action"><Upload size={14} /> Upload CSV</button>
          <button className="db-sidebar-action" style={{ color: '#ff3c3c' }}><Sparkles size={14} /> Ask LOOP</button>
        </div>

        {/* Sign Out */}
        <div className="db-sidebar-signout">
          <button className="db-sidebar-action" style={{ color: 'rgba(255,255,255,0.4)' }} onClick={handleSignOut}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ═══════════════ MOBILE OVERLAY ═══════════════ */}
      {mobileMenuOpen && (
        <div className="db-mobile-overlay">
          <div className="db-mobile-overlay-header">
            <span className="db-sidebar-logo">loop<span>.</span></span>
            <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }} onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="db-mobile-overlay-nav">
            {sidebarTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeSidebarTab === tab.name;
              return (
                <button
                  key={tab.name}
                  className={`db-nav-item${isActive ? ' active' : ''}`}
                  style={{ width: '100%', padding: '12px 14px' }}
                  onClick={() => { setActiveSidebarTab(tab.name); setMobileMenuOpen(false); }}
                >
                  <Icon className="db-nav-icon" size={16} />
                  <span className="db-nav-label">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="db-main">

        {/* Top Bar */}
        <header className="db-topbar">
          <div className="db-topbar-left">
            <button className="db-mobile-menu-btn" style={{ display: 'none' }} onClick={() => setMobileMenuOpen(true)}>
              <Menu size={18} />
            </button>
          </div>
          <div className="db-topbar-center">
            <div className="db-search-bar">
              <Search size={14} className="db-search-icon" />
              <input type="text" placeholder="Search feedback, themes, reports..." />
              <div className="db-search-kbd">⌘ K</div>
            </div>
          </div>
          <div className="db-topbar-right">
            {/* Model Settings button */}
            <button
              className="db-topbar-icon-btn model-settings-btn"
              title="AI Model Settings"
              onClick={() => setShowModelModal(true)}
              style={{ color: localStorage.getItem('loop_nvidia_api_key') ? '#ff3c3c' : 'rgba(255,255,255,0.4)' }}
            >
              <Zap size={16} />
            </button>
            <button
              className="db-topbar-icon-btn"
              title={`Theme: ${dashboardTheme} (click to cycle)`}
              onClick={() => handleThemeChange(dashboardTheme === 'dark' ? 'light' : dashboardTheme === 'light' ? 'midnight' : dashboardTheme === 'midnight' ? 'cyberpunk' : dashboardTheme === 'cyberpunk' ? 'emerald' : 'dark')}
            >
              <Sun size={16} />
            </button>
            <div className="db-topbar-avatar" title={userFullName}>{userInitials}</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="db-content">

          {/* ── Skeleton Loading ── */}
          {dashboardState === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="db-kpi-grid">
                {[1,2,3,4].map(i => (
                  <div key={i} className="db-kpi-card">
                    <div className="db-skeleton" style={{ width: '80px', height: '10px', marginBottom: '12px' }} />
                    <div className="db-skeleton" style={{ width: '120px', height: '28px' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Normal Data Views ── */}
          {dashboardState !== 'loading' && (
            <>

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: DASHBOARD OVERVIEW             ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Dashboard' && (
                <div className="db-overview-layout">
                  
                  {/* Header Row */}
                  <div className="db-overview-header">
                    <div>
                      <h1 className="db-overview-title">Welcome, {userFullName} 👋</h1>
                      <p className="db-overview-subtitle">Your workspace is ready. Start by adding feedback or uploading a CSV.</p>
                    </div>
                    <div className="db-overview-date">
                      {today} <div className="db-overview-date-icon"><LayoutDashboard size={14} /></div>
                    </div>
                  </div>

                  {/* Model Setup Prompt if no key */}
                  {!localStorage.getItem('loop_nvidia_api_key') && (
                    <div className="db-setup-banner" onClick={() => setShowModelModal(true)}>
                      <Zap size={16} color="#ff3c3c" />
                      <span>Set up your NVIDIA API key to activate the LOOP AI assistant</span>
                      <span className="db-setup-banner-cta">Configure →</span>
                    </div>
                  )}

                  {/* Actions Ribbon */}
                  <div className="db-actions-ribbon">
                    <button className="db-btn db-btn-primary"><Plus size={14} /> Add Feedback</button>
                    <button className="db-btn db-btn-outline"><Upload size={14} /> Upload CSV</button>
                    <button className="db-btn db-btn-outline" style={{color: '#ff3c3c', borderColor: 'rgba(255,60,60,0.3)'}}
                      onClick={() => setActiveSidebarTab('Ask LOOP')}>
                      <Sparkles size={14} /> Ask LOOP
                    </button>
                    <button className="db-btn db-btn-outline"><FileText size={14} /> Generate Report</button>
                  </div>

                  {/* KPI Grid — all zeros until real data */}
                  <div className="db-kpi-grid">
                    {[
                      { label: 'Total Feedback', value: '0', icon: MessageSquare, iconColor: '#ff3c3c' },
                      { label: 'New This Week', value: '0', icon: BarChart3, iconColor: '#ff3c3c' },
                      { label: 'Negative Sentiment', value: '—', icon: AlertTriangle, iconColor: '#ff3c3c' },
                      { label: 'Positive Sentiment', value: '—', icon: Brain, iconColor: '#10b981' },
                      { label: 'Active Themes', value: '0', icon: Tag, iconColor: '#ff3c3c' },
                      { label: 'Reports Generated', value: '0', icon: FileText, iconColor: '#ffb020' }
                    ].map(kpi => {
                      const Icon = kpi.icon;
                      return (
                        <div key={kpi.label} className="db-kpi-card">
                          <div className="db-kpi-header">
                            <Icon size={14} color={kpi.iconColor} /> {kpi.label}
                          </div>
                          <div className="db-kpi-body">
                            <span className="db-kpi-value">{kpi.value}</span>
                          </div>
                          <div className="db-kpi-footer">no data yet</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Charts Row — Empty States */}
                  <div className="db-charts-grid">
                    {/* Line Chart Empty */}
                    <div className="db-chart-card line-chart">
                      <div className="db-chart-header">
                        <div className="db-chart-title"><BarChart3 size={14} color="#ff3c3c" /> Feedback Volume Over Time</div>
                      </div>
                      <div className="db-chart-body" style={{position: 'relative', height: '180px'}}>
                        <EmptyState
                          icon={BarChart3}
                          title="No feedback data yet"
                          desc="Add your first feedback to see the volume chart."
                        />
                      </div>
                    </div>

                    {/* Donut Chart Empty */}
                    <div className="db-chart-card donut-chart">
                      <div className="db-chart-title">Sentiment Distribution</div>
                      <EmptyState
                        icon={Brain}
                        title="No sentiment data"
                        desc="Sentiment analysis will appear once feedback is ingested."
                      />
                    </div>

                    {/* Channel Chart Empty */}
                    <div className="db-chart-card donut-chart">
                      <div className="db-chart-title">Feedback by Channel</div>
                      <EmptyState
                        icon={Tag}
                        title="No channel data"
                        desc="Connect a channel to see distribution."
                      />
                    </div>
                  </div>

                  {/* Data Grid Row — all empty */}
                  <div className="db-overview-data-row">
                    
                    {/* Top Themes */}
                    <div className="db-data-card">
                      <div className="db-data-header">
                        <div className="db-data-title">Top Themes</div>
                      </div>
                      <EmptyState
                        icon={Tag}
                        title="No themes detected"
                        desc="Themes will be automatically detected as feedback is added."
                      />
                    </div>

                    {/* Recent Feedback */}
                    <div className="db-data-card">
                      <div className="db-data-header">
                        <div className="db-data-title">Recent Feedback</div>
                      </div>
                      <EmptyState
                        icon={Inbox}
                        title="No feedback yet"
                        desc="Add feedback via the button above or upload a CSV file."
                        action="+ Add Feedback"
                        onAction={() => {}}
                      />
                    </div>

                    {/* AI Insight — disabled until data */}
                    <div className="db-data-card db-insight-card">
                      <div className="db-insight-header">
                        <Sparkles size={14} color="#ff3c3c"/> AI Insight
                      </div>
                      <div className="db-insight-body" style={{ opacity: 0.5 }}>
                        AI insights will appear here once feedback data is ingested and analyzed.
                      </div>
                      <button className="db-btn-insight" onClick={() => setActiveSidebarTab('Ask LOOP')}>
                        Ask LOOP AI
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: FEEDBACK INBOX                 ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Feedback Inbox' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="db-page-header">
                    <div>
                      <h1 className="db-page-title">Feedback Inbox</h1>
                      <p className="db-page-subtitle">triaging incoming signals stream</p>
                    </div>
                  </div>

                  <div className="db-inbox-layout">
                    <div className="db-inbox-list">
                      <div className="db-inbox-list-header">Streams (0)</div>
                      <EmptyState
                        icon={Inbox}
                        title="Empty inbox"
                        desc="No feedback signals received yet. Add feedback or connect a data source."
                        action="+ Add Feedback"
                        onAction={() => {}}
                      />
                    </div>
                    <div className="db-inbox-detail">
                      <div className="db-inbox-detail-header">
                        <div className="db-inbox-detail-meta" style={{ color: 'var(--db-text-muted)', fontSize: '0.82rem' }}>
                          Select a feedback item from the inbox to view details.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: ANALYTICS                      ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Analytics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h1 className="db-page-title">Analytics</h1>
                    <p className="db-page-subtitle">Feedback trends and performance metrics</p>
                  </div>
                  <EmptyState
                    icon={BarChart3}
                    title="No analytics data yet"
                    desc="Analytics will populate automatically as feedback data is ingested into your workspace."
                  />
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: THEMES                         ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Themes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h1 className="db-page-title">Customer Themes Log</h1>
                    <p className="db-page-subtitle">recurring tags sorted by mention velocity</p>
                  </div>

                  <div className="db-search-wrap">
                    <Search className="db-search-icon" />
                    <input
                      type="text"
                      className="db-input"
                      placeholder="Search recurring customer tags..."
                      value={themeSearchQuery}
                      onChange={e => setThemeSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="db-themes-grid">
                    <EmptyState
                      icon={Tag}
                      title="No themes detected yet"
                      desc="Themes are automatically detected from your feedback. Add feedback first."
                    />
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: ASK LOOP (CHAT)                ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Ask LOOP' && (
                <div className="db-chat-container">
                  <div className="db-chat-header">
                    <div className="db-chat-header-info">
                      <div className="db-chat-header-icon"><Sparkles size={16} /></div>
                      <div>
                        <h2 className="db-chat-header-title">LOOP AI Assistant</h2>
                        <span className="db-chat-header-subtitle">
                          {localStorage.getItem('loop_nvidia_api_key')
                            ? `Active: ${localStorage.getItem('loop_model') || 'deepseek-ai/deepseek-v4-flash'}`
                            : 'No API key — configure in Model Settings'}
                        </span>
                      </div>
                    </div>
                    <div className="db-chat-header-actions">
                      <button
                        className="db-btn db-btn-primary"
                        style={{ fontSize: '0.65rem', padding: '4px 10px', height: '28px' }}
                        onClick={() => setShowModelModal(true)}
                        title="Configure AI model"
                      >
                        <Zap size={12} /> Model Settings
                      </button>
                      <button className="db-btn db-btn-ghost" onClick={() => setChatMessages([{ sender: 'ai', text: 'hello. i am the LOOP AI assistant. how can i help you today?' }])} title="Clear Chat">
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="db-chat-scroll-area">
                    {chatMessages.length <= 1 && (
                      <div className="db-chat-empty-state">
                        <div className="db-chat-empty-icon">l.</div>
                        <h3 className="db-chat-empty-title">How can I help you?</h3>
                        <p className="db-chat-empty-desc">Ask about your workspace data, trends, or let me summarize feedback.</p>
                        <div className="db-chat-suggestion-cards">
                          {['Analyze latest feedback', 'Summarize negative themes', 'How does LOOP work?'].map(s => (
                            <div key={s} className="db-chat-suggestion-card" onClick={() => handleSendChat(s)}>
                              {s} <ArrowUpRight size={14} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="db-chat-messages-wrapper">
                      {chatMessages.map((msg, idx) => (
                        <div key={idx} className={`db-message-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}>
                          {msg.sender === 'ai' && (
                            <div className="db-message-avatar ai-avatar">
                              <Sparkles size={12} />
                            </div>
                          )}
                          <div className={`db-message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                            {msg.text.includes('--- Thinking Process ---') ? (() => {
                              const parts = msg.text.split('--- Response ---');
                              const thinking = parts[0].replace('--- Thinking Process ---', '').trim();
                              const resp = parts[1]?.trim() || '';
                              return (
                                <div>
                                  <details className="db-message-thinking">
                                    <summary>View thinking process</summary>
                                    <div className="db-message-thinking-content">{thinking}</div>
                                  </details>
                                  <div className="db-message-text">{resp}</div>
                                </div>
                              );
                            })() : (
                              <div className="db-message-text">{msg.text}</div>
                            )}
                          </div>
                          {msg.sender === 'user' && (
                            <div className="db-message-avatar user-avatar">
                              <User size={12} />
                            </div>
                          )}
                        </div>
                      ))}
                      {isSendingChat && (
                        <div className="db-message-row ai-row">
                          <div className="db-message-avatar ai-avatar"><Sparkles size={12} /></div>
                          <div className="db-message-bubble ai-bubble typing-indicator">
                            <span></span><span></span><span></span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="db-chat-input-wrapper">
                    <div className="db-chat-input-box">
                      <input
                        type="text"
                        className="db-chat-input"
                        placeholder="Ask LOOP AI anything..."
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                        disabled={isSendingChat}
                      />
                      <button className="db-chat-submit" onClick={() => handleSendChat()} disabled={isSendingChat || !chatInput.trim()}>
                        <Send size={16} />
                      </button>
                    </div>
                    <div className="db-chat-input-footer">
                      LOOP AI can make mistakes. Consider verifying important metrics.
                    </div>
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: REPORTS                        ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Reports' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="db-page-header">
                    <div>
                      <h1 className="db-page-title">Generated Reports</h1>
                      <p className="db-page-subtitle">download executive briefing summaries</p>
                    </div>
                    <button className="db-btn db-btn-primary">
                      <Plus size={13} /><span>Generate Report</span>
                    </button>
                  </div>
                  <EmptyState
                    icon={FileText}
                    title="No reports yet"
                    desc="Generate your first report once feedback data has been added."
                    action="Generate Report"
                    onAction={() => {}}
                  />
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: PROFILE                        ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Profile' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="db-page-header">
                    <div>
                      <h1 className="db-page-title">User Profile</h1>
                      <p className="db-page-subtitle">manage your account settings and preferences</p>
                    </div>
                  </div>

                  <div className="db-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                      <div className="db-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>{userInitials}</div>
                      <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--db-text-primary)' }}>{userFullName}</h2>
                        <p style={{ color: 'var(--db-text-muted)', fontFamily: 'var(--db-font-mono)', fontSize: '0.8rem', marginTop: '4px' }}>{userEmail}</p>
                        <div style={{ marginTop: '12px' }}>
                          <span className="db-badge db-badge-channel">Member</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div className="db-form-group">
                        <label className="db-form-label">Full Name</label>
                        <input type="text" className="db-input" defaultValue={userFullName} />
                      </div>
                      <div className="db-form-group">
                        <label className="db-form-label">Email Address</label>
                        <input type="email" className="db-input" defaultValue={userEmail} disabled style={{ opacity: 0.6 }} />
                        <span className="db-form-hint">Email is managed via Supabase Auth.</span>
                      </div>
                      <div className="db-form-group">
                        <label className="db-form-label">Timezone</label>
                        <select className="db-input">
                          <option>UTC+0 (London, GMT)</option>
                          <option>UTC-5 (EST)</option>
                          <option>UTC-8 (PST)</option>
                          <option>UTC+5:30 (IST)</option>
                        </select>
                      </div>
                    </div>
                    <button className="db-btn db-btn-primary" style={{ marginTop: '20px' }}>Save Changes</button>
                  </div>

                  <div className="db-card" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--db-text-primary)', marginBottom: '16px' }}>Danger Zone</h3>
                    <button className="db-btn db-btn-outline" style={{ color: '#ff3c3c', borderColor: 'rgba(255,60,60,0.3)' }} onClick={handleSignOut}>
                      <LogOut size={14} /> Sign Out of LOOP
                    </button>
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: SETTINGS                       ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Settings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h1 className="db-page-title">Workspace Settings</h1>
                    <p className="db-page-subtitle">Manage API keys, themes, and workspace details</p>
                  </div>

                  <div className="db-settings-layout">
                    <nav className="db-settings-nav">
                      {['General Settings', 'Theme & Appearance', 'AI Model'].map((item) => (
                        <div 
                          key={item} 
                          className={`db-settings-nav-item${activeSettingsTab === item ? ' active' : ''}`}
                          onClick={() => setActiveSettingsTab(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </nav>

                    {activeSettingsTab === 'General Settings' && (
                      <div className="db-settings-panel">
                        <div className="db-settings-section-title">General Workspace Configurations</div>

                        <div className="db-form-group">
                          <label className="db-form-label">Account Email</label>
                          <div className="db-form-static" style={{ fontFamily: 'var(--db-font-mono)', fontSize: '0.78rem' }}>{userEmail}</div>
                          <span className="db-form-hint">Your email is managed via Supabase Auth.</span>
                        </div>

                        <div className="db-form-group">
                          <label className="db-form-label">Display Name</label>
                          <input type="text" className="db-input" defaultValue={userFullName} />
                        </div>

                        <div className="db-form-group">
                          <label className="db-form-label">Active Theme</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="db-form-static" style={{ flex: 1, fontFamily: 'var(--db-font-mono)', textTransform: 'capitalize' }}>
                              {themeOptions.find(t => t.id === dashboardTheme)?.name || dashboardTheme}
                            </div>
                            <button className="db-btn db-btn-secondary" onClick={() => setActiveSettingsTab('Theme & Appearance')}>
                              Customize →
                            </button>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                          <button className="db-btn db-btn-primary">Save Changes</button>
                          <button className="db-btn db-btn-secondary">Reset to Defaults</button>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === 'Theme & Appearance' && (
                      <div className="db-settings-panel">
                        <div className="db-settings-section-title">Theme & Appearance Customization</div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--db-text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
                          Select your preferred color scheme. Your chosen theme persists across sessions via local storage.
                        </p>

                        <div className="db-theme-picker-grid">
                          {themeOptions.map(t => (
                            <div 
                              key={t.id}
                              className={`db-theme-card-option${dashboardTheme === t.id ? ' active' : ''}`}
                              onClick={() => handleThemeChange(t.id)}
                            >
                              {dashboardTheme === t.id && (
                                <span className="db-theme-badge-active">Active</span>
                              )}
                              <div className="db-theme-swatch-bar">
                                <div className="db-theme-swatch-block" style={{ background: t.bg }} title="Background" />
                                <div className="db-theme-swatch-block" style={{ background: t.surface }} title="Surface" />
                                <div className="db-theme-swatch-block" style={{ background: t.accent }} title="Accent" />
                              </div>
                              <div className="db-theme-option-info">
                                <div className="db-theme-option-name">{t.name}</div>
                                <div className="db-theme-option-desc">{t.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === 'AI Model' && (
                      <div className="db-settings-panel">
                        <div className="db-settings-section-title">AI Model Configuration</div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--db-text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
                          Configure your NVIDIA NIM API key to power the LOOP AI assistant. Your key is stored locally and never sent to our servers.
                        </p>
                        <button className="db-btn db-btn-primary" onClick={() => setShowModelModal(true)}>
                          <Zap size={14} /> Open Model Settings
                        </button>
                        {localStorage.getItem('loop_nvidia_api_key') && (
                          <div className="model-status-line" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#10b981' }}>
                            <div className="model-status-dot active" />
                            API key configured — AI is active
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </main>
    </div>
  );
}
