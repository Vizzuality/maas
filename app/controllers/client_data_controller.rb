#encoding: UTF-8
class ClientDataController < ApplicationController

  skip_before_filter :verify_authenticity_token

  def create
    begin
      require 'ruby-debug'; debugger
      client_datum = ClientDatum.new
      client_datum.data = CarrierwaveStringIO.new(params[:qqfile], request.body.read.force_encoding('utf-8'))
      client_datum.save!

      render :json => client_datum
    rescue => e
      logger.error e
      logger.error e.backtrace
      head(400)
    end
  end

end
