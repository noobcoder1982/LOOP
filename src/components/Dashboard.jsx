import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
  Zap,
  Code,
  Paperclip,
  CornerDownLeft,
  Mic
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext.jsx';
import { supabase } from '../lib/supabase';
import './Dashboard.css';

// ─── Model Settings Modal ───────────────────────────────────────────────────
function ModelModal({ onClose }) {
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('loop_nvidia_api_key') || '';
    }
    return '';
  });
  const [model, setModel] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('loop_model') || 'deepseek-ai/deepseek-v4-flash';
    }
    return 'deepseek-ai/deepseek-v4-flash';
  });
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
  const { user, role, workspace, session } = useAuth();
  const [dashboardTheme, setDashboardTheme] = useState('dark');
  const [activeSettingsTab, setActiveSettingsTab] = useState('General Settings');
  const [activeSidebarTab, setActiveSidebarTab] = useState('Dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState('');

  // Real Database States
  const [feedbacks, setFeedbacks] = useState([]);
  const [themes, setThemes] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Workspace Members States
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('ANALYST');
  const [inviteLoading, setInviteLoading] = useState(false);

  const fetchWorkspaceMembers = async () => {
    if (!workspace || !workspace.id) return;
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select('id, user_id, role, user_email, created_at')
        .eq('workspace_id', workspace.id);
      if (data) setWorkspaceMembers(data);
    } catch (e) {
      console.error("Failed to load workspace members:", e);
    }
  };

  const handleUpdateMemberRole = async (memberId, newRole) => {
    if (role !== 'ADMIN') {
      alert("Forbidden: Only ADMINs can manage member roles.");
      return;
    }
    try {
      const { error } = await supabase
        .from('workspace_members')
        .update({ role: newRole })
        .eq('id', memberId);
      if (error) throw error;
      await fetchWorkspaceMembers();
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to update role.");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (role !== 'ADMIN') {
      alert("Forbidden: Only ADMINs can add workspace members.");
      return;
    }
    if (!inviteEmail.trim() || inviteLoading) return;
    setInviteLoading(true);

    try {
      // 1.securely lookup user id from email
      const { data: inviteeId, error: rpcError } = await supabase.rpc('get_user_id_by_email', { email_addr: inviteEmail });

      if (rpcError || !inviteeId) {
        alert("User not found. Ensure they have signed up first.");
        setInviteLoading(false);
        return;
      }

      // 2. add to workspace_members
      const { error: insertError } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          user_id: inviteeId,
          role: inviteRole,
          user_email: inviteEmail
        });

      if (insertError) {
        alert(insertError.message || "Failed to add member to workspace.");
      } else {
        alert("Member added successfully!");
        setInviteEmail('');
        await fetchWorkspaceMembers();
      }
    } catch (e) {
      console.error(e);
      alert("Error adding workspace member.");
    } finally {
      setInviteLoading(false);
    }
  };

  // Ingestion Simulator States
  const [simName, setSimName] = useState('Alex Rivera');
  const [simChannel, setSimChannel] = useState('Website Widget');
  const [simText, setSimText] = useState('This product has dramatically accelerated our feedback cycle!');
  const [simLoading, setSimLoading] = useState(false);
  const [simSuccess, setSimSuccess] = useState(false);

  // Manual Ingestion Modal/States
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualText, setManualText] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualChannel, setManualChannel] = useState('Direct Form');

  // Selected feedback index
  const [selectedFeedbackIndex, setSelectedFeedbackIndex] = useState(0);
  const [replySent, setReplySent] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDashboardTheme(localStorage.getItem('loop_dashboard_theme') || 'dark');
    }
  }, []);

  // Fetch from database API
  const fetchWorkspaceData = async () => {
    if (!user || !session) return;
    setLoadingData(true);
    try {
      const headers = { 'Authorization': `Bearer ${session?.access_token}` };
      const [fbRes, thRes, repRes] = await Promise.all([
        fetch(`/api/feedback?userId=${user.id}`, { headers }),
        fetch(`/api/themes?userId=${user.id}`, { headers }),
        fetch(`/api/reports?userId=${user.id}`, { headers })
      ]);
      
      const fbData = await fbRes.json();
      const thData = await thRes.json();
      const repData = await repRes.json();

      setFeedbacks(fbData.feedback || []);
      setThemes(thData.themes || []);
      setReports(repData.reports || []);
    } catch (e) {
      console.error("Failed to load workspace metrics:", e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [user, session]);

  useEffect(() => {
    if (activeSidebarTab === 'Settings' && activeSettingsTab === 'Workspace Members') {
      fetchWorkspaceMembers();
    }
  }, [activeSidebarTab, activeSettingsTab, workspace]);

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
    { id: 'light', name: 'Daylight Light', desc: 'Clean high-contrast slate light mode', bg: '#f8fafc', surface: '#ffffff', accent: '#dc2626' }
  ];

  const handleThemeChange = (newThemeKey) => {
    setDashboardTheme(newThemeKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('loop_dashboard_theme', newThemeKey);
    }
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

  // ── Ingest Sim Handlers ────────────────────────────────────────────────────
  const handleSimSubmit = async (e) => {
    e.preventDefault();
    if (role === 'VIEWER') {
      alert("Forbidden: Viewers cannot ingest feedback.");
      return;
    }
    if (!simText.trim() || simLoading) return;
    setSimLoading(true);
    setSimSuccess(false);

    try {
      const savedKey = localStorage.getItem('loop_nvidia_api_key') || '';
      const response = await fetch('/api/feedback/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({
          text: simText,
          channel: simChannel,
          customer: simName,
          userId: user.id,
          apiKey: savedKey
        })
      });

      if (response.ok) {
        setSimSuccess(true);
        setSimText('');
        // Reload dashboard
        await fetchWorkspaceData();
        setTimeout(() => setSimSuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (role === 'VIEWER') {
      alert("Forbidden: Viewers cannot ingest feedback.");
      return;
    }
    if (!manualText.trim()) return;
    try {
      const savedKey = localStorage.getItem('loop_nvidia_api_key') || '';
      const response = await fetch('/api/feedback/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({
          text: manualText,
          channel: manualChannel,
          customer: manualName || 'Direct Upload',
          userId: user.id,
          apiKey: savedKey
        })
      });

      if (response.ok) {
        setManualText('');
        setManualName('');
        setShowManualModal(false);
        await fetchWorkspaceData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── Update Feedback Status ──────────────────────────────────────────────────
  const handleUpdateStatus = async (id, newStatus) => {
    if (role === 'VIEWER') {
      alert("Forbidden: Viewers cannot modify feedback.");
      return;
    }
    try {
      const res = await fetch('/api/feedback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({ id, status: newStatus, userId: user.id })
      });
      if (res.status === 403) {
        alert("Action Forbidden: You do not have permission to perform this task.");
        return;
      }
      if (res.ok) {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── Delete Feedback Item ────────────────────────────────────────────────────
  const handleDeleteFeedback = async (id) => {
    if (role === 'VIEWER') {
      alert("Forbidden: Viewers cannot delete feedback.");
      return;
    }
    try {
      const res = await fetch(`/api/feedback?id=${id}&userId=${user.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session?.access_token}` }
      });
      if (res.status === 403) {
        alert("Action Forbidden: You do not have permission to perform this task.");
        return;
      }
      if (res.ok) {
        setFeedbacks(prev => prev.filter(f => f.id !== id));
        if (selectedFeedbackIndex >= feedbacks.length - 1 && selectedFeedbackIndex > 0) {
          setSelectedFeedbackIndex(selectedFeedbackIndex - 1);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ── Chat handler with server API completions proxy ───────────────────────
  const handleSendChat = async (directMsgInput = null) => {
    const targetMsg = directMsgInput || chatInput;
    if (!targetMsg.trim() || isSendingChat) return;

    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: targetMsg }]);
    setIsSendingChat(true);
    setChatMessages(prev => [...prev, { sender: 'ai', text: 'Thinking...' }]);

    try {
      const savedKey = localStorage.getItem('loop_nvidia_api_key') || '';
      const savedModel = localStorage.getItem('loop_model') || 'deepseek-ai/deepseek-v4-flash';

      const contextPrompt = `You are LOOP AI, an executive customer feedback assistant.
      
Here is the current workspace data context:
- Total Feedbacks: ${feedbacks.length}
- Positive: ${feedbacks.filter(f => f.sentiment === 'positive').length}
- Negative: ${feedbacks.filter(f => f.sentiment === 'negative').length}
- Neutral: ${feedbacks.filter(f => f.sentiment === 'neutral').length}

Recent Feedbacks:
${feedbacks.slice(0, 10).map(f => `- [${(f.sentiment || 'unknown').toUpperCase()}] from ${f.customer}: "${f.text}"`).join('\n')}

IMPORTANT RULES: 
1. You can answer with plain text.
2. If the user asks for a chart, graph, or visual breakdown of the data, you MUST return a JSON codeblock containing the data exactly like this:
\`\`\`json:chart
[
  {"name": "Positive", "value": 10},
  {"name": "Negative", "value": 2}
]
\`\`\`
3. Do NOT promise to show graphs unless you include the json:chart codeblock.
4. Keep plain text answers to 2-3 sentences.

Based on this data, answer the user's question briefly.
Question: ${targetMsg}`;

      const response = await fetch("/api/nvidia/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${savedKey}`
        },
        body: JSON.stringify({
          model: savedModel,
          messages: [{ role: "user", content: contextPrompt }]
        })
      });

      const data = await response.json();
      let aiText = '';
      if (data.error) {
        aiText = data.error;
      } else {
        const reasoning = data.choices?.[0]?.message?.reasoning || '';
        const content = data.choices?.[0]?.message?.content || '';
        aiText = reasoning
          ? `--- Thinking Process ---\n${reasoning}\n--- Response ---\n${content}`
          : content;
      }

      setChatMessages(prev => {
        const u = [...prev];
        u[u.length - 1] = { sender: 'ai', text: aiText };
        return u;
      });
    } catch (error) {
      setChatMessages(prev => {
        const u = [...prev];
        u[u.length - 1] = { sender: 'ai', text: 'Unable to reach the AI model. Check your API settings.' };
        return u;
      });
    } finally {
      setIsSendingChat(false);
    }
  };

  // Calculate stats from real feedbacks
  const totalFeedbackCount = feedbacks.length;
  const positiveFeedbacks = feedbacks.filter(f => f.sentiment === 'positive');
  const negativeFeedbacks = feedbacks.filter(f => f.sentiment === 'negative');
  const neutralFeedbacks = feedbacks.filter(f => f.sentiment === 'neutral');

  const positivePercent = totalFeedbackCount > 0 ? Math.round((positiveFeedbacks.length / totalFeedbackCount) * 100) : 0;
  const negativePercent = totalFeedbackCount > 0 ? Math.round((negativeFeedbacks.length / totalFeedbackCount) * 100) : 0;
  const neutralPercent = totalFeedbackCount > 0 ? Math.round((neutralFeedbacks.length / totalFeedbackCount) * 100) : 0;

  // Group by channel
  const channelsMap = feedbacks.reduce((acc, f) => {
    acc[f.channel] = (acc[f.channel] || 0) + 1;
    return acc;
  }, {});

  const handleSignOut = async () => {
    await signOut();
    setView('landing');
  };

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Filter themes
  const filteredThemes = themes.filter(t =>
    t.name.toLowerCase().includes(themeSearchQuery.toLowerCase())
  );

  return (
    <div className="db-root" data-dashboard-theme={dashboardTheme}>

      {/* ═══════════════ MODEL MODAL ═══════════════ */}
      {showModelModal && <ModelModal onClose={() => setShowModelModal(false)} />}

      {/* ═══════════════ MANUAL ENTRY MODAL ═══════════════ */}
      {showManualModal && (
        <div className="model-modal-overlay" onClick={e => e.target === e.currentTarget && setShowManualModal(false)}>
          <div className="model-modal">
            <div className="model-modal-header">
              <h2 className="model-modal-title">Add Feedback Log</h2>
              <button className="model-modal-close" onClick={() => setShowManualModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleManualSubmit} className="model-modal-body">
              <div className="db-form-group">
                <label className="db-form-label">Customer Name</label>
                <input 
                  type="text" 
                  className="db-input" 
                  placeholder="e.g. Alex Mercer"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                />
              </div>
              <div className="db-form-group">
                <label className="db-form-label">Channel Source</label>
                <select 
                  className="db-input"
                  value={manualChannel}
                  onChange={e => setManualChannel(e.target.value)}
                >
                  <option value="Direct Form">Direct Form</option>
                  <option value="Email Support">Email Support</option>
                  <option value="Intercom Log">Intercom Log</option>
                  <option value="Zendesk ticket">Zendesk ticket</option>
                </select>
              </div>
              <div className="db-form-group">
                <label className="db-form-label">Feedback Comments</label>
                <textarea 
                  className="db-input" 
                  rows={4}
                  required
                  placeholder="Write customer feedback..."
                  value={manualText}
                  onChange={e => setManualText(e.target.value)}
                  style={{ resize: 'none', background: 'transparent' }}
                />
              </div>
              <button type="submit" className="db-btn db-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Ingest & Classify Feedback ↗
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className={`db-sidebar${sidebarCollapsed ? ' collapsed' : ''}`}>
        <button
          className="db-sidebar-expand-tab"
          onClick={() => setSidebarCollapsed(false)}
          title="Expand sidebar"
        >
          <ChevronRight size={10} />
        </button>

        <div className="db-sidebar-brand">
          {!sidebarCollapsed && (
            <span className="db-sidebar-logo">LOOP<span style={{color: '#ff3c3c'}}>.</span></span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="db-sidebar-toggle-btn"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="db-sidebar-ws-card">
          <div className="db-sidebar-ws-icon"><LayoutDashboard size={14} color="#ff3c3c" /></div>
          <div className="db-sidebar-ws-info">
            <div className="db-sidebar-ws-name">{userFullName}</div>
            <div className="db-sidebar-ws-sub">Personal Console</div>
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
                data-label={tab.name}
                title={sidebarCollapsed ? tab.name : undefined}
              >
                <Icon className="db-nav-icon" size={16} />
                <span className="db-nav-label">{tab.name}</span>
                {tab.name === 'Feedback Inbox' && totalFeedbackCount > 0 && (
                  <span className="db-nav-badge">{totalFeedbackCount}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="db-sidebar-section">
          <div className="db-sidebar-section-title">Quick Actions</div>
          <button className="db-sidebar-action" onClick={() => setShowManualModal(true)}><Plus size={14} /> Add Feedback</button>
          <button className="db-sidebar-action" onClick={() => { setActiveSidebarTab('Settings'); setActiveSettingsTab('Widget Integration & SDK'); }}><Code size={14} /> Embed Widget</button>
          <button className="db-sidebar-action" style={{ color: '#ff3c3c' }} onClick={() => setActiveSidebarTab('Ask LOOP')}><Sparkles size={14} /> Ask LOOP</button>
        </div>

        <div className="db-sidebar-signout">
          <button className="db-sidebar-action" style={{ color: 'rgba(255,255,255,0.4)', paddingLeft: '0px' }} onClick={handleSignOut}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

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
              onClick={() => handleThemeChange(dashboardTheme === 'dark' ? 'light' : 'dark')}
            >
              <Sun size={16} />
            </button>
            <div className="db-topbar-avatar" title={userFullName}>{userInitials}</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="db-content">

          {/* ── Normal Data Views ── */}
          {!loadingData && (
            <>
              {/* ╔══════════════════════════════════════╗
                  ║  TAB: DASHBOARD OVERVIEW             ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Dashboard' && (
                <div className="db-overview-layout">
                  {/* Header Row */}
                  <div className="db-overview-header">
                    <div>
                      <h1 className="db-overview-title">Welcome back, {userFullName} 👋</h1>
                      <p className="db-overview-subtitle">Reviewing real-time feedback telemetries from customer instances.</p>
                    </div>
                    <div className="db-overview-date">
                      {today} <div className="db-overview-date-icon"><LayoutDashboard size={14} /></div>
                    </div>
                  </div>

                  {/* AI Status configuration guide */}
                  {!localStorage.getItem('loop_nvidia_api_key') && (
                    <div className="db-setup-banner" onClick={() => setShowModelModal(true)}>
                      <Zap size={16} color="#ff3c3c" />
                      <span>Set up your NVIDIA API key to activate real-time LLM sentiment & theme categorization</span>
                      <span className="db-setup-banner-cta">Configure →</span>
                    </div>
                  )}

                  {/* Actions Ribbon */}
                  <div className="db-actions-ribbon">
                    <button className="db-btn db-btn-primary" onClick={() => setShowManualModal(true)}><Plus size={14} /> Add Feedback</button>
                    <button className="db-btn db-btn-outline" onClick={() => { setActiveSidebarTab('Settings'); setActiveSettingsTab('Widget Integration & SDK'); }}><Code size={14} /> SDK Guide</button>
                    <button className="db-btn db-btn-outline" style={{color: '#ff3c3c', borderColor: 'rgba(255,60,60,0.3)'}}
                      onClick={() => setActiveSidebarTab('Ask LOOP')}>
                      <Sparkles size={14} /> Ask LOOP
                    </button>
                  </div>

                  {/* KPI Grid */}
                  <div className="db-kpi-grid">
                    {[
                      { label: 'Total Ingested', value: totalFeedbackCount, icon: MessageSquare, iconColor: '#ff3c3c' },
                      { label: 'Negative Sentiment', value: totalFeedbackCount > 0 ? `${negativePercent}%` : '—', icon: AlertTriangle, iconColor: '#ff3c3c' },
                      { label: 'Positive Sentiment', value: totalFeedbackCount > 0 ? `${positivePercent}%` : '—', icon: Brain, iconColor: '#10b981' },
                      { label: 'Neutral Sentiment', value: totalFeedbackCount > 0 ? `${neutralPercent}%` : '—', icon: Tag, iconColor: '#ffb020' },
                      { label: 'Active Themes', value: themes.length, icon: Tag, iconColor: '#ff3c3c' },
                      { label: 'Reports Active', value: reports.length, icon: FileText, iconColor: '#ffb020' }
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
                          <div className="db-kpi-footer">telemetry stats</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Charts & Graphs Section */}
                  {totalFeedbackCount > 0 ? (
                    <div className="db-charts-grid">
                      {/* Sentiment distribution donut chart */}
                      <div className="db-chart-card donut-chart">
                        <div className="db-chart-title">Sentiment Distribution</div>
                        <div className="db-donut-layout">
                          <div className="db-donut-svg-wrap">
                            <svg viewBox="0 0 36 36" className="db-donut-svg">
                              <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${positivePercent} ${100 - positivePercent}`} strokeDashoffset="25" />
                              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ff3c3c" strokeWidth="4" strokeDasharray={`${negativePercent} ${100 - negativePercent}`} strokeDashoffset={`${25 - positivePercent}`} />
                              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#6b7280" strokeWidth="4" strokeDasharray={`${neutralPercent} ${100 - neutralPercent}`} strokeDashoffset={`${25 - positivePercent - negativePercent}`} />
                            </svg>
                            <div className="db-donut-center">
                              <div className="db-donut-val">{totalFeedbackCount}</div>
                              <div className="db-donut-lbl">Signals</div>
                            </div>
                          </div>
                          <div className="db-donut-legend">
                            <div className="db-legend-row"><span className="db-dot" style={{background: '#10b981'}}/> Positive <span className="db-pct">{positivePercent}%</span></div>
                            <div className="db-legend-row"><span className="db-dot" style={{background: '#6b7280'}}/> Neutral <span className="db-pct">{neutralPercent}%</span></div>
                            <div className="db-legend-row"><span className="db-dot" style={{background: '#ff3c3c'}}/> Negative <span className="db-pct">{negativePercent}%</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Ingestion channels donut chart */}
                      <div className="db-chart-card donut-chart">
                        <div className="db-chart-title">Channels Ingest Distribution</div>
                        <div className="db-donut-layout">
                          <div className="db-donut-svg-wrap">
                            <svg viewBox="0 0 36 36" className="db-donut-svg">
                              <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                              {Object.entries(channelsMap).map(([chan, count], idx) => {
                                const pct = Math.round((count / totalFeedbackCount) * 100);
                                const strokeColor = idx === 0 ? '#ff3c3c' : idx === 1 ? '#f97316' : idx === 2 ? '#3b82f6' : '#6b7280';
                                return (
                                  <circle key={chan} cx="18" cy="18" r="15.915" fill="none" stroke={strokeColor} strokeWidth="4" strokeDasharray={`${pct} ${100 - pct}`} strokeDashoffset={25} />
                                );
                              })}
                            </svg>
                            <div className="db-donut-center">
                              <div className="db-donut-val">{totalFeedbackCount}</div>
                              <div className="db-donut-lbl">Signals</div>
                            </div>
                          </div>
                          <div className="db-donut-legend">
                            {Object.entries(channelsMap).map(([chan, count], idx) => (
                              <div key={chan} className="db-legend-row">
                                <span className="db-dot" style={{background: idx === 0 ? '#ff3c3c' : idx === 1 ? '#f97316' : idx === 2 ? '#3b82f6' : '#6b7280'}}/>
                                {chan} <span className="db-pct">{Math.round((count / totalFeedbackCount) * 100)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="db-charts-grid">
                      <div className="db-chart-card line-chart" style={{ gridColumn: '1 / -1' }}>
                        <div className="db-chart-title"><BarChart3 size={14} color="#ff3c3c" /> Workspace Dashboard Overview</div>
                        <EmptyState
                          icon={Inbox}
                          title="No feedback collected yet"
                          desc="Use the quick simulator tool below or set up the Website Widget SDK on your site to ingest feedback instantly."
                          action="Setup Widget SDK"
                          onAction={() => { setActiveSidebarTab('Settings'); setActiveSettingsTab('Widget Integration & SDK'); }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Simulator + Top Themes Tables Row */}
                  <div className="db-overview-data-row">
                    {/* Live simulator widget */}
                    <div className="db-data-card" style={{ flex: 1.5 }}>
                      <div className="db-data-header">
                        <div className="db-data-title">
                          <Zap size={14} color="#ff3c3c" style={{ marginRight: '6px' }} />
                          Feedback Ingestion Simulator
                        </div>
                      </div>
                      <form onSubmit={handleSimSubmit} className="db-input-form" style={{ marginTop: '12px' }}>
                        <div className="db-form-group">
                          <label className="db-form-label">Simulated Name</label>
                          <input 
                            type="text" 
                            className="db-input" 
                            value={simName}
                            onChange={e => setSimName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="db-form-group">
                          <label className="db-form-label">Ingestion Channel</label>
                          <select 
                            className="db-input" 
                            value={simChannel}
                            onChange={e => setSimChannel(e.target.value)}
                          >
                            <option value="Website Widget">Website Widget</option>
                            <option value="Email Support">Email Support</option>
                            <option value="Slack Integration">Slack Integration</option>
                            <option value="Zendesk ticket">Zendesk ticket</option>
                          </select>
                        </div>
                        <div className="db-form-group">
                          <label className="db-form-label">Review/Feedback Text</label>
                          <textarea 
                            className="db-input" 
                            rows={3}
                            value={simText}
                            onChange={e => setSimText(e.target.value)}
                            placeholder="Type feedback here (e.g., 'Your pricing page is very confusing and expensive.')"
                            required
                            style={{ resize: 'none', background: 'transparent' }}
                          />
                        </div>
                        <button type="submit" className="db-btn db-btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={simLoading}>
                          {simLoading ? 'Simulating...' : simSuccess ? 'Feedback Ingested ✓' : 'Send Test Feedback Signal ⚡'}
                        </button>
                      </form>
                    </div>

                    {/* Top Themes */}
                    <div className="db-data-card" style={{ flex: 1 }}>
                      <div className="db-data-header">
                        <div className="db-data-title">Classified Themes</div>
                      </div>
                      {themes.length > 0 ? (
                        <table className="db-data-table" style={{ marginTop: '12px' }}>
                          <thead><tr><th>Theme Class</th><th>Count</th></tr></thead>
                          <tbody>
                            {themes.map(t => (
                              <tr key={t.id}>
                                <td>{t.name}</td>
                                <td>{t.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <EmptyState
                          icon={Tag}
                          title="No themes classified"
                          desc="AI automatically tags themes from customer review text."
                        />
                      )}
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

                  {feedbacks.length > 0 ? (
                    <div className="db-inbox-layout">
                      {/* Inbox List */}
                      <div className="db-inbox-list">
                        <div className="db-inbox-list-header">Streams ({feedbacks.length})</div>
                        {feedbacks.map((item, idx) => (
                          <div
                            key={item.id}
                            className={`db-inbox-item${selectedFeedbackIndex === idx ? ' active' : ''}`}
                            onClick={() => { setSelectedFeedbackIndex(idx); setReplySent(false); setCopiedDraft(false); }}
                          >
                            <div className="db-inbox-item-header">
                              <span className="db-inbox-customer">{item.customer}</span>
                              <span className={`db-badge db-badge-${item.sentiment || 'neutral'}`}>
                                {item.sentiment}
                              </span>
                            </div>
                            <p className="db-inbox-preview">{item.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Inbox Detail */}
                      <div className="db-inbox-detail">
                        <div className="db-inbox-detail-header">
                          <div className="db-inbox-detail-meta">
                            <span className="db-inbox-detail-name">{feedbacks[selectedFeedbackIndex]?.customer}</span>
                            <span className="db-badge db-badge-channel">{feedbacks[selectedFeedbackIndex]?.channel}</span>
                            <span className={`db-badge status-${feedbacks[selectedFeedbackIndex]?.status || 'NEW'}`}>
                              {feedbacks[selectedFeedbackIndex]?.status || 'NEW'}
                            </span>
                            <span className="db-inbox-detail-date">Ingested: {new Date(feedbacks[selectedFeedbackIndex]?.created_at).toLocaleString()}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <select 
                              className="db-input" 
                              style={{ width: '120px', height: '30px', padding: '0 8px', fontSize: '0.72rem' }}
                              value={feedbacks[selectedFeedbackIndex]?.status || 'NEW'}
                              onChange={e => handleUpdateStatus(feedbacks[selectedFeedbackIndex]?.id, e.target.value)}
                            >
                              <option value="NEW">New</option>
                              <option value="REVIEWED">Reviewed</option>
                              <option value="ACTIONED">Actioned</option>
                            </select>
                            <button className="db-btn db-btn-secondary" style={{ height: '30px', color: '#ff3c3c' }} onClick={() => handleDeleteFeedback(feedbacks[selectedFeedbackIndex]?.id)}>
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="db-inbox-detail-body">
                          <div className="db-inbox-signal-label">Review Comment</div>
                          <p className="db-inbox-signal-text" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>{feedbacks[selectedFeedbackIndex]?.text}</p>
                        </div>

                        <div className="db-inbox-ai-card">
                          <div className="db-inbox-ai-header">
                            <Sparkles size={12} />
                            AI Response Draft Generator
                          </div>
                          <div className="db-inbox-ai-body">
                            <p className="db-inbox-ai-text" style={{ fontSize: '0.82rem', opacity: 0.8 }}>
                              {feedbacks[selectedFeedbackIndex]?.sentiment === 'negative'
                                ? `Hi ${feedbacks[selectedFeedbackIndex]?.customer}, thank you for reporting your concerns regarding "${feedbacks[selectedFeedbackIndex]?.theme}". We have logged this index. Our team is working to resolve this issue as soon as possible.`
                                : `Hi ${feedbacks[selectedFeedbackIndex]?.customer}, thank you for your awesome feedback regarding "${feedbacks[selectedFeedbackIndex]?.theme}"! We are thrilled to hear you have had a positive experience.`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <EmptyState
                      icon={Inbox}
                      title="Inbox Empty"
                      desc="Incoming reviews will appear here. Connect the widget to start collecting feedback."
                    />
                  )}
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: ANALYTICS                      ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Analytics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h1 className="db-page-title">Analytics Engine</h1>
                    <p className="db-page-subtitle">Telemetry event streams and classifier indexes</p>
                  </div>
                  {feedbacks.length > 0 ? (
                    <div className="db-card" style={{ padding: '24px' }}>
                      <table className="db-table">
                        <thead>
                          <tr>
                            <th>Feedback Comment Snippet</th>
                            <th>Theme</th>
                            <th>Sentiment</th>
                            <th>Channel</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feedbacks.map(f => (
                            <tr key={f.id}>
                              <td style={{ color: 'var(--db-text-primary)' }}>{f.text.substring(0, 80)}...</td>
                              <td style={{ fontFamily: 'var(--db-font-mono)', fontSize: '0.72rem' }}>{f.theme}</td>
                              <td><span className={`db-badge db-badge-${f.sentiment}`}>{f.sentiment}</span></td>
                              <td>{f.channel}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState
                      icon={BarChart3}
                      title="No Analytics Available"
                      desc="Ingest feedback to populate lists and analytical metrics."
                    />
                  )}
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

                  {filteredThemes.length > 0 ? (
                    <div className="db-themes-grid">
                      {filteredThemes.map(theme => (
                        <div key={theme.id} className="db-theme-card">
                          <div className="db-theme-tag-label">Theme class</div>
                          <div className="db-theme-name">{theme.name}</div>
                          <div className="db-theme-footer">
                            <span className="db-theme-count">{theme.count} mentions</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={Tag}
                      title="No Themes Detected"
                      desc="Themes will automatically be extracted from your text inputs."
                    />
                  )}
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: ASK LOOP (CHAT)                ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Ask LOOP' && (
                <div className="db-chat-premium-container">
                  <AnimatePresence mode="wait">
                    {chatMessages.length === 0 ? (
                      <motion.div 
                        key="landing"
                        className="db-chat-landing"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)", transition: { duration: 0.3 } }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <motion.div 
                          className="db-chat-landing-logo"
                          animate={{ opacity: [0.7, 1, 0.7], y: [-2, 2, -2] }}
                          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        >
                          <Sparkles size={32} strokeWidth={1.5} />
                        </motion.div>
                        <h2 className="db-chat-landing-title">What would you like to analyze today?</h2>
                        <p className="db-chat-landing-subtitle">Ask questions about customer feedback, trends, reports and insights.</p>
                        
                        <div className="db-chat-landing-input-container">
                          <div className="db-premium-composer landing-composer">
                            <textarea 
                              className="db-premium-textarea"
                              placeholder="Ask LOOP anything..."
                              value={chatInput}
                              onChange={(e) => {
                                setChatInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = (e.target.scrollHeight) + 'px';
                              }}
                              onKeyDown={(e) => { 
                                if(e.key === 'Enter' && !e.shiftKey) { 
                                  e.preventDefault(); 
                                  handleSendChat(); 
                                } 
                              }}
                              rows={1}
                            />
                            <div className="db-premium-composer-footer">
                              <div className="db-premium-composer-actions-left">
                                <button className="db-premium-icon-btn"><Paperclip size={16} /></button>
                                <button className="db-premium-icon-btn" onClick={() => setShowModelModal(true)}>
                                  <Zap size={16} /> 
                                  <span style={{marginLeft: 6, fontSize: '11px', opacity: 0.7}}>{localStorage.getItem('loop_model') ? localStorage.getItem('loop_model').split('/')[1] : 'Model'}</span>
                                </button>
                              </div>
                              <button 
                                className={`db-premium-send-btn ${chatInput.trim() ? 'active' : ''}`}
                                onClick={() => handleSendChat()}
                                disabled={!chatInput.trim()}
                              >
                                <ArrowUpRight size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="db-chat-landing-suggestions">
                          {['Analyze recent feedback', 'Customer sentiment', 'Product pain points', 'Weekly summary', 'Feature requests', 'Churn analysis'].map((s, i) => (
                            <motion.button 
                              key={s} 
                              className="db-chat-suggestion-pill" 
                              onClick={() => handleSendChat(s)}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                              whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.08)' }}
                              whileTap={{ scale: 0.97 }}
                            >
                              {s}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="active-chat"
                        className="db-chat-active-workspace"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <div className="db-chat-premium-header">
                          <div className="db-chat-header-left">
                            <div className="db-chat-header-model-pill" onClick={() => setShowModelModal(true)}>
                              <Sparkles size={12} />
                              <span>{localStorage.getItem('loop_model') || 'Select Model'}</span>
                              <ChevronDown size={12} />
                            </div>
                          </div>
                          <div className="db-chat-header-right">
                            <button className="db-premium-icon-btn" onClick={() => setChatMessages([])} title="New Chat">
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="db-chat-premium-scroll">
                          <div className="db-chat-premium-messages">
                            {chatMessages.map((msg, idx) => (
                              <motion.div 
                                key={idx} 
                                className={`db-premium-msg-row ${msg.sender === 'user' ? 'user-row' : 'ai-row'}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {msg.sender === 'ai' && (
                                  <div className="db-premium-avatar ai-avatar">
                                    <Sparkles size={14} />
                                  </div>
                                )}
                                <div className={`db-premium-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                                  {msg.text.includes('```json:chart') ? (() => {
                                    const parts = msg.text.split('```json:chart');
                                    const beforeText = parts[0].replace('--- Thinking Process ---', '').trim();
                                    const jsonPart = parts[1].split('```')[0].trim();
                                    let chartData = [];
                                    try { chartData = JSON.parse(jsonPart); } catch(e){}
                                    
                                    return (
                                      <div>
                                        {beforeText && <div className="db-premium-msg-text" style={{ marginBottom: 16 }}>{beforeText}</div>}
                                        {chartData.length > 0 && (
                                          <div className="db-premium-chart-wrapper">
                                            <ResponsiveContainer width="100%" height="100%">
                                              <BarChart data={chartData}>
                                                <XAxis dataKey="name" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                                                <Tooltip cursor={{fill: 'rgba(255,255,255,0.03)'}} contentStyle={{backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff'}} />
                                                <Bar dataKey="value" fill="#ff3c3c" radius={[4, 4, 0, 0]} />
                                              </BarChart>
                                            </ResponsiveContainer>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })() : msg.text.includes('--- Thinking Process ---') ? (() => {
                                    const parts = msg.text.split('--- Response ---');
                                    const thinking = parts[0].replace('--- Thinking Process ---', '').trim();
                                    const resp = parts[1]?.trim() || '';
                                    return (
                                      <div>
                                        <details className="db-premium-thinking">
                                          <summary>Thinking Process</summary>
                                          <div className="db-premium-thinking-content">{thinking}</div>
                                        </details>
                                        <div className="db-premium-msg-text">{resp}</div>
                                      </div>
                                    );
                                  })() : (
                                    <div className="db-premium-msg-text">{msg.text}</div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                            {isSendingChat && (
                              <motion.div 
                                className="db-premium-msg-row ai-row"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                              >
                                <div className="db-premium-avatar ai-avatar"><Sparkles size={14} /></div>
                                <div className="db-premium-bubble ai-bubble typing-indicator">
                                  <span></span><span></span><span></span>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        <div className="db-chat-premium-composer-area">
                          <div className="db-premium-composer sticky-composer">
                            <textarea 
                              className="db-premium-textarea"
                              placeholder="Ask LOOP anything..."
                              value={chatInput}
                              onChange={(e) => {
                                setChatInput(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = (e.target.scrollHeight) + 'px';
                              }}
                              onKeyDown={(e) => { 
                                if(e.key === 'Enter' && !e.shiftKey) { 
                                  e.preventDefault(); 
                                  handleSendChat(); 
                                } 
                              }}
                              rows={1}
                            />
                            <div className="db-premium-composer-footer">
                              <div className="db-premium-composer-actions-left">
                                <button className="db-premium-icon-btn"><Paperclip size={16} /></button>
                                <button className="db-premium-icon-btn"><Mic size={16} /></button>
                              </div>
                              <button 
                                className={`db-premium-send-btn ${chatInput.trim() ? 'active' : ''}`}
                                onClick={() => handleSendChat()}
                                disabled={!chatInput.trim() || isSendingChat}
                              >
                                <ArrowUpRight size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="db-premium-composer-hint">
                            AI responses can make mistakes. Verify important data.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ╔══════════════════════════════════════╗
                  ║  TAB: REPORTS                        ║
                  ╚══════════════════════════════════════╝ */}
              {activeSidebarTab === 'Reports' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="db-page-header">
                    <div>
                      <h1 className="db-page-title">Workspace Briefings</h1>
                      <p className="db-page-subtitle">download structured feedback summaries</p>
                    </div>
                  </div>

                  {reports.length > 0 ? (
                    <div className="db-reports-grid">
                      {reports.map(r => (
                        <div key={r.id} className="db-report-card">
                          <div className="db-report-header">
                            <div className="db-report-title">{r.title}</div>
                            <span className="db-report-date">{r.date}</span>
                          </div>
                          <p className="db-report-summary">{r.summary}</p>
                          <button className="db-btn db-btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                            <Download size={13} /><span>Download PDF Summary</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={FileText}
                      title="No Reports Active"
                      desc="Reports calculate metrics from real feedback. Ingest feedback to activate."
                    />
                  )}
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
                          <span className="db-badge db-badge-channel">Workspace Administrator</span>
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
                        <span className="db-form-hint">Email address cannot be changed.</span>
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
                    <h1 className="db-page-title">Console Configurations</h1>
                    <p className="db-page-subtitle">Manage integration scripts, themes, and model parameters</p>
                  </div>

                  <div className="db-settings-layout">
                    <nav className="db-settings-nav">
                      {['General Settings', 'Theme & Appearance', 'Widget Integration & SDK', 'AI Model', 'Workspace Members'].map((item) => (
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
                          <label className="db-form-label">Workspace ID Token (API Key)</label>
                          <div className="db-form-static" style={{ fontFamily: 'var(--db-font-mono)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                            {user?.id || '00000000-0000-0000-0000-000000000000'}
                          </div>
                          <span className="db-form-hint">Use this ID token to authenticate SDK ingestion webhooks.</span>
                        </div>
                        <div className="db-form-group">
                          <label className="db-form-label">Workspace Administrator</label>
                          <input type="text" className="db-input" defaultValue={userFullName} />
                        </div>
                        <button className="db-btn db-btn-primary">Save Changes</button>
                      </div>
                    )}

                    {activeSettingsTab === 'Theme & Appearance' && (
                      <div className="db-settings-panel">
                        <div className="db-settings-section-title">Theme & Appearance Customization</div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--db-text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
                          Select your preferred color scheme. Your chosen theme persists across sessions.
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
                                <div className="db-theme-swatch-block" style={{ background: t.bg }} />
                                <div className="db-theme-swatch-block" style={{ background: t.surface }} />
                                <div className="db-theme-swatch-block" style={{ background: t.accent }} />
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

                    {activeSettingsTab === 'Widget Integration & SDK' && (
                      <div className="db-settings-panel">
                        <div className="db-settings-section-title">Integrate LOOP Into Your Website</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--db-text-muted)', lineHeight: '1.6', marginBottom: '18px' }}>
                          Add customer feedback widgets to your website to ingest logs. Copy this tracking script and place it inside the head tags of your site.
                        </p>

                        {/* Workspace ID Block */}
                        <div className="db-form-group" style={{ marginBottom: '24px' }}>
                          <label className="db-form-label">Your Workspace ID (User ID)</label>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input 
                              type="text" 
                              readOnly 
                              value={user?.id || '00000000-0000-0000-0000-000000000000'}
                              className="db-input"
                              style={{ flexGrow: 1, cursor: 'text', fontFamily: 'var(--db-font-mono)', fontSize: '0.85rem' }}
                            />
                            <button 
                              type="button" 
                              className="db-btn-primary"
                              onClick={() => {
                                navigator.clipboard.writeText(user?.id || '00000000-0000-0000-0000-000000000000');
                                alert("Workspace ID copied to clipboard!");
                              }}
                              style={{ whiteSpace: 'nowrap' }}
                            >
                              Copy ID
                            </button>
                          </div>
                          <p style={{ fontSize: '0.75rem', color: 'var(--db-text-muted)', marginTop: '8px' }}>
                            Use this ID in API endpoints or external tools to route reviews to your specific dashboard.
                          </p>
                        </div>

                        {/* Integration instructions snippet */}
                        <div className="db-form-group">
                          <label className="db-form-label">Embeddable Widget HTML Script</label>
                          <div style={{ position: 'relative' }}>
                            <pre style={{
                              background: 'rgba(0,0,0,0.3)',
                              border: '1px solid var(--db-border)',
                              borderRadius: '8px',
                              padding: '16px',
                              fontFamily: 'var(--db-font-mono)',
                              fontSize: '0.68rem',
                              color: '#fff',
                              overflowX: 'auto',
                              lineHeight: '1.5'
                            }}>
{`<!-- Place this code snippet before </body> on your website -->
<script 
  src="https://loop-intelligence.vercel.app/widget.js" 
  data-workspace-id="${user?.id || '00000000-0000-0000-0000-000000000000'}"
  async>
</script>`}
                            </pre>
                            <button 
                              type="button" 
                              onClick={() => {
                                navigator.clipboard.writeText(`<!-- Place this before </body> on your website -->\n<script \n  src="https://loop-intelligence.vercel.app/widget.js" \n  data-workspace-id="${user?.id || '00000000-0000-0000-0000-000000000000'}"\n  async>\n</script>`);
                                alert("Script snippet copied to clipboard!");
                              }}
                              style={{
                                position: 'absolute',
                                right: '12px',
                                top: '12px',
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.62rem',
                                color: 'rgba(255,255,255,0.6)'
                              }}
                            >
                              Copy Code
                            </button>
                          </div>
                        </div>

                        {/* REST Ingestion API details */}
                        <div className="db-form-group">
                          <label className="db-form-label">Direct REST API Ingestion Endpoint</label>
                          <pre style={{
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid var(--db-border)',
                            borderRadius: '8px',
                            padding: '16px',
                            fontFamily: 'var(--db-font-mono)',
                            fontSize: '0.68rem',
                            color: '#fff',
                            overflowX: 'auto',
                            lineHeight: '1.5'
                          }}>
{`POST /api/feedback/ingest
Content-Type: application/json

{
  "text": "Your customer review comment here...",
  "channel": "Website Widget",
  "customer": "Alex Rivera",
  "userId": "${user?.id || '00000000-0000-0000-0000-000000000000'}"
}`}
                          </pre>
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
                            API key configured — AI Classifier Active
                          </div>
                        )}
                      </div>
                    )}

                    {activeSettingsTab === 'Workspace Members' && (
                      <div className="db-settings-panel">
                        <div className="db-settings-section-title">Teammates & Role Configuration</div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--db-text-muted)', marginBottom: '18px', lineHeight: 1.5 }}>
                          Manage workspace membership and edit permissions. Roles: ADMIN (Full access), ANALYST (Ingest & manage data), VIEWER (Read-only access).
                        </p>

                        {/* Invite Member form (Admins only) */}
                        {role === 'ADMIN' ? (
                          <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--db-border)', borderRadius: 'var(--db-radius-sm)' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--db-text-primary)' }}>Invite Teammate</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input 
                                type="email" 
                                className="db-input" 
                                placeholder="teammate@company.com" 
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                                style={{ flex: 1 }}
                                required
                              />
                              <select 
                                className="db-input" 
                                value={inviteRole}
                                onChange={e => setInviteRole(e.target.value)}
                                style={{ width: '120px' }}
                              >
                                <option value="ANALYST">ANALYST</option>
                                <option value="VIEWER">VIEWER</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                              <button type="submit" className="db-btn db-btn-primary" disabled={inviteLoading}>
                                <UserPlus size={14} /> Add
                              </button>
                            </div>
                          </form>
                        ) : (
                          <div style={{ padding: '12px', background: 'rgba(255, 60, 60, 0.05)', border: '1px solid rgba(255, 60, 60, 0.15)', borderRadius: '8px', color: 'var(--db-text-muted)', fontSize: '0.75rem', marginBottom: '24px' }}>
                            Only Workspace ADMINs can manage members or roles.
                          </div>
                        )}

                        {/* Members List Table */}
                        <div style={{ overflowX: 'auto' }}>
                          <table className="db-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Role</th>
                                <th style={{ textAlign: 'left', padding: '10px' }}>Joined At</th>
                              </tr>
                            </thead>
                            <tbody>
                              {workspaceMembers.length === 0 ? (
                                <tr>
                                  <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--db-text-muted)', fontSize: '0.8rem' }}>
                                    No members found.
                                  </td>
                                </tr>
                              ) : (
                                workspaceMembers.map((m) => (
                                  <tr key={m.id} style={{ borderBottom: '1px solid var(--db-border-light)' }}>
                                    <td style={{ padding: '10px', fontSize: '0.8rem', color: 'var(--db-text-primary)' }}>
                                      {m.user_email || 'invited-user@loop.intel'} {m.user_id === user.id && <span style={{ fontSize: '0.7rem', color: '#ff3c3c', background: 'rgba(255, 60, 60, 0.1)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px' }}>You</span>}
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                      {role === 'ADMIN' && m.user_id !== user.id ? (
                                        <select 
                                          className="db-input"
                                          value={m.role}
                                          onChange={(e) => handleUpdateMemberRole(m.id, e.target.value)}
                                          style={{ width: '110px', padding: '4px 8px', fontSize: '0.75rem' }}
                                        >
                                          <option value="VIEWER">VIEWER</option>
                                          <option value="ANALYST">ANALYST</option>
                                          <option value="ADMIN">ADMIN</option>
                                        </select>
                                      ) : (
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: m.role === 'ADMIN' ? '#ff3c3c' : m.role === 'ANALYST' ? '#3b82f6' : '#94a3b8' }}>
                                          {m.role}
                                        </span>
                                      )}
                                    </td>
                                    <td style={{ padding: '10px', fontSize: '0.75rem', color: 'var(--db-text-muted)' }}>
                                      {new Date(m.created_at).toLocaleDateString()}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Loading Screen */}
          {loadingData && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px',
              fontFamily: 'var(--db-font-mono, monospace)',
              color: 'var(--db-text-muted)',
              fontSize: '0.8rem'
            }}>
              [ SYNCING CONSOLE TELEMETRY EVENTS... ]
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
