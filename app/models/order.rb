class Order < ActiveRecord::Base

  attr_accessible :name,
                  :email,
                  :template_type,
                  :comments,
                  :total,
                  :data_sources_attributes,
                  :order_options_attributes

  has_many :data_sources
  has_many :payments
  has_many :order_options

  accepts_nested_attributes_for :data_sources
  accepts_nested_attributes_for :order_options, :reject_if => proc { |attributes|
    attributes[:template_option_id].blank? || attributes[:template_option_id] == '0'
  }

end
