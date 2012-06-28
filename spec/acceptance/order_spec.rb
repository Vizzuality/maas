require_relative 'acceptance_helper'

feature 'MaaS orders creation' do

  background do
    [
      :markers,
      :polygons,
      :thematic,
      :density,
      :dont_know
    ].each{ |name| FactoryGirl.create(name) }
    visit new_order_path
  end

  scenario 'allows to select between different map templates', :js => true do

    within 'form' do

      page.should have_content 'Creating your order'
      page.should have_content 'Select your template'

      within '#templates-detail' do
        page.should have_content 'Select one of the types above to start configuring your template'
        find('h4', :text => 'Markers map').should_not be_visible
        find('p', :text => 'Including base interactivity, mouse-over effects and basic infowindows.').should_not be_visible
        find('.price', :text => '$2000').should_not be_visible
        find('.options').should_not be_visible
      end

      within '#templates-list' do
        page.should have_link 'Markers map'
        page.should have_link 'Polygons map'
        page.should have_link 'Thematic map'
        page.should have_link 'Density map'
        page.should have_link "Don't know"

        click_on 'Markers map'
      end

      markers_template_specs

      polygons_template_specs

      thematic_template_specs

      density_template_specs

      dont_know_template_specs

    end

  end

  scenario "allows to attach customer's data" do

    within 'form .your_data' do

      page.should have_content 'Attach your data'
      page.should have_content 'In order to get the best option for you, we need to analyze your data before sending you a budget.'

      page.should have_content 'To attach files drag & drop here or'
      page.should have_link 'select files from your computer'

    end

  end

  scenario 'allows customers their contact info' do

    within 'form .contact_info' do
      page.should have_css 'label', :text => 'Your name/company'
      page.should have_css 'input#order_name', :type => 'text'

      page.should have_css 'label', :text => 'Your email'
      page.should have_css 'input#order_email', :type => 'email'

      page.should have_css 'label', :text => 'Comments that should we know about your data on the map you want'
      page.should have_css 'textarea#order_comments'
    end

  end

  scenario 'allows customers to place them if all data is ok', :js => true do
    click_on 'Markers map'
    check 'Dynamic filters'
    check 'Dynamic clusters'

    fill_in 'Your name/company', :with => 'Naruto'
    fill_in 'Your email', :with => 'naruto@konoha.jp'
    fill_in 'Comments that should we know about your data on the map you want', :with => 'wadus'

    expect do
      click_on 'Confirm and ask for a budget'
      wait_until { Order.count == 1 }
    end.to change{ Order.count }.by(1)

    last_order = Order.last
    last_order.template_type.should be == Template.where(:name => 'markers').first.id
    last_order.total.should be == 2700
    last_order.name.should be == 'Naruto'
    last_order.email.should be == 'naruto@konoha.jp'
    last_order.comments.should be == 'wadus'

    last_order.order_options.should have(2).options
  end

end


feature 'MaaS orders detail' do

  background do
    template = FactoryGirl.create(:markers)
    order = FactoryGirl.create(:awesome_map_order,
                               :template => template,
                               :order_options => template.options.first(2).map{|o| FactoryGirl.create(:order_option,
                                                                                                      :template_option => o)})
    visit order_path(order)
  end

  scenario 'shows a summary of the order' do
    within '.title' do
      page.should have_content 'Hi Acme,'
      page.should have_content 'This is your map tracker page. Here you will be able to see the progress of your map.'
    end

    within '.summary' do
      page.should have_content 'Your order summary'
      page.should have_content 'Markers map with...'
      page.should have_content 'Dynamic filters'
      page.should have_content 'Custom infowindows'
    end

    within '.total' do
      page.should have_content 'Total'
      page.should have_content 'Starting from $2000'
    end

    within '.analyzing' do
      page.should have_content 'We are analyzing your data.'
      page.should have_content 'In order to give you a price based on the time we will need to process and visualize it we need to take a look at your data first. Once we finish, we will contact you -and update this page- with the definitive budget, which you will approve or discard.'
      page.should have_content 'Do you think that is taking us too much time?'
      page.should have_link 'Contact us'
    end

  end

end
