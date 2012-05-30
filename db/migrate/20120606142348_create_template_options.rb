class CreateTemplateOptions < ActiveRecord::Migration
  def change
    create_table :template_options do |t|
      t.references :template

      t.string  :name
      t.integer :price

      t.timestamps
    end
  end
end
