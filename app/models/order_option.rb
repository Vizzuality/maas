class OrderOption < ActiveRecord::Base
  attr_accessible :template_option_id

  belongs_to :order
  belongs_to :template_option
end
