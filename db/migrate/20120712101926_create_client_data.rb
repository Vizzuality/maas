class CreateClientData < ActiveRecord::Migration

  def change
    create_table :client_data do |t|

      t.integer :order_id
      t.string :data

      t.timestamps
    end
  end

end
