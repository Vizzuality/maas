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

  scenario 'allows customers to place them if all data is ok'

end
