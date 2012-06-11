class Template < ActiveRecord::Base

  has_many :options, :class_name => 'TemplateOption'
  has_many :visualization_methods, :order => 'id asc'

end
