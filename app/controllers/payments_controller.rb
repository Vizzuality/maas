class PaymentsController < ApplicationController

  responders :flash, :http_cache

  before_filter :get_order, :only => [:new, :create]

  def new
    @signature = Recurly.js.sign(
      :transaction => { :amount_in_cents => @order.total, :currency => 'USD' }
    )
  end

  def create
    invoice = Recurly.js.fetch params[:recurly_token]
    @payment = @order.payments.create(:recurly_token => params[:recurly_token],
                                      :invoice_uuid => invoice.uuid,
                                      :account_code => invoice.account.account_code,
                                      :invoice_state => invoice.state)
    respond_with @order
  end

  def get_order
    @order = Order.find(params[:order_id])
  end
  private :get_order

end
