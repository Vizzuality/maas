class QuestionsController < ApplicationController

  respond_to :html, :json
  responders :flash, :http_cache

  #responders :flash, :http_cache

  def create
    respond_with Question.create(params[:question])
  end

end
