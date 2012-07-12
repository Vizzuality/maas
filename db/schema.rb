# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120712101926) do

  create_table "client_data", :force => true do |t|
    t.integer  "order_id"
    t.string   "data"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "data_sources", :force => true do |t|
    t.integer  "order_id"
    t.string   "file"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "order_options", :force => true do |t|
    t.integer  "order_id"
    t.integer  "template_option_id"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  add_index "order_options", ["order_id"], :name => "index_order_options_on_order_id"
  add_index "order_options", ["template_option_id"], :name => "index_order_options_on_template_option_id"

  create_table "orders", :force => true do |t|
    t.string   "name"
    t.string   "email"
    t.integer  "template_type"
    t.integer  "visualization_method"
    t.text     "comments"
    t.integer  "total"
    t.datetime "created_at",           :null => false
    t.datetime "updated_at",           :null => false
    t.string   "client_data"
  end

  create_table "payments", :force => true do |t|
    t.integer  "order_id"
    t.string   "recurly_token"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  create_table "template_options", :force => true do |t|
    t.integer  "template_id"
    t.string   "name"
    t.integer  "price"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  create_table "templates", :force => true do |t|
    t.string   "name"
    t.integer  "price"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "visualization_methods", :force => true do |t|
    t.integer  "template_id"
    t.string   "name"
    t.datetime "created_at",  :null => false
    t.datetime "updated_at",  :null => false
  end

  add_index "visualization_methods", ["template_id"], :name => "index_visualization_methods_on_template_id"

end
