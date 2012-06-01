class Order < ActiveRecord::Base

  attr_accessible :name,
                  :email,
                  :template_type,
                  :comments,
                  :data_sources_attributes,
                  :options_1,
                  :options_2,
                  :options_3,
                  :options_4

  has_many :data_sources
  has_many :payments

  accepts_nested_attributes_for :data_sources

end
