class OrderObserver < ActiveRecord::Observer

  def after_create(order)
    Notifications.new_order(order).deliver if order.present?
  end

end
