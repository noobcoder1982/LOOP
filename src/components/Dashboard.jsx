import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard({ setView }) {
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
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState('');
  const [byokMode, setByokMode] = useState(false);

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

  const getWorkspaceData = () => {
    return {
      welcome: 'Good morning, James 👋',
      subtitle: "Here's what's happening with your feedback today.",
      kpis: [
        { label: 'Total Feedback', value: '2,845', trend: '18.6%', dir: 'up', icon: MessageSquare, iconColor: '#ff3c3c' },
        { label: 'New This Week', value: '342', trend: '12.4%', dir: 'up', icon: BarChart3, iconColor: '#ff3c3c' },
        { label: 'Negative Sentiment', value: '18%', trend: '4.3%', dir: 'down', icon: AlertTriangle, iconColor: '#ff3c3c', trendGood: true },
        { label: 'Positive Sentiment', value: '62%', trend: '6.7%', dir: 'up', icon: Brain, iconColor: '#10b981' },
        { label: 'Active Themes', value: '24', trend: '3', dir: 'down', icon: Tag, iconColor: '#ff3c3c', trendGood: true },
        { label: 'Reports Generated', value: '8', trend: '2', dir: 'up', icon: FileText, iconColor: '#ffb020' }
      ],
      feedback: [],
      themes: [],
      ai: {
        summary: 'Awaiting data ingestion to generate summary.',
        rec: 'Connect your first data source.',
        req: 'None',
        pain: 'None'
      },
      voc: 'Connect a data source to begin voice of customer analysis.'
    };
  };

  const wsData = getWorkspaceData();

  const handleWorkspaceChange = (wsName) => {
    setWorkspace(wsName);
    setWorkspaceDropdownOpen(false);
    setDashboardState('loading');
    setTimeout(() => setDashboardState('data'), 1200);
  };

  const handleSendChat = async (directMsgInput = null) => {
    const targetMsg = directMsgInput || chatInput;
    if (!targetMsg.trim() || isSendingChat) return;
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: targetMsg }]);
    setIsSendingChat(true);
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
          messages: [{ role: "user", content: `You are LOOP AI, an executive customer feedback assistant. Explain briefly (2-3 sentences max). Question: ${targetMsg}` }],
          temperature: 1, top_p: 0.95, max_tokens: 4096,
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
          if (done) { finished = true; break; }
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
                aiText += chunkObj.choices[0]?.delta?.content || "";
              } catch (e) {}
            }
          }
        }
      } else {
        const rawText = await response.text();
        try {
          const data = JSON.parse(rawText);
          const reasoning = data.choices[0]?.message?.reasoning || "";
          const content = data.choices[0]?.message?.content || "";
          aiText = reasoning ? `--- Thinking Process ---\n${reasoning}\n--- Response ---\n${content}` : content;
        } catch (e) { aiText = rawText; }
      }

      if (!aiText) throw new Error("No response content from model");
      setChatMessages(prev => { const u = [...prev]; u[u.length - 1] = { sender: 'ai', text: aiText }; return u; });
    } catch (error) {
      setTimeout(() => {
        let fallbackAnswer = "Based on our telemetry models, we detected a 12% increase in latency over the API gateways. Caching replicas are suggested.";
        if (targetMsg.toLowerCase().includes('latency') || targetMsg.toLowerCase().includes('slow'))
          fallbackAnswer = "I've analyzed the logs for the latency themes. Response time spikes correlate to database invite lookups during peaks. Optimizing indexes will solve this.";
        else if (targetMsg.toLowerCase().includes('security') || targetMsg.toLowerCase().includes('key'))
          fallbackAnswer = "The read-only token feature has been verified. No administrative leakage detected. All tokens are encrypted using SHA-256.";
        setChatMessages(prev => { const u = [...prev]; u[u.length - 1] = { sender: 'ai', text: fallbackAnswer }; return u; });
      }, 800);
    } finally {
      setIsSendingChat(false);
    }
  };

  const SentimentBadge = ({ s }) => {
    const map = { positive: 'db-badge-positive', negative: 'db-badge-negative', neutral: 'db-badge-neutral' };
    return <span className={`db-badge ${map[s] || 'db-badge-neutral'}`}>{s}</span>;
  };

  const StatusBadge = ({ s }) => {
    const map = { NEW: 'db-badge-new', REVIEWED: 'db-badge-reviewed', ACTIONED: 'db-badge-actioned' };
    return <span className={`db-badge ${map[s] || 'db-badge-neutral'}`}>{s}</span>;
  };

  const filteredThemes = wsData.themes.filter(t =>
    t.name.toLowerCase().includes(themeSearchQuery.toLowerCase())
  );

  return (
    <div className="db-root">

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className={`db-sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
        <div className="db-sidebar-brand">
          <span className="db-sidebar-logo">LOOP<span style={{color: '#ff3c3c'}}>.</span></span>
          <Menu size={16} className="db-sidebar-collapse-icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{cursor: 'pointer', color: '#fff'}} />
        </div>

        <div className="db-sidebar-ws-card">
          <div className="db-sidebar-ws-icon"><LayoutDashboard size={14} color="#ff3c3c" /></div>
          <div className="db-sidebar-ws-info">
            <div className="db-sidebar-ws-name">Acme Corp</div>
            <div className="db-sidebar-ws-sub">Workspace</div>
          </div>
          <ChevronDown size={14} className="db-sidebar-ws-chevron" />
        </div>

        <nav className="db-nav">
          {sidebarTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeSidebarTab === tab.name;
            return (
              <button
                key={tab.name}
                className={`db-nav-item${isActive ? ' active' : ''}`}
                onClick={() => setActiveSidebarTab(tab.name)}
              >
                <Icon className="db-nav-icon" size={16} />
                <span className="db-nav-label">{tab.name}</span>
                {tab.name === 'Feedback Inbox' && <span className="db-nav-badge">12</span>}
              </button>
            );
          })}
        </nav>

        <div className="db-sidebar-section">
          <div className="db-sidebar-section-title">Quick Actions</div>
          <button className="db-sidebar-action"><Plus size={14} /> Add Feedback</button>
          <button className="db-sidebar-action"><Upload size={14} /> Upload CSV</button>
          <button className="db-sidebar-action"><Download size={14} /> Import from Channel</button>
          <button className="db-sidebar-action" style={{ color: '#ff3c3c' }}><Sparkles size={14} /> Ask LOOP</button>
          <button className="db-sidebar-action"><FileText size={14} /> Generate Report</button>
        </div>

        <div className="db-sidebar-plan">
          <div className="db-sidebar-plan-title">Pro Plan</div>
          <div className="db-sidebar-plan-usage">Usage this month <span>68%</span></div>
          <div className="db-sidebar-plan-bar"><div className="db-sidebar-plan-fill" style={{width: '68%'}}></div></div>
          <button className="db-sidebar-plan-btn">Upgrade Plan</button>
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
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'var(--db-font-mono)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--db-text-muted)', marginBottom: '10px' }}>Workspaces</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['loop.intel', 'linear.dev', 'stripe.int'].map(ws => (
                  <button
                    key={ws}
                    onClick={() => { handleWorkspaceChange(ws); setMobileMenuOpen(false); }}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid',
                      borderColor: workspace === ws ? 'var(--db-accent)' : 'var(--db-border)',
                      background: workspace === ws ? 'rgba(255,60,60,0.08)' : 'transparent',
                      color: workspace === ws ? '#fff' : 'var(--db-text-muted)',
                      fontFamily: 'var(--db-font-mono)', fontSize: '0.65rem', cursor: 'pointer'
                    }}
                  >
                    {ws.split('.')[0]}
                  </button>
                ))}
              </div>
            </div>
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
            <button className="db-topbar-icon-btn"><Sun size={16} /></button>
            <button className="db-topbar-icon-btn active">
              <Bell size={16} />
              <span className="db-notif-badge">3</span>
            </button>
            <div className="db-topbar-avatar">JM</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="db-content">

          {/* ── Error Banner ── */}
          {dashboardState === 'error' && (
            <div className="db-error-banner">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <AlertTriangle size={18} style={{ color: '#f87171', flexShrink: 0, marginTop: '2px' }} />
                <div className="db-error-text-block">
                  <div className="db-error-title">Database connection socket timed out</div>
                  <div className="db-error-desc">A telemetry event receiver queue hit max load. Signals ingestion failed to process.</div>
                </div>
              </div>
              <button className="db-btn db-btn-primary" style={{ background: 'rgba(239,68,68,0.8)', borderColor: 'rgba(239,68,68,0.4)', fontSize: '0.72rem' }} onClick={() => setDashboardState('data')}>
                Retry Connection
              </button>
            </div>
          )}

          {/* ── Skeleton Loading ── */}
          {dashboardState === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="db-skeleton" style={{ width: '200px', height: '24px' }} />
                  <div className="db-skeleton" style={{ width: '300px', height: '14px' }} />
                </div>
                <div className="db-skeleton" style={{ width: '100px', height: '34px' }} />
              </div>
              <div className="db-kpi-grid">
                {[1,2,3,4].map(i => (
                  <div key={i} className="db-kpi-card">
                    <div className="db-skeleton" style={{ width: '80px', height: '10px', marginBottom: '12px' }} />
                    <div className="db-skeleton" style={{ width: '120px', height: '28px' }} />
                  </div>
                ))}
              </div>
              <div className="db-charts-grid">
                <div className="db-card db-chart-wide" style={{ height: '250px' }}>
                  <div className="db-skeleton" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
                </div>
                <div className="db-card" style={{ height: '250px' }}>
                  <div className="db-skeleton" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
                </div>
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
                      <h1 className="db-overview-title">{wsData.welcome}</h1>
                      <p className="db-overview-subtitle">{wsData.subtitle}</p>
                    </div>
                    <div className="db-overview-date">
                      May 12 – May 18, 2024 <div className="db-overview-date-icon"><LayoutDashboard size={14} /></div>
                    </div>
                  </div>

                  {/* Actions Ribbon */}
                  <div className="db-overview-actions">
                    <button className="db-btn db-btn-primary"><Plus size={14} /> Add Feedback</button>
                    <button className="db-btn db-btn-outline"><Upload size={14} /> Upload CSV</button>
                    <button className="db-btn db-btn-outline"><RefreshCw size={14} /> Import Channel</button>
                    <button className="db-btn db-btn-outline" style={{color: '#ff3c3c', borderColor: 'rgba(255,60,60,0.3)'}}><Sparkles size={14} /> Ask LOOP</button>
                    <button className="db-btn db-btn-outline"><FileText size={14} /> Generate Report</button>
                  </div>

                  {/* KPI Grid */}
                  <div className="db-overview-kpis">
                    {wsData.kpis.map(kpi => {
                      const Icon = kpi.icon;
                      return (
                        <div key={kpi.label} className="db-overview-kpi-card">
                          <div className="db-kpi-header">
                            <Icon size={14} color={kpi.iconColor} /> {kpi.label}
                          </div>
                          <div className="db-kpi-body">
                            <span className="db-kpi-value">{kpi.value}</span>
                            <span className={`db-kpi-trend ${kpi.trendGood ? 'up' : kpi.dir}`}>
                              {kpi.dir === 'up' ? '↗' : '↘'} {kpi.trend}
                            </span>
                          </div>
                          <div className="db-kpi-footer">vs last week</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Charts Row */}
                  <div className="db-overview-charts">
                    {/* Line Chart */}
                    <div className="db-chart-card line-chart">
                      <div className="db-chart-header">
                        <div className="db-chart-title"><BarChart3 size={14} color="#ff3c3c" /> Feedback Volume Over Time</div>
                        <div className="db-chart-filter">Daily <ChevronDown size={12}/></div>
                      </div>
                      <div className="db-chart-body" style={{position: 'relative', height: '180px'}}>
                        <svg className="db-chart-svg" viewBox="0 0 500 180" preserveAspectRatio="none" style={{width: '100%', height: '100%'}}>
                          <defs>
                            <linearGradient id="gradient-vol-red" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#ff3c3c" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#ff3c3c" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <line x1="0" y1="45" x2="500" y2="45" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="135" x2="500" y2="135" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4" />
                          <path d="M 0 160 L 50 140 L 100 100 L 150 70 L 200 40 L 250 60 L 300 100 L 350 120 L 400 90 L 450 85 L 500 80 L 500 180 L 0 180 Z" fill="url(#gradient-vol-red)" />
                          <path d="M 0 160 L 50 140 L 100 100 L 150 70 L 200 40 L 250 60 L 300 100 L 350 120 L 400 90 L 450 85 L 500 80" fill="none" stroke="#ff3c3c" strokeWidth="2" strokeLinecap="round" />
                          {[[50,140],[100,100],[150,70],[200,40],[250,60],[300,100],[350,120],[400,90],[450,85],[500,80]].map(([x,y],i) => (
                            <circle key={i} cx={x} cy={y} r="3" fill="#000" stroke="#ff3c3c" strokeWidth="2" />
                          ))}
                        </svg>
                        <div className="db-chart-axis" style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.65rem', color: 'var(--db-text-muted)'}}>
                          <span>May 12</span><span>May 13</span><span>May 14</span><span>May 15</span><span>May 16</span><span>May 17</span><span>May 18</span>
                        </div>
                      </div>
                    </div>

                    {/* Donut Chart 1 */}
                    <div className="db-chart-card donut-chart">
                      <div className="db-chart-title">Sentiment Distribution</div>
                      <div className="db-donut-layout">
                        <div className="db-donut-svg-wrap">
                          <svg viewBox="0 0 36 36" className="db-donut-svg">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                            {/* Pos 62% */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="62 38" strokeDashoffset="25" />
                            {/* Neg 18% */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ff3c3c" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-37" />
                            {/* Neu 20% */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6b7280" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="-55" />
                          </svg>
                          <div className="db-donut-center">
                            <div className="db-donut-val">2,845</div>
                            <div className="db-donut-lbl">Total</div>
                          </div>
                        </div>
                        <div className="db-donut-legend">
                          <div className="db-legend-row"><span className="db-dot" style={{background: '#10b981'}}/> Positive <span className="db-pct">62%</span></div>
                          <div className="db-legend-row"><span className="db-dot" style={{background: '#6b7280'}}/> Neutral <span className="db-pct">20%</span></div>
                          <div className="db-legend-row"><span className="db-dot" style={{background: '#ff3c3c'}}/> Negative <span className="db-pct">18%</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Donut Chart 2 */}
                    <div className="db-chart-card donut-chart">
                      <div className="db-chart-title">Feedback by Channel</div>
                      <div className="db-donut-layout">
                        <div className="db-donut-svg-wrap">
                          <svg viewBox="0 0 36 36" className="db-donut-svg">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                            {/* Tickets 42% */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ff3c3c" strokeWidth="4" strokeDasharray="42 58" strokeDashoffset="25" />
                            {/* App 24% */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="24 76" strokeDashoffset="-17" />
                            {/* Surveys 18% */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#eab308" strokeWidth="4" strokeDasharray="18 82" strokeDashoffset="-41" />
                            {/* Social 10% */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="-59" />
                            {/* Others 6% */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6b7280" strokeWidth="4" strokeDasharray="6 94" strokeDashoffset="-69" />
                          </svg>
                          <div className="db-donut-center">
                            <div className="db-donut-val">2,845</div>
                            <div className="db-donut-lbl">Total</div>
                          </div>
                        </div>
                        <div className="db-donut-legend">
                          <div className="db-legend-row"><span className="db-dot" style={{background: '#ff3c3c'}}/> Support Tickets <span className="db-pct">42%</span></div>
                          <div className="db-legend-row"><span className="db-dot" style={{background: '#f97316'}}/> App Reviews <span className="db-pct">24%</span></div>
                          <div className="db-legend-row"><span className="db-dot" style={{background: '#eab308'}}/> Surveys <span className="db-pct">18%</span></div>
                          <div className="db-legend-row"><span className="db-dot" style={{background: '#3b82f6'}}/> Social Media <span className="db-pct">10%</span></div>
                          <div className="db-legend-row"><span className="db-dot" style={{background: '#6b7280'}}/> Others <span className="db-pct">6%</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Grid Row */}
                  <div className="db-overview-data-row">
                    
                    {/* Top Themes */}
                    <div className="db-data-card">
                      <div className="db-data-header">
                        <div className="db-data-title">Top Themes</div>
                        <button className="db-btn-small">View all</button>
                      </div>
                      <table className="db-data-table">
                        <thead><tr><th>Theme</th><th>Mentions</th><th>Trend</th></tr></thead>
                        <tbody>
                          <tr><td>Pricing & Plans</td><td>562</td><td className="up">↑ 12.4%</td></tr>
                          <tr><td>Mobile App</td><td>431</td><td className="up">↑ 8.7%</td></tr>
                          <tr><td>Feature Request</td><td>402</td><td className="up">↑ 5.1%</td></tr>
                          <tr><td>Bug & Issues</td><td>315</td><td className="down">↓ 2.3%</td></tr>
                          <tr><td>Customer Support</td><td>287</td><td className="up">↑ 3.6%</td></tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Trending Themes */}
                    <div className="db-data-card">
                      <div className="db-data-header">
                        <div className="db-data-title">Trending Themes</div>
                        <button className="db-btn-small">View all</button>
                      </div>
                      <div className="db-trending-list">
                        {[
                          {i:1, n:'AI Summary Feature', t:'21%', c:'up', m:156},
                          {i:2, n:'Export Customization', t:'21%', c:'up', m:98},
                          {i:3, n:'API Access', t:'18%', c:'down', m:87},
                          {i:4, n:'SSO Integration', t:'16%', c:'down', m:76},
                          {i:5, n:'Billing & Invoices', t:'12%', c:'up', m:65}
                        ].map(t => (
                          <div key={t.i} className="db-trending-item">
                            <div className="db-trend-idx">{t.i}</div>
                            <div className="db-trend-name">{t.n}</div>
                            <div className={`db-trend-spark ${t.c}`}>~~</div>
                            <div className={`db-trend-pct ${t.c}`}>{t.t}</div>
                            <div className="db-trend-val">{t.m}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Feedback */}
                    <div className="db-data-card">
                      <div className="db-data-header">
                        <div className="db-data-title">Recent Feedback</div>
                        <button className="db-btn-small">View all</button>
                      </div>
                      <div className="db-recent-list">
                        {[
                          {a:'SK', c:'#ff3c3c', t:'The new dashboard is very intuitive and...', d:'May 18, 2:30 PM', s:'Positive'},
                          {a:'AR', c:'#6b7280', t:'Need bulk export feature for reports.', d:'May 18, 1:15 PM', s:'Neutral'},
                          {a:'JM', c:'#f97316', t:'The mobile app crashes on login.', d:'May 18, 12:05 PM', s:'Negative'},
                          {a:'TW', c:'#10b981', t:'Great customer support experience!', d:'May 18, 11:42 AM', s:'Positive'}
                        ].map((r,i) => (
                          <div key={i} className="db-recent-item">
                            <div className="db-recent-av" style={{background: r.c}}>{r.a}</div>
                            <div className="db-recent-info">
                              <div className="db-recent-txt">{r.t}</div>
                              <div className="db-recent-date">{r.d}</div>
                            </div>
                            <div className={`db-recent-badge ${r.s.toLowerCase()}`}>{r.s}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insight */}
                    <div className="db-data-card db-insight-card">
                      <div className="db-insight-header">
                        <Sparkles size={14} color="#ff3c3c"/> AI Insight
                      </div>
                      <div className="db-insight-body">
                        Negative feedback around billing and pricing has decreased by 23% this week. Users love the new dashboard but are requesting more export options.
                      </div>
                      <div className="db-insight-footer">Generated 2h ago <RefreshCw size={12}/></div>
                      <button className="db-btn-insight">View all insights</button>
                    </div>

                  </div>

                  {/* Bottom Row */}
                  <div className="db-overview-bottom-row">
                    <div className="db-data-card" style={{flex: 2}}>
                      <div className="db-data-title" style={{marginBottom: '16px'}}>Voice of Customer Summary</div>
                      <p className="db-voc-quote">
                        "Customers appreciate the new dashboard and AI features. Top requests include more export options, API access, and mobile app stability improvements."
                      </p>
                      <button className="db-btn-outline" style={{marginTop: '20px'}}><FileText size={14}/> View Full Report</button>
                    </div>
                    <div className="db-data-card" style={{flex: 1}}>
                      <div className="db-data-header">
                        <div className="db-data-title">Workspace Activity</div>
                        <button className="db-btn-small">View all</button>
                      </div>
                      <div className="db-activity-list">
                        <div className="db-activity-item"><LayoutDashboard size={12}/> Sarah Khan uploaded 120 feedbacks <span>2h ago</span></div>
                        <div className="db-activity-item"><Sparkles size={12}/> AI generated a new insight <span>3h ago</span></div>
                        <div className="db-activity-item"><FileText size={12}/> James Miller generated a report <span>5h ago</span></div>
                        <div className="db-activity-item"><Users size={12}/> Maria Garcia added a new member <span>1d ago</span></div>
                      </div>
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
                    {/* Inbox List */}
                    <div className="db-inbox-list">
                      <div className="db-inbox-list-header">Streams ({wsData.feedback.length})</div>
                      {wsData.feedback.map((item, idx) => (
                        <div
                          key={idx}
                          className={`db-inbox-item${selectedFeedbackIndex === idx ? ' active' : ''}`}
                          onClick={() => { setSelectedFeedbackIndex(idx); setReplySent(false); setCopiedDraft(false); }}
                        >
                          <div className="db-inbox-item-header">
                            <span className="db-inbox-customer">{item.customer}</span>
                            <SentimentBadge s={item.sentiment} />
                          </div>
                          <p className="db-inbox-preview">{item.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Inbox Detail */}
                    <div className="db-inbox-detail">
                      <div className="db-inbox-detail-header">
                        <div className="db-inbox-detail-meta">
                          <span className="db-inbox-detail-name">{wsData.feedback[selectedFeedbackIndex]?.customer}</span>
                          <span className="db-badge db-badge-channel">{wsData.feedback[selectedFeedbackIndex]?.channel}</span>
                          <StatusBadge s={wsData.feedback[selectedFeedbackIndex]?.status} />
                          <span className="db-inbox-detail-date">Ingested: {wsData.feedback[selectedFeedbackIndex]?.date}</span>
                        </div>
                      </div>
                      <div className="db-inbox-detail-body">
                        <div className="db-inbox-signal-label">Raw Feedback Signal</div>
                        <p className="db-inbox-signal-text">{wsData.feedback[selectedFeedbackIndex]?.text}</p>
                      </div>

                      <div className="db-inbox-ai-card">
                        <div className="db-inbox-ai-header">
                          <Sparkles size={12} />
                          AI Auto-Reply Suggestion Draft
                        </div>
                        <div className="db-inbox-ai-body">
                          <p className="db-inbox-ai-text">
                            {wsData.feedback[selectedFeedbackIndex]?.sentiment === 'negative'
                              ? `Hello. Thank you for reporting this issue regarding "${wsData.feedback[selectedFeedbackIndex]?.theme}". We have identified the spike in queue processing delays on our integration webhook handlers. A replica node deployment has been initiated to resolve this immediately.`
                              : `Hi! Thank you for the positive logs. We are glad that the bulk keyboard workflows are improving your team speed. The direct integration options for secondary pipelines are set to launch shortly.`}
                          </p>
                          <div className="db-inbox-ai-actions">
                            <button className="db-btn db-btn-primary" style={{ fontSize: '0.68rem' }}
                              onClick={() => { setReplySent(true); setTimeout(() => setReplySent(false), 2000); }}
                              disabled={replySent}
                            >
                              <Send size={12} />{replySent ? 'Reply Dispatched ✓' : 'Send Reply'}
                            </button>
                            <button className="db-btn db-btn-secondary" style={{ fontSize: '0.68rem' }}
                              onClick={() => { setCopiedDraft(true); setTimeout(() => setCopiedDraft(false), 2000); }}
                            >
                              <Copy size={12} />{copiedDraft ? 'Copied!' : 'Copy Draft'}
                            </button>
                          </div>
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
                    <p className="db-page-subtitle">Database query speeds and conversion metrics</p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {[
                      { label: 'Average API Latency', value: '8.4s', change: '-1.2s', dir: 'up' },
                      { label: 'Webhook Success Rate', value: '99.98%', change: 'stable', dir: 'up' },
                      { label: 'Active Conversion', value: '4.2%', change: '+0.8%', dir: 'up' }
                    ].map(m => (
                      <div key={m.label} className="db-kpi-card">
                        <div className="db-kpi-label">{m.label}</div>
                        <div className="db-kpi-row">
                          <span className="db-kpi-value">{m.value}</span>
                          <span className="db-kpi-change up">{m.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="db-card">
                    <div className="db-card-header">
                      <div className="db-card-title"><BarChart3 size={14} /> API Performance Metrics</div>
                    </div>
                    <div className="db-table-wrap">
                      <table className="db-table">
                        <thead>
                          <tr>
                            <th>Prompt Query Class</th>
                            <th style={{ textAlign: 'right' }}>Ingestion Volume</th>
                            <th style={{ textAlign: 'right' }}>Success Index</th>
                            <th style={{ textAlign: 'right' }}>Avg Execution</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Slack events listener webhook', vol: '12,408', success: '99.9%', time: '242ms', ok: true },
                            { name: 'Stripe subscription event parser', vol: '8,422', success: '100.0%', time: '180ms', ok: true },
                            { name: 'loop.intel summarizer nodes', vol: '3,110', success: '98.2%', time: '8.4s', ok: false }
                          ].map(row => (
                            <tr key={row.name}>
                              <td style={{ color: 'var(--db-text-primary)', fontWeight: 500 }}>{row.name}</td>
                              <td style={{ textAlign: 'right', fontFamily: 'var(--db-font-mono)' }}>{row.vol}</td>
                              <td style={{ textAlign: 'right', fontFamily: 'var(--db-font-mono)', color: row.ok ? 'var(--db-green)' : 'var(--db-red)', fontWeight: 600 }}>{row.success}</td>
                              <td style={{ textAlign: 'right', fontFamily: 'var(--db-font-mono)', color: 'var(--db-text-muted)' }}>{row.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
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
                    {filteredThemes.map(theme => (
                      <div key={theme.name} className="db-theme-card">
                        <div className="db-theme-tag-label">Theme tag</div>
                        <div className="db-theme-name">{theme.name}</div>
                        <div className="db-theme-footer">
                          <span className="db-theme-count">{theme.count} mentions this week</span>
                          <span className={`db-theme-trend ${theme.dir}`}>
                            {theme.trend} {theme.dir === 'up' ? '↑' : '↓'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {filteredThemes.length === 0 && (
                      <div style={{ gridColumn: '1 / -1' }} className="db-empty-state">
                        No customer themes matched your search query.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: ASK LOOP (CHAT)                ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Ask LOOP' && (
                <div className={`db-chat-container ${byokMode ? 'byok-theme' : ''}`}>
                  <div className="db-chat-header">
                    <div className="db-chat-header-info">
                      <div className="db-chat-header-icon"><Sparkles size={16} /></div>
                      <div>
                        <h2 className="db-chat-header-title">LOOP AI Assistant</h2>
                        <span className="db-chat-header-subtitle">
                          {byokMode ? 'Active: BYOK Custom Model' : 'Active: NVIDIA NIM deepseek-v4'}
                        </span>
                      </div>
                    </div>
                    <div className="db-chat-header-actions">
                      <button 
                        className={`db-btn ${byokMode ? 'db-btn-primary' : 'db-btn-secondary'}`}
                        style={{ fontSize: '0.65rem', padding: '4px 10px', height: '24px' }}
                        onClick={() => setByokMode(!byokMode)}
                        title="Bring Your Own Key"
                      >
                        {byokMode ? 'BYOK: ON' : 'BYOK: OFF'}
                      </button>
                      <button className="db-btn db-btn-ghost" onClick={() => setChatMessages([{ sender: 'ai', text: 'Hello. I am the LOOP AI Assistant. How can I help you today?' }])} title="Clear Chat">
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="db-chat-scroll-area">
                    {chatMessages.length <= 1 && (
                      <div className="db-chat-empty-state">
                        <div className="db-chat-empty-icon">l.</div>
                        <h3 className="db-chat-empty-title">How can I help you?</h3>
                        <p className="db-chat-empty-desc">Ask about your workspace data, conversion metrics, or let me summarize feedback.</p>
                        <div className="db-chat-suggestion-cards">
                          {['Analyze latest feedback', 'Summarize negative themes', 'Check database queries'].map(s => (
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
                    <button className="db-btn db-btn-primary" onClick={() => alert('New briefing generated.')}>
                      <Plus size={13} /><span>Generate Report</span>
                    </button>
                  </div>

                  <div className="db-reports-grid">
                    {[
                      { title: 'July Executive Summary', date: 'Jul 7, 2026', summary: 'Analyzed 12,840 customer feedback inputs across Slack checkout, payment issues streams and Intercom logs. Identifies database query latency triggers and cache solutions.' },
                      { title: 'Q2 Integration Audit', date: 'Jun 30, 2026', summary: 'Deep-dive reviews of checkout validation failure, mobile layout conversion rates, payment element matches and dispute response templates.' },
                      { title: 'Latency Audit Brief', date: 'Jun 15, 2026', summary: 'Examines query response speed telemetry, database index replication strategies, socket connection failures across US-East regions.' }
                    ].map(r => (
                      <div key={r.title} className="db-report-card">
                        <div className="db-report-header">
                          <div className="db-report-title">{r.title}</div>
                          <span className="db-report-date">{r.date}</span>
                        </div>
                        <p className="db-report-summary">{r.summary}</p>
                        <button className="db-btn db-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                          <Download size={13} /><span>Download PDF Report</span>
                        </button>
                      </div>
                    ))}
                  </div>
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
                    <button className="db-btn db-btn-primary" onClick={() => alert('Profile updated.')}>
                      <span>Save Changes</span>
                    </button>
                  </div>

                  <div className="db-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                      <div className="db-avatar" style={{ width: '80px', height: '80px', fontSize: '2rem' }}>G</div>
                      <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--db-text-primary)' }}>Guest User</h2>
                        <p style={{ color: 'var(--db-text-muted)', fontFamily: 'var(--db-font-mono)', fontSize: '0.8rem', marginTop: '4px' }}>guest@loop.intel</p>
                        <div style={{ marginTop: '12px' }}>
                          <span className="db-badge db-badge-channel">Reviewer</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div className="db-form-group">
                        <label className="db-form-label">Full Name</label>
                        <input type="text" className="db-input" defaultValue="Guest User" />
                      </div>
                      <div className="db-form-group">
                        <label className="db-form-label">Email Address</label>
                        <input type="email" className="db-input" defaultValue="guest@loop.intel" />
                      </div>
                      <div className="db-form-group">
                        <label className="db-form-label">Role</label>
                        <input type="text" className="db-input" defaultValue="Reviewer" disabled style={{ opacity: 0.6 }} />
                        <span className="db-form-hint">Contact your administrator to change your role.</span>
                      </div>
                      <div className="db-form-group">
                        <label className="db-form-label">Timezone</label>
                        <select className="db-input">
                          <option>UTC+0 (London, GMT)</option>
                          <option>UTC-5 (EST)</option>
                          <option>UTC-8 (PST)</option>
                        </select>
                      </div>
                    </div>
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
                    <p className="db-page-subtitle">Manage API keys, webhooks, and workspace details</p>
                  </div>

                  <div className="db-settings-layout">
                    <nav className="db-settings-nav">
                      {['General Settings', 'API Tokens', 'Webhooks Config', 'Billing & Logs'].map((item, i) => (
                        <div key={item} className={`db-settings-nav-item${i === 0 ? ' active' : ''}`}>
                          {item}
                        </div>
                      ))}
                    </nav>

                    <div className="db-settings-panel">
                      <div className="db-settings-section-title">General Workspace Configurations</div>

                      <div className="db-form-group">
                        <label className="db-form-label">Workspace ID (Unique Identifier)</label>
                        <div className="db-form-static" style={{ fontFamily: 'var(--db-font-mono)', fontSize: '0.78rem' }}>{workspace}</div>
                        <span className="db-form-hint">Your workspace node ID assigned during initial provisioning.</span>
                      </div>

                      <div className="db-form-group">
                        <label className="db-form-label">Display Name</label>
                        <input type="text" className="db-input" defaultValue="Loop Intelligence Console" />
                        <span className="db-form-hint">Human-readable alias for your workspace dashboard view.</span>
                      </div>

                      <div className="db-form-group">
                        <label className="db-form-label">Data Timezone</label>
                        <input type="text" className="db-input" defaultValue="UTC+0 (London, GMT)" />
                        <span className="db-form-hint">All customer feedback times are normalized to this timezone.</span>
                      </div>

                      <div className="db-form-group">
                        <label className="db-form-label">NVIDIA API Key</label>
                        <input type="password" className="db-input" defaultValue="••••••••••••••••••" />
                        <span className="db-form-hint">Your NVIDIA API key for powering LOOP AI.</span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                        <button className="db-btn db-btn-primary" onClick={() => alert('Settings saved.')}>
                          Save Changes
                        </button>
                        <button className="db-btn db-btn-secondary">
                          Reset to Defaults
                        </button>
                      </div>
                    </div>
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
