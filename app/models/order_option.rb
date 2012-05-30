class OrderOption < ActiveRecord::Base
  belongs_to :order
  belongs_to :template_option
end
