import { useEffect, useState } from "react"

type Component = { id: string; name: string; value: string; status: string; interactive: boolean }
type UpgradePath = { id: string; title: string; current: string; proposed: string; changes: string[]; stays_reusable: string[]; note: string; source_url: string }
type Prototype = { model: { name: string; subtitle: string; source_url: string }; components: Component[]; current_memory: string; upgrade_paths: UpgradePath[] }
type Screen = "welcome" | "memory" | "detail"

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome")
  const [prototype, setPrototype] = useState<Prototype | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/prototype?memory_gb=16")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("The prototype data could not be loaded.")))
      .then(setPrototype)
      .catch((requestError: Error) => setError(requestError.message))
  }, [])

  if (error) return <main className="shell"><p className="eyebrow">Framework Upgrade Planner</p><h1>We couldn’t load your machine.</h1><p>{error}</p></main>
  if (!prototype) return <main className="shell loading"><span className="pulse" /> Loading your Framework…</main>

  const memory = prototype.components.find((component) => component.id === "memory")!
  const upgrade = prototype.upgrade_paths[0]

  return (
    <main className="shell">
      <header className="topbar"><span className="brand-mark">F</span><span>Framework Upgrade Planner</span><span className="prototype-label">Prototype</span></header>
      {screen === "welcome" && <Welcome model={prototype.model} onContinue={() => setScreen("memory")} />}
      {screen === "memory" && <MachineView prototype={prototype} memory={memory} onOpenMemory={() => setScreen("detail")} />}
      {screen === "detail" && <UpgradeDetail model={prototype.model} upgrade={upgrade} onBack={() => setScreen("memory")} />}
    </main>
  )
}

function Welcome({ model, onContinue }: { model: Prototype["model"]; onContinue: () => void }) {
  return <section className="welcome">
    <div className="hero-copy"><p className="eyebrow">A clearer path forward</p><h1>Understand what your Framework can become.</h1><p className="lede">Start with the machine you already own. This short walkthrough focuses on one upgrade path so you can see what changes and what stays yours.</p></div>
    <div className="choice-card"><p className="card-kicker">Let’s identify your machine</p><h2>Do you have a Framework Laptop 13?</h2><p className="muted">We’ll use a focused memory upgrade example for this prototype.</p><button className="primary" onClick={onContinue}>Yes, continue <span>→</span></button></div>
    <p className="source-note">Product facts are based on <a href={model.source_url} target="_blank">Framework’s public Laptop 13 specifications</a>.</p>
  </section>
}

function MachineView({ prototype, memory, onOpenMemory }: { prototype: Prototype; memory: Component; onOpenMemory: () => void }) {
  return <section className="machine-view">
    <div className="section-intro"><p className="eyebrow">Your Framework</p><h1>{prototype.model.name}</h1><p className="lede">A living view of the parts that make up your machine. Start with the highlighted component.</p></div>
    <div className="machine-meta"><span className="status-dot" /> Identified configuration <strong>{prototype.current_memory} memory</strong></div>
    <div className="component-grid">{prototype.components.map((component) => component.interactive ? <button className="component-card active" key={component.id} onClick={onOpenMemory}><span className="component-icon">✦</span><span className="component-name">{component.name}</span><strong>{component.value}</strong><span className="component-status">{component.status} <span>→</span></span></button> : <div className="component-card" key={component.id}><span className="component-icon">○</span><span className="component-name">{component.name}</span><strong>{component.value}</strong><span className="component-status">{component.status}</span></div>)}</div>
    <p className="footnote">Only Memory is interactive in this focused prototype. The surrounding cards show what remains part of your machine.</p>
  </section>
}

function UpgradeDetail({ model, upgrade, onBack }: { model: Prototype["model"]; upgrade: UpgradePath; onBack: () => void }) {
  return <section className="detail-view">
    <button className="back-button" onClick={onBack}>← Your Framework</button>
    <div className="detail-heading"><p className="eyebrow">Memory · compatible path</p><h1>{upgrade.title}</h1><p className="lede">A focused change to one component, with the rest of your machine staying in view.</p></div>
    <div className="upgrade-hero"><div><span className="label">Current</span><strong>{upgrade.current}</strong></div><span className="arrow">→</span><div><span className="label">Explore</span><strong>{upgrade.proposed}</strong></div></div>
    <div className="detail-columns"><div className="detail-panel"><span className="panel-icon">↗</span><h2>What changes</h2>{upgrade.changes.map((change) => <p key={change}>{change}</p>)}</div><div className="detail-panel reuse"><span className="panel-icon">◌</span><h2>What stays reusable</h2><div className="reuse-list">{upgrade.stays_reusable.map((item) => <span key={item}>✓ {item}</span>)}</div></div></div>
    <p className="note">{upgrade.note} <a href={model.source_url} target="_blank">View source</a></p>
  </section>
}
