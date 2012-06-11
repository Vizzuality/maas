class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string     :name,                :nil => false
      t.string     :email,               :nil => false
      t.integer    :template_type,       :nil => false
      t.integer    :visualization_method
      t.text       :comments
      t.integer    :total,               :nil => false

      t.timestamps
    end
  end
end
