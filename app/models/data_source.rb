class DataSource < ActiveRecord::Base
  attr_accessible :file, :remote_file_url

  validate :a_file_must_be_provided

  belongs_to :order

  mount_uploader :file, DataUploader

  def a_file_must_be_provided
    errors.add(:file, :required) if file.blank? && remote_file_url.blank?
  end
  private :a_file_must_be_provided
end
