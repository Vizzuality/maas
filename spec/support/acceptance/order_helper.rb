module OrderHelper

  def set_user_data
    within '#about_you' do
      fill_in 'Your name or company', :with => 'ACME'
      fill_in 'Your email', :with => 'coyote@acme.com'
    end
  end

  def upload_data_file

    within '#your_data' do

      page.should have_css 'label', :visible => false, :text => 'My data'
      page.should have_css 'input', :visible => false, :type => 'file'

      choose 'Upload a file'

      page.should have_css 'label', :visible => true, :text => 'My data'
      page.should have_css 'input', :visible => true, :type => 'file'

      attach_file 'My data', Rails.root.join('spec/support/data/whs_features.csv')
    end

  end

  def set_data_url

    within '#your_data' do

      page.should have_css 'label', :visible => false, :text => 'My data url'
      page.should have_css 'input', :visible => false, :type => 'text'

      choose 'Provide a link'

      page.should have_css 'label', :visible => true, :text => 'My data url'
      page.should have_css 'input', :visible => true, :type => 'text'

      fill_in 'My data url', :with => "#{Capybara.current_url.gsub(Capybara.current_path, '')}/tmp/whs_features.csv"
    end

  end

  def select_template_type

    within '#your_visualization' do

      choose 'Marker map'

    end

  end

  def set_some_comments

    within '#anything_else' do
      fill_in 'order_comments', :with => 'Bla bla bla...'
    end

  end

end

RSpec.configure { |config| config.include OrderHelper }
