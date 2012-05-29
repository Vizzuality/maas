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

  def data_by_email

    within '#your_data' do

      choose 'I prefer to send it by email'

    end

  end

  def select_template_type(type = :marker)
    types = {
      :marker => 'Marker map',
      :thematic => 'Thematic map',
      :not_sure => "I'm not sure"
    }

    within '#your_visualization' do

      choose types[type]

    end

  end

  def select_visualization_options
    within '#your_visualization .options' do
      page.should have_content 'Any additional visualization needs?'

      check 'Include a way of filtering of the data'
      check 'Allow the user to download the data in a ZIP / CSV / KML file'
      check 'Adapt the map to my corporative colors'
      check 'Clusterize markers'
    end
  end

  def set_some_comments

    within '#anything_else' do
      fill_in 'order_comments', :with => 'Bla bla bla...'
    end

  end

  def fill_order_form(template_type, template_type_id)

    set_user_data

    upload_data_file

    select_template_type template_type

    set_some_comments

    expect do
      click_on 'Place your order'
      sleep 1
    end.to change{ Order.count }.by(1)

    order = Order.last
    order.name.should == 'ACME'
    order.email.should == 'coyote@acme.com'
    order.template_type.should == template_type_id
    order.comments.should == 'Bla bla bla...'
    order.data_sources.should have(1).data_source
    order.data_sources.last.file.url.should match(/uploads\/data_source\/file\/\d+\/whs_features\.csv/)

  end

end

RSpec.configure { |config| config.include OrderHelper }
