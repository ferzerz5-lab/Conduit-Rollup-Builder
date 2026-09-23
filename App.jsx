import { useState, useEffect } from "react";

const C = {
  bg: "#FAFAF9",
  white: "#FFFFFF",
  black: "#0A0A0A",
  card: "#F4F4F2",
  border: "#E5E5E0",
  purple: "#7C3AED",
  purpleLight: "#F5F0FF",
  purpleMid: "#DDD6FE",
  amber: "#D97706",
  amberLight: "#FFFBEB",
  green: "#059669",
  greenLight: "#ECFDF5",
  red: "#DC2626",
  text: "#0A0A0A",
  muted: "#6B7280",
  dim: "#9CA3AF",
};

const USE_CASES = [
  { id: "defi", label: "DeFi Protocol", icon: "◈", desc: "Lending, DEX, perps, yield vaults", recommended: { framework: "op", da: "ethereum", settlement: "ethereum", sequencer: "g3", gas: "eth", apps: ["bridge", "oracle", "aa", "explorer"] } },
  { id: "gaming", label: "Gaming & Consumer", icon: "◎", desc: "High throughput, low latency, many users", recommended: { framework: "op", da: "celestia", settlement: "ethereum", sequencer: "g3", gas: "custom", apps: ["bridge", "aa", "explorer", "faucet"] } },
  { id: "rwa", label: "RWA & Enterprise", icon: "◆", desc: "Tokenized assets, compliance, institutions", recommended: { framework: "orbit", da: "ethereum", settlement: "ethereum", sequencer: "standard", gas: "usdc", apps: ["bridge", "oracle", "kyc", "explorer"] } },
  { id: "nft", label: "NFT Platform", icon: "✦", desc: "Minting, trading, creator economy", recommended: { framework: "op", da: "celestia", settlement: "base", sequencer: "standard", gas: "eth", apps: ["bridge", "explorer", "aa", "indexer"] } },
  { id: "ecosystem", label: "Ecosystem Chain", icon: "⬡", desc: "Launch a chain for your community", recommended: { framework: "op", da: "celestia", settlement: "base", sequencer: "standard", gas: "custom", apps: ["bridge", "explorer", "faucet", "aa"] } },
];

const FRAMEWORKS = [
  { id: "op", label: "OP Stack", badge: "Most popular", desc: "Battle-tested, Superchain compatible. Used by Base, Mode, Lyra." },
  { id: "orbit", label: "Arbitrum Orbit", badge: "Enterprise", desc: "Arbitrum ecosystem with AnyTrust support for ultra-low fees." },
  { id: "succinct", label: "OP Succinct", badge: "ZK-powered", desc: "OP Stack with ZK proofs replacing fault proofs. Stage 2 security." },
];

const DA_LAYERS = [
  { id: "ethereum", label: "Ethereum", badge: "Max security", desc: "Post calldata directly to Ethereum L1. Most secure, highest cost." },
  { id: "celestia", label: "Celestia", badge: "Cost efficient", desc: "Dedicated DA layer. 10–100x cheaper than Ethereum calldata." },
  { id: "eigenda", label: "EigenDA", badge: "Restaked security", desc: "Backed by EigenLayer restakers. Ethereum security, lower costs." },
];

const SETTLEMENT_LAYERS = [
  { id: "ethereum", label: "Ethereum", badge: "Max security", desc: "Settle proofs and withdrawals on Ethereum L1." },
  { id: "base", label: "Base", badge: "Superchain", desc: "Settle on Base. Lower fees, faster finality, Superchain access." },
];

const SEQUENCERS = [
  { id: "g3", label: "G3 Sequencer", badge: "Conduit exclusive", desc: "100Mgas/s. Fastest sequencer in the world. Powers Gravity (28.9M users) and Pirate Nation (10K concurrent players)." },
  { id: "standard", label: "Standard Sequencer", badge: "Default", desc: "Production-grade, managed by Conduit. Reliable, autoscaling, zero ops." },
];

const GAS_TOKENS = [
  { id: "eth", label: "ETH", desc: "Standard gas token" },
  { id: "custom", label: "Custom Token", desc: "Your protocol token" },
  { id: "usdc", label: "USDC", desc: "Stablecoin gas" },
];

const MARKETPLACE_APPS = [
  { id: "bridge", label: "Native Bridge", icon: "⟷", desc: "Bridge UI auto-deployed" },
  { id: "explorer", label: "Block Explorer", icon: "◎", desc: "Live on launch" },
  { id: "aa", label: "Account Abstraction", icon: "◈", desc: "Embedded wallets, paymasters" },
  { id: "oracle", label: "Price Oracle", icon: "◆", desc: "Chainlink or Pyth feeds" },
  { id: "indexer", label: "Indexer", icon: "⟳", desc: "Searchable onchain data" },
  { id: "faucet", label: "Testnet Faucet", icon: "◉", desc: "Token faucet for devs" },
  { id: "kyc", label: "KYC / Compliance", icon: "✓", desc: "Identity verification" },
];

