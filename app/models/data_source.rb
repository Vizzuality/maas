class DataSource < ActiveRecord::Base

  attr_accessible :file, :remote_file_url

  belongs_to :order

  mount_uploader :file, DataUploader

end
