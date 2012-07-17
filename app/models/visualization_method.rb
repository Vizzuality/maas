class VisualizationMethod < ActiveRecord::Base
  belongs_to :template
  belongs_to :order
  attr_accessible :name
end
