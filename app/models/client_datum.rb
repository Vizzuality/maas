class ClientDatum < ActiveRecord::Base

  belongs_to :order

  mount_uploader :data, ClientDataUploader

end
