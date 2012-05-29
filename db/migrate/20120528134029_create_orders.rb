class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string     :name
      t.string     :email
      t.integer    :template_type
      t.text       :comments

      t.timestamps
    end
  end
end
