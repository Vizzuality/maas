class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|

      t.string     :name,                :nil => false
      t.string     :email,               :nil => false
      t.text       :comment

      t.timestamps
    end
  end
end
