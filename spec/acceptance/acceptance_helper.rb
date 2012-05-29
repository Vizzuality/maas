require 'spec_helper'
require 'capybara/rspec'
require 'capybara/webkit'

Capybara.javascript_driver = :webkit

Dir[Rails.root.join("spec/support/acceptance/*.rb")].each {|f| require f}
