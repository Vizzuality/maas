class AddDescriptionToTemplateOptions < ActiveRecord::Migration
  def up
    add_column :template_options, :description, :string
  end

  def down
    remove_column :template_options, :description
  end
end
