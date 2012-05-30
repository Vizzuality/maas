class Template < ActiveRecord::Base

  has_many :options, :class_name => 'TemplateOption'

end
