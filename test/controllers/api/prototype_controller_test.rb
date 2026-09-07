require "test_helper"

class Api::PrototypeControllerTest < ActionDispatch::IntegrationTest
  test "returns the prototype machine and deterministic upgrade path" do
    get "/api/prototype", params: { memory_gb: 16 }

    assert_response :success
    payload = response.parsed_body
    assert_equal "Framework Laptop 13", payload.dig("model", "name")
    assert_equal "memory-16-to-32", payload.dig("upgrade_paths", 0, "id")
  end
end
