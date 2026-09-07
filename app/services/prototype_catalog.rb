class PrototypeCatalog
  MODEL = {
    id: "framework-laptop-13-amd-ai-300",
    name: "Framework Laptop 13",
    subtitle: "AMD Ryzen AI 300 Series",
    source_url: "https://frame.work/laptop13?tab=specs"
  }.freeze

  COMPONENTS = [
    { id: "memory", name: "Memory", value: "16GB DDR5-5600" },
    { id: "storage", name: "Storage", value: "256GB PCIe 4.0 NVMe" },
    { id: "expansion-cards", name: "Expansion Cards", value: "4 user-selectable cards" },
    { id: "keyboard", name: "Keyboard", value: "US English · Windows" }
  ].freeze

  UPGRADE_PATHS = [
    {
    id: "memory-16-to-32",
    component_id: "memory",
    title: "Move to 32GB memory",
    current: "16GB DDR5-5600",
    proposed: "32GB DDR5-5600",
    benefit: "More memory headroom can help keep more demanding applications active at the same time.",
    changes: ["Installed memory capacity increases from 16GB to 32GB."],
    stays_reusable: ["Mainboard", "Storage", "Display", "Keyboard", "Expansion Cards", "Enclosure"],
    source_url: "https://frame.work/laptop13?tab=specs"
    },
    {
      id: "storage-256-to-1000", component_id: "storage", title: "Expand to 1TB storage",
      current: "256GB PCIe 4.0 NVMe", proposed: "1TB PCIe 4.0 NVMe",
      benefit: "More local space for applications, projects, and files without replacing the laptop.",
      changes: ["Available storage increases from 256GB to 1TB."],
      stays_reusable: ["Mainboard", "Memory", "Display", "Keyboard", "Expansion Cards", "Enclosure"],
      source_url: "https://frame.work/laptop13?tab=specs"
    },
    {
      id: "expansion-cards-customize", component_id: "expansion-cards", title: "Change your port mix",
      current: "4 user-selectable cards", proposed: "USB-C · USB-A · HDMI · MicroSD",
      benefit: "Match the laptop’s ports to the devices you use, with less dependence on adapters.",
      changes: ["The cards in the four bays change; the bays and laptop remain the same."],
      stays_reusable: ["Mainboard", "Memory", "Storage", "Display", "Keyboard", "Enclosure"],
      source_url: "https://frame.work/products/laptop13-diy-amd-ai300/faq?faqable_id=176&faqable_type=section"
    },
    {
      id: "keyboard-layout", component_id: "keyboard", title: "Choose a different keyboard",
      current: "US English · Windows", proposed: "Your preferred language or layout",
      benefit: "Use the language and key layout that fits how you write and work.",
      changes: ["The keyboard module and its layout change while the rest of the input cover remains part of the machine."],
      stays_reusable: ["Mainboard", "Memory", "Storage", "Display", "Expansion Cards", "Enclosure"],
      source_url: "https://frame.work/laptop13?tab=specs"
    }
  ].freeze

  def self.machine
    {
      model: MODEL,
      components: COMPONENTS,
      identified_configuration: "Framework Laptop 13 · AMD Ryzen AI 300 Series"
    }
  end

  def self.upgrade_paths
    UPGRADE_PATHS
  end

  private_class_method :new
end
