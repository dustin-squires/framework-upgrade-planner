module Api
  class PrototypeController < ApplicationController
    def show
      render json: PrototypeCatalog.machine.merge(
        upgrade_paths: PrototypeCatalog.upgrade_paths
      )
    end
  end
end
