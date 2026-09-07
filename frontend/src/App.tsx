import { useEffect, useState } from "react"

type Component = { id: string; name: string; value: string }
type UpgradePath = { id: string; component_id: string; title: string; current: string; proposed: string; benefit: string; changes: string[]; stays_reusable: string[]; source_url: string }
type Prototype = { model: { name: string; subtitle: string; source_url: string }; components: Component[]; identified_configuration: string; upgrade_paths: UpgradePath[] }

const icons: Record<string, string> = { memory: "✦", storage: "▣", "expansion-cards": "◈", keyboard: "⌨" }

export default function App() {
  const [prototype, setPrototype] = useState<Prototype | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/prototype")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("The prototype data could not be loaded.")))
      .then(setPrototype)
      .catch((requestError: Error) => setError(requestError.message))
  }, [])

  if (error) return <main className="shell"><p className="eyebrow">Framework Upgrade Planner</p><h1>We couldn’t load your machine.</h1><p>{error}</p></main>
  if (!prototype) return <main className="shell loading"><span className="pulse" /> Reading your Framework configuration…</main>

  return <main className="shell">
    <header className="topbar"><span className="brand-mark">F</span><span>Framework Upgrade Planner</span><span className="prototype-label">Prototype</span></header>
    <section className="machine-view">
      <div className="section-intro"><p className="eyebrow">Your Framework</p><h1>{prototype.model.name}</h1><p className="lede">Your machine is identified. Here are the upgrades available from this configuration, with the benefit of each change in plain language.</p></div>
      <div className="machine-meta"><span className="status-dot" /> Configuration identified <strong>{prototype.identified_configuration}</strong></div>
      <div className="current-config"><span className="section-label">Current configuration</span><div className="config-chips">{prototype.components.map((component) => <span className="config-chip" key={component.id}><b>{component.name}</b>{component.value}</span>)}</div></div>
      <div className="opportunity-heading"><div><p className="eyebrow">Explore what can change</p><h2>Upgrade opportunities</h2></div><span className="opportunity-count">{prototype.upgrade_paths.length} paths</span></div>
      <div className="upgrade-grid">{prototype.upgrade_paths.map((upgrade) => <UpgradeCard key={upgrade.id} upgrade={upgrade} />)}</div>
      <p className="footnote">These paths are derived from the identified configuration and curated product data. They are not ranked recommendations.</p>
    </section>
  </main>
}

function UpgradeCard({ upgrade }: { upgrade: UpgradePath }) {
  return <article className="upgrade-card">
    <div className="upgrade-card-top"><span className="component-icon">{icons[upgrade.component_id]}</span><span className="component-name">{upgrade.component_id.replace("-", " ")}</span></div>
    <h3>{upgrade.title}</h3>
    <div className="upgrade-values"><span>{upgrade.current}</span><b>→</b><strong>{upgrade.proposed}</strong></div>
    <div className="benefit"><span>BENEFIT</span><p>{upgrade.benefit}</p></div>
    <div className="card-footer"><span>{upgrade.changes[0]}</span><a href={upgrade.source_url} target="_blank" rel="noreferrer">Source ↗</a></div>
  </article>
}
