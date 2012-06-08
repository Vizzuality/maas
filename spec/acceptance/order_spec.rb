require_relative 'acceptance_helper'

feature 'MaaS orders creation', :js => true do

  background do
    [
      :markers,
      :polygons,
      :choropleths,
      :bubble,
      :dont_know
    ].each{ |name| FactoryGirl.create(name) }
    visit new_order_path
  end

  scenario 'allows to select between different map templates' do

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
        page.should have_link 'Choropleths map'
        page.should have_link 'Bubble map'
        page.should have_link "Don't know"

        click_on 'Markers map'
      end

      within '#templates-list' do
        page.should have_css 'a', :text => 'Markers map', :class => 'selected'
      end

      within '#templates-detail' do
        page.should_not have_link    'Markers map', :class => 'selected'
        find('h4', :text => 'Markers map').should be_visible
        find('p', :text => 'Including base interactivity, mouse-over effects and basic infowindows.').should be_visible
        find('.price', :text => '$2000').should be_visible
        find('.options').should be_visible

        within '.options' do
          lis = all('li')

          lis[0].should have_css 'input', :type => 'checkbox'
          lis[0].should have_css 'label', :text => 'Dynamic filters.'
          lis[0].should have_css '.label_price', :text => '($350)'
          lis[0].should have_content 'This allows you to filter the features in your map dynamically.'
          lis[0].should have_css '.ellipsis', :text => '...'
          lis[3].should have_css '.option_price', :visible => false

          lis[1].should have_css 'input', :type => 'checkbox'
          lis[1].should have_css 'label', :text => 'Custom infowindows.'
          lis[1].should have_css '.label_price', :text => '($350)'
          lis[1].should have_content 'This includes an ad-hoc design of your map infowindows.'
          lis[1].should have_css '.ellipsis', :text => '...'
          lis[3].should have_css '.option_price', :visible => false

          lis[2].should have_css 'input', :type => 'checkbox'
          lis[2].should have_css 'label', :text => 'Different markers for different categories.'
          lis[2].should have_css '.label_price', :text => '($200)'
          lis[2].should have_content 'This allows you to visual differentiate the features - styles may change-.'
          lis[2].should have_css '.ellipsis', :text => '...'
          lis[3].should have_css '.option_price', :visible => false

          lis[3].should have_css 'input', :type => 'checkbox'
          lis[3].should have_css 'label', :text => 'Dynamic clusters.'
          lis[3].should have_css '.label_price', :text => '($350)'
          lis[3].should have_content 'Creates a cluster when a lot of points are close each other - styles may change-.'
          lis[3].should have_css '.ellipsis', :text => '...'
          lis[3].should have_css '.option_price', :visible => false

        end

        within '.total' do
          page.should have_content 'Total'
          page.should have_content 'Starting from $2000'
        end

        check 'Dynamic filters.'
        check 'Different markers for different categories.'

        within '.options' do
          lis = all('li.selected')

          lis[0].should have_css 'input', :type => 'checkbox', :checked => true
          lis[0].should have_css 'label', :text => 'Dynamic filters.'
          lis[0].should have_css '.label_price', :visible => false
          lis[0].should have_content 'This allows you to filter the features in your map dynamically.'
          lis[0].should have_css '.ellipsis', :visible => false
          lis[0].should have_css '.option_price', :text => '$350', :visible => true

          lis[1].should have_css 'input', :type => 'checkbox', :checked => true
          lis[1].should have_css 'label', :text => 'Different markers for different categories.'
          lis[1].should have_css '.label_price', :visible => false
          lis[1].should have_content 'This allows you to visual differentiate the features - styles may change-.'
          lis[1].should have_css '.ellipsis', :visible => false
          lis[1].should have_css '.option_price', :text => '$200', :visible => true
        end

        within '.total' do
          page.should have_content 'Total'
          page.should have_content 'Starting from $2550'
        end

      end

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

  scenario 'allows customers their contact info'
  scenario 'allows customers to add further explanations about the data'
  scenario 'allows customers to place them if all data is ok'

end
