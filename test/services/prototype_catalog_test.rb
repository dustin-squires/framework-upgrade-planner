require "test_helper"

class PrototypeCatalogTest < ActiveSupport::TestCase
  test "returns one upgrade path for each demo component" do
    paths = PrototypeCatalog.upgrade_paths

    assert_equal %w[memory storage expansion-cards keyboard], paths.map { |path| path[:component_id] }
    assert paths.all? { |path| path[:benefit].present? }
  end
end
