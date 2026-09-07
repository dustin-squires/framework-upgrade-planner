module Api
  class PrototypeController < ApplicationController
    def show
      memory_gb = params.fetch(:memory_gb, 16)

      render json: PrototypeCatalog.machine.merge(
        upgrade_paths: PrototypeCatalog.upgrade_paths(memory_gb: memory_gb)
      )
    end
  end
end
