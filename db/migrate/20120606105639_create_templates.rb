class CreateTemplates < ActiveRecord::Migration
  def change
    create_table :templates do |t|
      t.string  :name
      t.integer :price

      t.timestamps
    end
  end
end
