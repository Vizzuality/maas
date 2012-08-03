class OrdersController < ApplicationController

  before_filter :get_order, :only => [:show]

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

  def get_order
    #@order = Order.where(:id => params[:id]).first
    @order = Order.find(params[:id])

    # If an old id or a numeric id was used to find the record, then
    # the request path will not match the post_path, and we should do
    # a 301 redirect that uses the current friendly id.
    if request.path != order_path(@order)
      return redirect_to @order, :status => :moved_permanently
    end
  end

end
