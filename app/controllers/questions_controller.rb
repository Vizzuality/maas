class QuestionsController < ApplicationController

  respond_to :json

  #responders :flash, :http_cache

  def create
    respond_with Question.create(params[:question])
  end

end
