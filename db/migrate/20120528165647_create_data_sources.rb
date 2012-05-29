class CreateDataSources < ActiveRecord::Migration
  def change
    create_table :data_sources do |t|
      t.references :order
      t.string :file

      t.timestamps
    end
  end
end
