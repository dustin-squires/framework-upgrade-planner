import { useEffect, useMemo, useState } from "react"

type Component = { id: string; name: string; value: string }
type UpgradePath = { id: string; component_id: string; title: string; current: string; proposed: string; benefit: string; changes: string[]; stays_reusable: string[]; source_url: string }
type Prototype = { model: { name: string; subtitle: string; source_url: string }; components: Component[]; identified_configuration: string; upgrade_paths: UpgradePath[] }
type UpgradeOption = { id: string; name: string; value: string; price: number; benefit: string; reuse: string[] }
type Selections = Record<string, string>

const icons: Record<string, string> = { memory: "✦", storage: "▣", "expansion-cards": "◈", mainboard: "◉" }
const choices: Record<string, UpgradeOption[]> = {
  memory: [
    { id: "memory-32", name: "32GB DDR5-5600", value: "32GB DDR5-5600", price: 90, benefit: "More room for demanding applications, large projects, and multitasking.", reuse: ["Mainboard", "Storage", "Display", "Expansion Cards", "Enclosure"] },
    { id: "memory-64", name: "64GB DDR5-5600", value: "64GB DDR5-5600", price: 180, benefit: "Extra headroom for heavier local development, virtual machines, and creative work.", reuse: ["Mainboard", "Storage", "Display", "Expansion Cards", "Enclosure"] }
  ],
  storage: [
    { id: "storage-512", name: "512GB PCIe 4.0 NVMe", value: "512GB PCIe 4.0 NVMe", price: 55, benefit: "More space for applications and active project files.", reuse: ["Mainboard", "Memory", "Display", "Expansion Cards", "Enclosure"] },
    { id: "storage-1tb", name: "1TB PCIe 4.0 NVMe", value: "1TB PCIe 4.0 NVMe", price: 110, benefit: "Keep larger projects, tools, and files available locally.", reuse: ["Mainboard", "Memory", "Display", "Expansion Cards", "Enclosure"] },
    { id: "storage-2tb", name: "2TB PCIe 4.0 NVMe", value: "2TB PCIe 4.0 NVMe", price: 190, benefit: "Create substantial local capacity without replacing the laptop.", reuse: ["Mainboard", "Memory", "Display", "Expansion Cards", "Enclosure"] }
  ],
  "expansion-cards": [
    { id: "cards-creator", name: "Creator port mix", value: "USB-C · USB-A · HDMI · MicroSD", price: 49, benefit: "A ready-to-use mix for displays, storage, and everyday peripherals.", reuse: ["Mainboard", "Memory", "Storage", "Display", "Keyboard", "Enclosure"] },
    { id: "cards-travel", name: "Travel port mix", value: "USB-C · USB-C · USB-A · HDMI", price: 39, benefit: "Prioritize flexible charging and display connectivity while travelling.", reuse: ["Mainboard", "Memory", "Storage", "Display", "Keyboard", "Enclosure"] }
  ],
  mainboard: [
    { id: "mainboard-ryzen-5", name: "Ryzen 5 mainboard", value: "Newer Ryzen 5 CPU", price: 399, benefit: "A newer CPU generation gives everyday development and multitasking more headroom.", reuse: ["Storage", "Display", "Keyboard", "Expansion Cards", "Enclosure"] },
    { id: "mainboard-ryzen-7", name: "Ryzen 7 mainboard", value: "Newer Ryzen 7 CPU", price: 649, benefit: "More CPU performance across demanding applications, builds, and general use.", reuse: ["Storage", "Display", "Keyboard", "Expansion Cards", "Enclosure"] }
  ]
}

