class OrderObserver < ActiveRecord::Observer

  def before_create(order)
    order.total = nil if order.total.present?
  end

  def after_create(order)
    Notifications.new_order(order).deliver if order.present?
  end

  def after_update(order)
    Notifications.final_price(order).deliver if order.total_updated?
    Notifications.map_ready(order).deliver if order.ready?
  end

end
