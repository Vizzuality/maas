class AddSlugToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :slug, :string
  end
end
