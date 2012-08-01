class AddMapUrlAndMapSourceUrlToOrders < ActiveRecord::Migration
  def change
    add_column :orders, :map_url, :string
    add_column :orders, :map_source_url, :string
  end
end
