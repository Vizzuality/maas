class CreateOrderOptions < ActiveRecord::Migration
  def change
    create_table :order_options do |t|
      t.references :order
      t.references :template_option

      t.timestamps
    end
    add_index :order_options, :order_id
    add_index :order_options, :template_option_id
  end
end
