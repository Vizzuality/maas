class Payment < ActiveRecord::Base
  attr_accessible :recurly_token

  belongs_to :order
end
