class CreateVisualizationMethods < ActiveRecord::Migration
  def change
    create_table :visualization_methods do |t|
      t.references :template
      t.string :name

      t.timestamps
    end
    add_index :visualization_methods, :template_id
  end
end
