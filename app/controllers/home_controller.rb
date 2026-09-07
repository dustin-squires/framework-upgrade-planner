class HomeController < ApplicationController
  def show
    render file: Rails.root.join("public/index.html"), layout: false
  end
end