const formatPrice = (price: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(price)
const componentLabel = (id: string) => id.split("-").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")

export default function App() {
  const [prototype, setPrototype] = useState<Prototype | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openPanel, setOpenPanel] = useState<string | null>(null)
  const [draftOptionId, setDraftOptionId] = useState<string | null>(null)
  const [selections, setSelections] = useState<Selections>(() => {
    try { return JSON.parse(window.localStorage.getItem("framework-upgrade-plan") || "{}") } catch { return {} }
  })

  useEffect(() => {
    fetch("/api/prototype")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("The prototype data could not be loaded.")))
      .then(setPrototype)
      .catch((requestError: Error) => setError(requestError.message))
  }, [])
  useEffect(() => { window.localStorage.setItem("framework-upgrade-plan", JSON.stringify(selections)) }, [selections])
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpenPanel(null) }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [])

  const selectedOptions = useMemo(() => Object.entries(selections).flatMap(([componentId, optionId]) => {
    const option = choices[componentId]?.find((candidate) => candidate.id === optionId)
    return option ? [{ componentId, option }] : []
  }), [selections])
  const total = selectedOptions.reduce((sum, { option }) => sum + option.price, 0)
  const openUpgrade = (componentId: string) => { setOpenPanel(componentId); setDraftOptionId(selections[componentId] || null) }
  const applyDraft = () => { if (openPanel && draftOptionId) { setSelections((current) => ({ ...current, [openPanel]: draftOptionId })); setOpenPanel(null) } }
  const removeSelection = (componentId: string) => setSelections((current) => { const next = { ...current }; delete next[componentId]; return next })

  if (error) return <main className="shell"><p className="eyebrow">Framework Upgrade Planner</p><h1>We couldn’t load your machine.</h1><p>{error}</p></main>
  if (!prototype) return <main className="shell loading"><span className="pulse" /> Reading your Framework configuration…</main>

  const activePath = prototype.upgrade_paths.find((path) => path.component_id === openPanel)
  const activeOptions = openPanel ? choices[openPanel] || [] : []
  const draftOption = activeOptions.find((option) => option.id === draftOptionId)

  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">✣</span><span>framework</span></div><nav className="site-nav"><span>Desktop</span><span>Laptop 12</span><span className="nav-active">Laptop 13</span><span>Shop all</span></nav><div className="utility-nav"><span>Support</span><span>About</span><span className="prototype-label">Prototype</span></div></header>
    <section className="machine-view">
      <div className="section-intro"><p className="eyebrow">Your Framework</p><h1>{prototype.model.name}</h1><p className="lede">Your machine is identified. Explore each component, compare upgrade options, and build a plan that fits your needs.</p></div>
      <div className="machine-meta"><span className="status-dot" /> Configuration identified <strong>{prototype.identified_configuration}</strong></div>
      <div className="current-config"><div className="config-heading"><span className="section-label">{selectedOptions.length ? "Your planned configuration" : "Current configuration"}</span>{selectedOptions.length > 0 && <button className="text-button" onClick={() => setSelections({})}>Clear plan</button>}</div><div className="config-chips">{prototype.components.map((component) => { const selection = selectedOptions.find(({ componentId }) => componentId === component.id)?.option; return <span className={selection ? "config-chip changed" : "config-chip"} key={component.id}><b>{component.name}</b>{selection ? <><s>{component.value}</s><em>→ {selection.value}</em></> : component.value}</span> })}</div></div>
      <div className="opportunity-heading"><div><p className="eyebrow">Explore what can change</p><h2>Upgrade opportunities</h2></div><span className="opportunity-count">{prototype.upgrade_paths.length} paths</span></div>
      <div className="upgrade-grid">{prototype.upgrade_paths.map((upgrade) => <UpgradeCard key={upgrade.id} upgrade={upgrade} selected={selectedOptions.find(({ componentId }) => componentId === upgrade.component_id)?.option} onOpen={() => openUpgrade(upgrade.component_id)} onRemove={() => removeSelection(upgrade.component_id)} />)}</div>
    </section>
    <PlanBar total={total} count={selectedOptions.length} onReview={() => setOpenPanel("review")} />
    {openPanel === "review" && <ReviewDrawer selections={selectedOptions} onClose={() => setOpenPanel(null)} onEdit={openUpgrade} total={total} />}
    {activePath && <UpgradeDrawer path={activePath} options={activeOptions} selectedOptionId={selections[activePath.component_id]} draftOption={draftOption} onChoose={setDraftOptionId} onApply={applyDraft} onClose={() => setOpenPanel(null)} />}
  </main>
}

