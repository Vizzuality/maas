class CreatePayments < ActiveRecord::Migration
  def change
    create_table :payments do |t|
      t.references :order

      t.string :recurly_token

      t.timestamps
    end
  end
end
