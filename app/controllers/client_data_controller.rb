#encoding: UTF-8
class ClientDataController < ApplicationController

  skip_before_filter :verify_authenticity_token

  def create
    begin
      
      client_datum = ClientDatum.new
      client_datum.data = CarrierwaveStringIO.new(params[:qqfile], request.body.read.force_encoding('utf-8'))
      client_datum.save!

      render :json => { data: client_datum, success: true }
    rescue => e
      logger.error e
      logger.error e.backtrace
      head(400)
    end
  end

end
