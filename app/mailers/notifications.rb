class Notifications < ActionMailer::Base
  default from: "boss@mapmydata.co"
          #, bcc: "contact@vizzuality.com"

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications.new_order.subject
  #
  def new_order(order)
    @greeting = "Hi"

    mail to: order.email
  end

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.notifications.final_price.subject
  #
  def final_price(order)
    @greeting = "Hi"

    mail to: order.email
  end
end
