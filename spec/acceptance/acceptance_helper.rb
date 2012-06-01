require 'spec_helper'
require 'capybara/rspec'
require 'capybara/webkit'

Capybara.default_driver = :webkit

Dir[Rails.root.join("spec/support/acceptance/*.rb")].each {|f| require f}

class ActiveRecord::Base
  mattr_accessor :shared_connection
  @@shared_connection = nil

  def self.connection
    @@shared_connection || retrieve_connection
  end
end
ActiveRecord::Base.shared_connection = ActiveRecord::Base.connection
