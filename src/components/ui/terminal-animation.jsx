import React, { createContext, useContext, useState, useEffect } from 'react';

const TerminalAnimationContext = createContext(null);

export const useTerminalAnimation = () => {
  const context = useContext(TerminalAnimationContext);
  if (!context) {
    throw new Error('useTerminalAnimation must be used within a TerminalAnimationRoot');
  }
  return context;
};

export const TerminalAnimationRoot = ({
  children,
  tabs = [],
  defaultActiveTab = 0,
  hideCursorOnComplete = false,
  alwaysDark = true,
  backgroundImage,
  className
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [currentCommandTyped, setCurrentCommandTyped] = useState('');
  const [visibleLines, setVisibleLines] = useState([]);
  const [isTyping, setIsTyping] = useState(true);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let active = true;

    const runAnimation = async () => {
      // 1. Reset state
      setCurrentCommandTyped('');
      setVisibleLines([]);
      setIsTyping(true);
      setComplete(false);

      const tab = tabs[activeTab];
      if (!tab) return;

      // Small initial wait before typing starts
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (!active) return;

      // 2. Typing the command
      const command = tab.command;
      for (let i = 0; i <= command.length; i++) {
        if (!active) return;
        setCurrentCommandTyped(command.slice(0, i));
        // Type each character at a speed of 55ms
        await new Promise((resolve) => setTimeout(resolve, 55));
      }

      setIsTyping(false);

      // 3. Print lines
      const lines = tab.lines || [];
      for (let i = 0; i < lines.length; i++) {
        if (!active) return;
        const line = lines[i];
        await new Promise((resolve) => setTimeout(resolve, line.delay || 100));
        if (!active) return;
        setVisibleLines((prev) => [...prev, line]);
      }

      // 4. Mark complete
      setComplete(true);
    };

    runAnimation();

    return () => {
      active = false;
    };
  }, [activeTab, tabs]);

  const value = {
    activeTab,
    setActiveTab,
    currentCommandTyped,
    visibleLines,
    isTyping,
    complete,
    hideCursorOnComplete
  };

  return (
    <TerminalAnimationContext.Provider value={value}>
      <div
        className={`terminal-animation-root ${className || ''}`}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {children}
      </div>
    </TerminalAnimationContext.Provider>
  );
};

export const TerminalAnimationBackgroundGradient = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-50 blur-3xl pointer-events-none z-0" />
  );
};

export const TerminalAnimationContainer = ({ children, className }) => {
  return (
    <div className={`terminal-anim-container w-full z-10 ${className || ''}`}>
      {children}
    </div>
  );
};

