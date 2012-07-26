class OrdersController < ApplicationController

  respond_to :html, :json
  responders :flash, :http_cache

  def new
    @templates_list = Template.all

    @defaultPageName = params[:page] || "markers"

    @order = Order.new
    @order.data_sources.build
  end

  def create

    @templates_list = Template.all
    @defaultPageName = params[:template][:name]
    @order = Order.create(params[:order])

    respond_with @order

  end

  def show
    @order = Order.where(:id => params[:id]).first
  end

end
