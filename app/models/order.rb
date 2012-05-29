class Order < ActiveRecord::Base

  attr_accessible :name, :email, :template_type, :comments, :data_sources_attributes

  has_many :data_sources

  accepts_nested_attributes_for :data_sources

end
