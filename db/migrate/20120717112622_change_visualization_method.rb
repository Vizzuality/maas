class ChangeVisualizationMethod < ActiveRecord::Migration
  def up
    rename_column :orders, :visualization_method, :visualization_method_id
  end

  def down
    rename_column :orders, :visualization_method_id, :visualization_metod
  end
end