// Conduit's actual flower/snowflake logo
function ConduitLogo({ size = 32 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" fill={C.black} rx="10" />
      <circle cx="50" cy="22" r="14" fill="white" />
      <circle cx="50" cy="78" r="14" fill="white" />
      <circle cx="22" cy="36" r="14" fill="white" />
      <circle cx="78" cy="36" r="14" fill="white" />
      <circle cx="22" cy="64" r="14" fill="white" />
      <circle cx="78" cy="64" r="14" fill="white" />
      <polygon points="50,35 42,50 58,50" fill={C.black} />
      <polygon points="50,65 42,50 58,50" fill={C.black} />
    </svg>
  );
}

function OptionCard({ option, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", padding: "14px 16px",
      background: selected ? C.purpleLight : C.white,
      border: `1.5px solid ${selected ? C.purple : C.border}`,
      borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: selected ? C.purple : C.text }}>{option.label}</span>
        {option.badge && (
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.06em",
            color: selected ? C.purple : C.muted,
            background: selected ? C.purpleMid : C.card,
            padding: "2px 7px", borderRadius: 10,
          }}>{option.badge}</span>
        )}
      </div>
      <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>{option.desc}</div>
    </button>
  );
}

function StackCard({ config, useCase }) {
  const uc = USE_CASES.find(u => u.id === useCase);
  const fw = FRAMEWORKS.find(f => f.id === config.framework);
  const da = DA_LAYERS.find(d => d.id === config.da);
  const sl = SETTLEMENT_LAYERS.find(s => s.id === config.settlement);
  const seq = SEQUENCERS.find(s => s.id === config.sequencer);
  const gas = GAS_TOKENS.find(g => g.id === config.gas);
  const apps = MARKETPLACE_APPS.filter(a => config.apps.includes(a.id));

  return (
    <div style={{ background: C.black, borderRadius: 12, overflow: "hidden" }}>
      <div style={{
        padding: "20px 24px",
        background: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 60%, #D97706 100%)",
      }}>
        <div style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", marginBottom: 6 }}>YOUR CHAIN STACK</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>{uc?.label} on Conduit</div>
      </div>
      <div style={{ padding: 20 }}>
        {[
          { label: "Framework", value: fw?.label },
          { label: "Data Availability", value: da?.label },
          { label: "Settlement", value: sl?.label },
          { label: "Sequencer", value: seq?.label },
          { label: "Gas Token", value: gas?.label },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid #1F2937" }}>
            <span style={{ fontSize: 11, color: "#6B7280" }}>{row.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#F9FAFB" }}>{row.value}</span>
          </div>
        ))}
        <div style={{ paddingTop: 14 }}>
          <div style={{ fontSize: 10, color: "#6B7280", letterSpacing: "0.08em", marginBottom: 8 }}>MARKETPLACE APPS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {apps.map(a => (
              <span key={a.id} style={{ fontSize: 10, fontWeight: 600, color: "#34D399", background: "#064E3B", padding: "3px 9px", borderRadius: 10 }}>
                {a.icon} {a.label}
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 14, padding: "12px 14px", background: "#1F2937", borderRadius: 6 }}>
          <div style={{ fontSize: 9, color: "#9CA3AF", letterSpacing: "0.1em", marginBottom: 6 }}>CONDUIT HANDLES</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Deployment", "Upgrades", "RPC scaling", "99.9% uptime", "Security", "Monitoring", "DA integration", "Bridge", "Metrics"].map((h, i) => (
              <span key={i} style={{ fontSize: 10, color: "#9CA3AF" }}>✓ {h}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [useCase, setUseCase] = useState(null);
  const [config, setConfig] = useState({ framework: null, da: null, settlement: null, sequencer: null, gas: null, apps: [] });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const applyRecommended = (ucId) => {
    const uc = USE_CASES.find(u => u.id === ucId);
    if (uc) setConfig(uc.recommended);
  };

  const toggleApp = (id) => {
    setConfig(prev => ({
      ...prev,
      apps: prev.apps.includes(id) ? prev.apps.filter(a => a !== id) : [...prev.apps, id],
    }));
  };

  const reset = () => {
    setStep(0);
    setUseCase(null);
    setConfig({ framework: null, da: null, settlement: null, sequencer: null, gas: null, apps: [] });
  };

  const steps = ["Use case", "Stack", "Apps", "Your chain"];

  const canProceedStep1 = config.framework && config.da && config.settlement && config.sequencer && config.gas;

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', -apple-system, sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        button:focus{outline:none}
        a{text-decoration:none}
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(250,250,249,0.96)" : C.bg,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 32px", height: 56,
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: "auto" }}>
          <ConduitLogo size={30} />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.02em" }}>Conduit</span>
          <span style={{ fontSize: 11, color: C.muted, padding: "2px 8px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 4, fontFamily: "monospace" }}>Rollup Builder</span>
        </div>
        <div style={{ fontSize: 11, color: C.muted }}>300+ chains deployed · $1.2B+ TVL</div>
        <a href="https://conduit.xyz" target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 600, color: C.white, background: C.black, padding: "7px 16px", borderRadius: 6 }}>
          Launch your chain →
        </a>
      </nav>

      {/* HERO */}
      <div style={{
        padding: "60px 32px 44px", textAlign: "center",
        borderBottom: `1px solid ${C.border}`,
        background: `linear-gradient(180deg, ${C.purpleLight} 0%, ${C.bg} 100%)`,
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 600, color: C.purple, background: C.white, border: `1px solid ${C.purpleMid}`, padding: "5px 12px", borderRadius: 20, marginBottom: 22 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 2s infinite" }} />
          G3 Sequencer · OP Stack · Arbitrum Orbit · OP Succinct
        </div>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: 14, color: C.black }}>
          Build your rollup stack.
        </h1>
        <p style={{ fontSize: 15, color: C.muted, maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.65 }}>
          Pick your use case, configure your stack, and see exactly what Conduit handles so you can focus on building the product.
        </p>

        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, maxWidth: 480, margin: "0 auto" }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: step > i ? C.green : step === i ? C.black : C.white,
                  border: `2px solid ${step > i ? C.green : step === i ? C.black : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  color: step > i || step === i ? C.white : C.dim,
                  transition: "all 0.3s",
                }}>
                  {step > i ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 9, color: step >= i ? C.muted : C.dim, whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: 2, background: step > i ? C.green : C.border, margin: "0 6px", marginBottom: 18, transition: "background 0.3s" }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 32px" }}>

        {/* STEP 0 */}
        {step === 0 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>What are you building?</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
              {USE_CASES.map(uc => (
                <button key={uc.id} onClick={() => setUseCase(uc.id)} style={{
                  padding: "20px 16px", textAlign: "left",
                  background: useCase === uc.id ? C.purpleLight : C.white,
                  border: `1.5px solid ${useCase === uc.id ? C.purple : C.border}`,
                  borderRadius: 10, cursor: "pointer", transition: "all 0.15s",
                }}>
                  <div style={{ fontSize: 24, marginBottom: 10, color: useCase === uc.id ? C.purple : C.black }}>{uc.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: useCase === uc.id ? C.purple : C.black, marginBottom: 5 }}>{uc.label}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{uc.desc}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => { if (useCase) { applyRecommended(useCase); setStep(1); } }}
              disabled={!useCase}
              style={{
                padding: "12px 28px",
                background: useCase ? C.black : C.card,
                color: useCase ? C.white : C.dim,
                border: `1.5px solid ${useCase ? C.black : C.border}`,
                borderRadius: 8, cursor: useCase ? "pointer" : "not-allowed",
                fontSize: 13, fontWeight: 600, transition: "all 0.2s",
              }}
            >
              {useCase ? "Configure stack →" : "Select a use case first"}
            </button>
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>Configure your stack</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Rollup Framework</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {FRAMEWORKS.map(f => <OptionCard key={f.id} option={f} selected={config.framework === f.id} onClick={() => setConfig(p => ({ ...p, framework: f.id }))} />)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Data Availability</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {DA_LAYERS.map(d => <OptionCard key={d.id} option={d} selected={config.da === d.id} onClick={() => setConfig(p => ({ ...p, da: d.id }))} />)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Settlement Layer</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SETTLEMENT_LAYERS.map(s => <OptionCard key={s.id} option={s} selected={config.settlement === s.id} onClick={() => setConfig(p => ({ ...p, settlement: s.id }))} />)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Sequencer</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {SEQUENCERS.map(s => <OptionCard key={s.id} option={s} selected={config.sequencer === s.id} onClick={() => setConfig(p => ({ ...p, sequencer: s.id }))} />)}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Gas Token</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {GAS_TOKENS.map(g => (
                    <button key={g.id} onClick={() => setConfig(p => ({ ...p, gas: g.id }))} style={{
                      flex: 1, padding: "10px 8px", textAlign: "center",
                      background: config.gas === g.id ? C.purpleLight : C.white,
                      border: `1.5px solid ${config.gas === g.id ? C.purple : C.border}`,
                      borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: config.gas === g.id ? C.purple : C.black, marginBottom: 2 }}>{g.label}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(0)} style={{ padding: "11px 20px", background: C.white, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer", fontSize: 13 }}>← Back</button>
              <button
                onClick={() => { if (canProceedStep1) setStep(2); }}
                disabled={!canProceedStep1}
                style={{
                  padding: "11px 24px",
                  background: canProceedStep1 ? C.black : C.card,
                  color: canProceedStep1 ? C.white : C.dim,
                  border: `1.5px solid ${canProceedStep1 ? C.black : C.border}`,
                  borderRadius: 6, cursor: canProceedStep1 ? "pointer" : "not-allowed",
                  fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                }}
              >
                Add marketplace apps →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Add marketplace apps</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>Deploy these alongside your chain in one click. All managed by Conduit.</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 28 }}>
              {MARKETPLACE_APPS.map(app => {
                const sel = config.apps.includes(app.id);
                return (
                  <button key={app.id} onClick={() => toggleApp(app.id)} style={{
                    padding: "16px 12px", textAlign: "left",
                    background: sel ? C.greenLight : C.white,
                    border: `1.5px solid ${sel ? C.green : C.border}`,
                    borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{app.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: sel ? C.green : C.black, marginBottom: 3 }}>{app.label}</div>
                    <div style={{ fontSize: 10, color: C.muted, lineHeight: 1.4 }}>{app.desc}</div>
                    {sel && <div style={{ marginTop: 8, fontSize: 9, color: C.green, fontWeight: 700, letterSpacing: "0.06em" }}>ADDED ✓</div>}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ padding: "11px 20px", background: C.white, color: C.muted, border: `1px solid ${C.border}`, borderRadius: 6, cursor: "pointer", fontSize: 13 }}>← Back</button>
              <button
                onClick={() => { if (config.apps.length > 0) setStep(3); }}
                disabled={config.apps.length === 0}
                style={{
                  padding: "11px 24px",
                  background: config.apps.length > 0 ? C.black : C.card,
                  color: config.apps.length > 0 ? C.white : C.dim,
                  border: `1.5px solid ${config.apps.length > 0 ? C.black : C.border}`,
                  borderRadius: 6, cursor: config.apps.length > 0 ? "pointer" : "not-allowed",
                  fontSize: 13, fontWeight: 600, transition: "all 0.2s",
                }}
              >
                See your chain →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 20 }}>Your chain stack</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <StackCard config={config} useCase={useCase} />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>You focus on</div>
                  {["Your smart contracts", "Your product UX", "Your users", "Your token design", "Your go-to-market"].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
                      <span style={{ color: C.purple, fontSize: 12, fontWeight: 700 }}>→</span>
                      <span style={{ fontSize: 12, color: C.text }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>Chains built like yours</div>
                  {[
                    { name: "Plume", note: "Most RWA holders in 6 months" },
                    { name: "Pirate Nation", note: "10K+ concurrent players" },
                    { name: "Gravity (Galxe)", note: "28.9M users · 50ms latency" },
                    { name: "Mode", note: "Superchain L2, growing fast" },
                    { name: "Lyra", note: "DeFi options, shipped on time" },
                  ].map((chain, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, marginBottom: 8, borderBottom: i < 4 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>{chain.name}</span>
                      <span style={{ fontSize: 11, color: C.muted }}>{chain.note}</span>
                    </div>
                  ))}
                </div>
                <a href="https://app.conduit.xyz" target="_blank" rel="noreferrer" style={{
                  display: "block", textAlign: "center", padding: "14px",
                  background: C.black, color: C.white, borderRadius: 8,
                  fontSize: 13, fontWeight: 700,
                }}>
                  Launch this chain on Conduit →
                </a>
                <button onClick={reset} style={{ padding: "10px", background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 8, cursor: "pointer", fontSize: 12 }}>
                  Start over
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, marginTop: 40, background: C.white }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: "auto" }}>
          <ConduitLogo size={22} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>Conduit</span>
        </div>
        <span style={{ fontSize: 11, color: C.muted }}>Enterprise rollup infrastructure · conduit.xyz</span>
        <a href="https://x.com/ferz_erz00" target="_blank" rel="noreferrer" style={{ fontSize: 11, fontWeight: 600, color: C.purple, padding: "4px 10px", background: C.purpleLight, border: `1px solid ${C.purpleMid}`, borderRadius: 4 }}>
          Built by Ferz ↗
        </a>
      </footer>
    </div>
  );
}
