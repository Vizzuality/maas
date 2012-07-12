class OrdersController < ApplicationController

  responders :flash, :http_cache

  def new
    @defaultPage = "markers"
    @order = Order.new
    @order.data_sources.build
    @templates_list = Template.all
  end

  def create
    @defaultPage = params[:order][:template_type]
    @order = Order.create(params[:order])
    respond_with @order
  end

  def show
    @order = Order.where(:id => params[:id]).first
  end

end
