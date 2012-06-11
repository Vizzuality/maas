class VisualizationMethod < ActiveRecord::Base
  belongs_to :template
  attr_accessible :name
end