export const TerminalAnimationWindow = ({ children, className }) => {
  return (
    <div className={`terminal-anim-window w-full rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md overflow-hidden ${className || ''}`}>
      {/* Top Window Bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 select-none bg-black/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="flex-1 text-center font-mono text-[11px] text-white/40 font-medium">bash</div>
      </div>
      {children}
    </div>
  );
};

export const TerminalAnimationContent = ({ children, className }) => {
  return (
    <div className={`terminal-anim-content p-6 font-mono text-left text-white/90 overflow-y-auto ${className || ''}`}>
      {children}
    </div>
  );
};

export const TerminalAnimationCommandBar = ({ className, cursor }) => {
  const { currentCommandTyped } = useTerminalAnimation();
  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      <span>{currentCommandTyped}</span>
      {cursor}
    </div>
  );
};

export const TerminalAnimationBlinkingCursor = () => {
  const { complete, hideCursorOnComplete } = useTerminalAnimation();
  if (complete && hideCursorOnComplete) return null;
  return (
    <span className="terminal-cursor w-[8px] h-[15px] bg-[#6FF7CC] animate-pulse inline-block align-middle ml-[2px]" />
  );
};

export const TerminalAnimationOutput = ({ className, renderLine }) => {
  const { visibleLines } = useTerminalAnimation();
  return (
    <div className={className}>
      {visibleLines.map((line, i) => renderLine(line, i, true))}
    </div>
  );
};

export const TerminalAnimationTrailingPrompt = ({ children, className }) => {
  const { complete } = useTerminalAnimation();
  if (!complete) return null;
  return <div className={className}>{children}</div>;
};

export const TerminalAnimationTabList = ({ children, className }) => {
  return (
    <div className={`terminal-tab-list ${className || ''}`}>
      {children}
    </div>
  );
};

export const TerminalAnimationTabTrigger = ({ children, index, className }) => {
  const { activeTab, setActiveTab } = useTerminalAnimation();
  const isActive = activeTab === index;
  return (
    <button
      onClick={() => setActiveTab(index)}
      data-state={isActive ? 'active' : 'inactive'}
      className={`terminal-tab-trigger ${className || ''}`}
      type="button"
    >
      {children}
    </button>
  );
};

export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

const backgroundImage = "/component-images/terminal-animation/terminal-animation-bg-2.png";

const tabs = [
  {
    label: "shell",
    command: "npm i @loop/sdk && npx loop init",
    lines: [
      { text: "", delay: 80 },
      {
        text: "added 1 package, and audited 128 packages in 1.2s",
        color: "text-[#6FF7CC]",
        delay: 350,
      },
      {
        text: "  ▲ Loop Configuration CLI v0.1.2",
        color: "text-slate-300",
        delay: 200,
      },
      {
        text: "  ✓ API Key lp_live_83b1c authorized",
        color: "text-[#6FF7CC]",
        delay: 150,
      },
      {
        text: "  ✓ Generated config file at ./loop.config.json",
        color: "text-[#6FF7CC]",
        delay: 150,
      },
      {
        text: "  ✓ Ingestion node connection: active [region: us-west-1]",
        color: "text-[#6FF7CC]",
        delay: 150,
      },
      { text: "", delay: 80 },
      {
        text: "  found 0 vulnerabilities",
        color: "text-[#ADFA1F]",
        delay: 200,
      },
    ],
  },
  {
    label: "node.js",
    command: "node quickstart.js",
    lines: [
      { text: "", delay: 80 },
      { text: "  Booting Loop telemetry node (Node.js SDK)...", color: "text-slate-400", delay: 200 },
      { text: "", delay: 80 },
      {
        text: "  > Ingesting event user_signup_pipeline...",
        color: "text-[#ED42B5]",
        delay: 300,
      },
      {
        text: "  > Guardrail check: PASSED (model response safe)",
        color: "text-[#ADFA1F]",
        delay: 250,
      },
      {
        text: "  > Log ingested (userId: 932) on node lp_edge_5",
        color: "text-slate-300",
        delay: 200,
      },
      { text: "", delay: 80 },
      {
        text: "  ✓ 1 trace telemetry payload dispatched successfully",
        color: "text-[#6FF7CC]",
        delay: 250,
      },
    ],
  },
  {
    label: "python",
    command: "python quickstart.py",
    lines: [
      { text: "", delay: 80 },
      { text: "  Initializing Loop Telemetry (Python SDK)...", color: "text-slate-400", delay: 200 },
      { text: "", delay: 80 },
      {
        text: "  > loop.track('user_signup_pipeline', {'user_id': 932})",
        color: "text-[#ED42B5]",
        delay: 300,
      },
      {
        text: "  > Ingestion payload status: OK",
        color: "text-[#6FF7CC]",
        delay: 250,
      },
      {
        text: "  > Active edge node connection established",
        color: "text-slate-300",
        delay: 200,
      },
      { text: "", delay: 80 },
      {
        text: "  ✓ Telemetry stream active and healthy",
        color: "text-[#ADFA1F]",
        delay: 250,
      },
    ],
  },
  {
    label: "rust",
    command: "cargo run --bin quickstart",
    lines: [
      { text: "", delay: 80 },
      {
        text: "   Compiling loop-client v0.1.0",
        color: "text-slate-300",
        delay: 300,
      },
      {
        text: "    Finished dev [unoptimized + debuginfo] target(s) in 0.8s",
        color: "text-slate-400",
        delay: 250,
      },
      {
        text: "     Running target/debug/quickstart",
        color: "text-[#ED42B5]",
        delay: 200,
      },
      { text: "", delay: 80 },
      {
        text: "  > loop_client.track('user_signup_pipeline', json!({'user_id': 932}))",
        color: "text-slate-400",
        delay: 150,
      },
      {
        text: "  ✓ Response Status: 200 OK (Trace Ingested)",
        color: "text-[#6FF7CC]",
        delay: 200,
      },
    ],
  },
];

export function TerminalAnimationDemo() {
  return (
    <TerminalAnimationRoot
      alwaysDark={true}
      className="relative flex w-full justify-center overflow-clip bg-transparent"
      defaultActiveTab={1}
      hideCursorOnComplete={false}
      tabs={tabs}
    >
      <TerminalAnimationContainer className="max-w-[43rem]">
        <TerminalAnimationWindow className="outline-1 outline-white/30 outline-offset-[2px]">
          <TerminalAnimationContent className="min-h-[26rem]">
            <div className="flex items-center gap-2 leading-relaxed">
              <span className="select-none font-mono text-muted-foreground text-[10px] md:text-sm">
                $
              </span>
              <TerminalAnimationCommandBar
                className="font-mono text-foreground text-[10px] md:text-sm"
                cursor={<TerminalAnimationBlinkingCursor />}
              />
            </div>

            <TerminalAnimationOutput
              className="mt-1"
              renderLine={(line, _i, visible) => {
                if (!visible) {
                  return null;
                }
                return (
                  <div className="leading-relaxed">
                    <span
                      className={cn(
                        "font-mono text-[10px] md:text-sm",
                        line.color ?? "text-muted-foreground"
                      )}
                    >
                      {line.text || "\u00A0"}
                    </span>
                  </div>
                );
              }}
            />
            <TerminalAnimationTrailingPrompt className="mt-1 flex items-center gap-2 leading-relaxed">
              <span className="select-none font-mono text-muted-foreground text-sm">
                $
              </span>
              <TerminalAnimationBlinkingCursor />
            </TerminalAnimationTrailingPrompt>
          </TerminalAnimationContent>

          <div className="flex justify-center pb-6">
            <TerminalAnimationTabList className="inline-flex items-center gap-0 rounded-lg border border-border bg-muted/50 px-1 py-1">
              {tabs.map((tab, i) => (
                <TerminalAnimationTabTrigger
                  className={cn(
                    "cursor-pointer rounded-md px-3.5 py-1 font-mono text-sm transition-all duration-150",
                    "data-[state=active]:bg-primary data-[state=active]:font-medium data-[state=active]:text-primary-foreground",
                    "data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
                  )}
                  index={i}
                  key={tab.label}
                >
                  {tab.label}
                </TerminalAnimationTabTrigger>
              ))}
            </TerminalAnimationTabList>
          </div>
        </TerminalAnimationWindow>
      </TerminalAnimationContainer>
    </TerminalAnimationRoot>
  );
}
