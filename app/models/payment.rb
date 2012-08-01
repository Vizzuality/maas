class Payment < ActiveRecord::Base
  attr_accessible :recurly_token,
                  :invoice_uuid,
                  :account_code,
                  :invoice_state

  belongs_to :order

  def paid?
    invoice_state.present? && invoice_state == 'collected'
  end
end
