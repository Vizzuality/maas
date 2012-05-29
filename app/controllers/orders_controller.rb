class OrdersController < ApplicationController

  responders :flash, :http_cache

  def new
    @order = Order.new
    @order.data_sources.build
  end

  def create
    @order = Order.create(params[:order])
    respond_with @order
  end

end
