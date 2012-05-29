module PathsHelper

  def new_order_path
    '/orders/new'
  end

end

RSpec.configure { |config| config.include PathsHelper }
