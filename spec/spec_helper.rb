ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'rspec/autorun'
require 'database_cleaner'
require 'vcr'

WebMock.disable_net_connect!(:allow_localhost => true)

VCR.configure do |c|
  c.ignore_localhost = true
  c.default_cassette_options = { :record => :new_episodes }
  c.cassette_library_dir = 'spec/vcr_cassettes'
  c.hook_into :webmock
  c.configure_rspec_metadata!
end

Dir[Rails.root.join("spec/support/*.rb")].each {|f| require f}

RSpec.configure do |config|

  config.use_transactional_fixtures = false

  config.infer_base_class_for_anonymous_controllers = false

  config.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  config.after(:suite) do
    Dir[Rails.root.join('public/uploads/tmp/*')].each do |path|
      FileUtils.rm_rf path
    end
    Dir[Rails.root.join('tmp/uploads/*')].each do |path|
      FileUtils.rm_rf path
    end
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end
