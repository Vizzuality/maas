class CreateOrders < ActiveRecord::Migration
  def change
    create_table :orders do |t|
      t.string     :name
      t.string     :email
      t.integer    :template_type
      t.text       :comments
      t.boolean    :options_1
      t.boolean    :options_2
      t.boolean    :options_3
      t.boolean    :options_4

      t.timestamps
    end
  end
end
