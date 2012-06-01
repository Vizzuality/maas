class PaymentsController < ApplicationController

  responders :flash, :http_cache

  before_filter :get_order, :only => [:new, :create]

  def new
    @signature = Recurly.js.sign(
      :transaction => { :amount_in_cents => @order.total, :currency => 'EUR' }
    )
  end

  def create
    @payment = @order.payments.create(:recurly_token => params[:recurly_token])
    respond_with @payment
  end

  def get_order
    @order = Order.find(params[:order_id])
  end
  private :get_order

end
