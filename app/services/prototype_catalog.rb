class PrototypeCatalog
  MODEL = {
    id: "framework-laptop-13-amd-ai-300",
    name: "Framework Laptop 13",
    subtitle: "AMD Ryzen AI 300 Series",
    source_url: "https://frame.work/laptop13?tab=specs"
  }.freeze

  COMPONENTS = [
    { id: "memory", name: "Memory", value: "16GB DDR5-5600", status: "Explore upgrade", interactive: true },
    { id: "storage", name: "Storage", value: "Not part of this prototype", status: "Available later", interactive: false },
    { id: "mainboard", name: "Mainboard", value: "Ryzen AI 300 Series", status: "Stays with this path", interactive: false },
    { id: "expansion-cards", name: "Expansion Cards", value: "Your four cards", status: "Stay with this path", interactive: false }
  ].freeze

  MEMORY_UPGRADE = {
    id: "memory-16-to-32",
    component_id: "memory",
    title: "Move to 32GB memory",
    current: "16GB DDR5-5600",
    proposed: "32GB DDR5-5600",
    changes: ["Installed memory capacity increases from 16GB to 32GB."],
    stays_reusable: ["Mainboard", "Storage", "Display", "Keyboard", "Expansion Cards", "Enclosure"],
    note: "This prototype describes the component change; it does not estimate performance, price, or availability.",
    source_url: "https://frame.work/laptop13?tab=specs"
  }.freeze

  def self.machine
    {
      model: MODEL,
      components: COMPONENTS,
      current_memory: "16GB DDR5-5600"
    }
  end

  def self.upgrade_paths(memory_gb:)
    memory_gb.to_i == 16 ? [MEMORY_UPGRADE] : []
  end

  private_class_method :new
end
