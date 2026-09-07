require "test_helper"

class Api::PrototypeControllerTest < ActionDispatch::IntegrationTest
  test "returns the prototype machine and deterministic upgrade path" do
    get "/api/prototype"

    assert_response :success
    payload = response.parsed_body
    assert_equal "Framework Laptop 13", payload.dig("model", "name")
    assert_equal 4, payload.fetch("upgrade_paths").length
    assert_equal "Move to 32GB memory", payload.dig("upgrade_paths", 0, "title")
  end
end