function UpgradeCard({ upgrade, selected, onOpen, onRemove }: { upgrade: UpgradePath; selected?: UpgradeOption; onOpen: () => void; onRemove: () => void }) {
  return <article className={selected ? "upgrade-card selected-card" : "upgrade-card"}><button className="card-hit-area" onClick={onOpen} aria-label={`Explore ${componentLabel(upgrade.component_id)} upgrades`}><div className={`upgrade-visual visual-${upgrade.component_id}`}><span className="visual-badge">{selected ? "In your plan" : "Upgrade"}</span><span className="visual-symbol">{icons[upgrade.component_id]}</span></div><div className="upgrade-card-top"><span className="component-icon">{icons[upgrade.component_id]}</span><span className="component-name">{componentLabel(upgrade.component_id)}</span></div><h3>{selected ? selected.name : upgrade.title}</h3><div className="upgrade-values"><span>{upgrade.current}</span><b>→</b><strong>{selected ? selected.value : upgrade.proposed}</strong></div><div className="benefit"><span>{selected ? "SELECTED BENEFIT" : "BENEFIT"}</span><p>{selected ? selected.benefit : upgrade.benefit}</p></div></button><div className="card-actions">{selected && <button className="remove-button" onClick={onRemove}>Remove</button>}<a href={upgrade.source_url} target="_blank" rel="noreferrer">Source ↗</a></div></article>
}

function UpgradeDrawer({ path, options, selectedOptionId, draftOption, onChoose, onApply, onClose }: { path: UpgradePath; options: UpgradeOption[]; selectedOptionId?: string; draftOption?: UpgradeOption; onChoose: (id: string) => void; onApply: () => void; onClose: () => void }) {
  return <div className="drawer-layer" role="presentation" onMouseDown={onClose}><aside className="drawer" role="dialog" aria-modal="true" aria-label={`${componentLabel(path.component_id)} upgrade options`} onMouseDown={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">Upgrade component</p><h2>{componentLabel(path.component_id)}</h2></div><button className="close-button" onClick={onClose} aria-label="Close">×</button></div><div className="comparison"><div><span>Current</span><strong>{path.current}</strong></div><b>→</b><div><span>Preview</span><strong>{draftOption?.value || "Choose an option"}</strong></div></div><p className="drawer-intro">Choose an option to preview its benefit and what remains reusable. Add it to your plan when you are ready.</p><div className="option-list">{options.map((option) => <button className={draftOption?.id === option.id ? "option-card active-option" : "option-card"} key={option.id} onClick={() => onChoose(option.id)}><span className="option-radio" /><span className="option-copy"><strong>{option.name}</strong><small>{option.benefit}</small></span><b>{formatPrice(option.price)}</b></button>)}</div>{draftOption && <div className="reuse-panel"><span>YOU KEEP</span><p>{draftOption.reuse.join(" · ")}</p></div>}<div className="drawer-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="apply-button" onClick={onApply} disabled={!draftOption}>{selectedOptionId === draftOption?.id ? "Keep selection" : "Add to plan"}{draftOption && <span>{formatPrice(draftOption.price)}</span>}</button></div></aside></div>
}

function PlanBar({ total, count, onReview }: { total: number; count: number; onReview: () => void }) {
  return <div className="plan-bar"><div><span className="plan-label">Your upgrade plan</span><strong>{count ? `${count} ${count === 1 ? "upgrade" : "upgrades"} selected` : "No upgrades selected"}</strong></div><div className="plan-total"><span>Demo total</span><strong>{formatPrice(total)}</strong></div><button className="review-button" onClick={onReview} disabled={!count}>Review plan</button></div>
}

function ReviewDrawer({ selections, total, onClose, onEdit }: { selections: { componentId: string; option: UpgradeOption }[]; total: number; onClose: () => void; onEdit: (componentId: string) => void }) {
  return <div className="drawer-layer" role="presentation" onMouseDown={onClose}><aside className="drawer review-drawer" role="dialog" aria-modal="true" aria-label="Your upgrade plan" onMouseDown={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow">Your plan</p><h2>Ready to upgrade</h2></div><button className="close-button" onClick={onClose} aria-label="Close">×</button></div><p className="drawer-intro">A focused view of the selected components. Prices are illustrative for this prototype.</p><div className="review-list">{selections.map(({ componentId, option }) => <div key={componentId}><span>{componentLabel(componentId)}</span><strong>{option.name}</strong><b>{formatPrice(option.price)}</b><button onClick={() => onEdit(componentId)}>Edit</button></div>)}</div><div className="review-total"><span>Estimated demo total</span><strong>{formatPrice(total)}</strong></div><button className="apply-button full-width" onClick={onClose}>Back to upgrades</button></aside></div>
}
