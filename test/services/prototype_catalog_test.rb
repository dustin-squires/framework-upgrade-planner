require "test_helper"

class PrototypeCatalogTest < ActiveSupport::TestCase
  test "returns the curated memory path for the demo configuration" do
    paths = PrototypeCatalog.upgrade_paths(memory_gb: 16)

    assert_equal ["memory-16-to-32"], paths.map { |path| path[:id] }
    assert_equal "32GB DDR5-5600", paths.first[:proposed]
  end

  test "does not invent a path for an unsupported configuration" do
    assert_empty PrototypeCatalog.upgrade_paths(memory_gb: 64)
  end
end
