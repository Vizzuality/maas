require_relative 'acceptance_helper'

feature 'MapMe home' do
  background do
    visit root_path
  end

  scenario 'has a header with a navigation menu' do

    within 'header' do

      page.should have_link 'MapMe!'

      within 'nav' do
        page.should have_link 'How does it work'
        page.should have_link 'Why MapMe'
        page.should have_link 'Showcase'
        page.should have_link 'Order your map'
        page.should have_link 'FAQ'
      end

      page.should have_content 'Let us turn your data into an interactive map'
      page.should have_content 'Hand crafted, personalized and fit to your needs in less than 2 weeks and $3,000'
      page.should have_link 'Order your map'

      click_on 'Order your map'
    end

    current_path.should be == '/orders/new'
  end

  scenario 'has a section about how does mapme works' do

    within '.how_does_it_work' do
      page.should have_content 'How does it work'

      page.should have_css '.explanation', :length => 3
      page.should have_css '.explanation', :text => 'You send us your data and select your visualization template.'
      page.should have_css '.explanation', :text => 'We analyze your data and send you a budget.'
      page.should have_css '.explanation', :text => 'After a couple of days, you receive your map ready-to-publish.'

      page.should have_link 'Order your map'

      click_on 'Order your map'
    end

    current_path.should be == '/orders/new'

  end

  scenario 'has a section about the reasons to use mapme' do

    within '.why_mapme' do
      page.should have_content 'Why MapMe?'

      page.should have_css '.reason h3', :text => 'Custom solutions'
      page.should have_css '.reason h3', :text => "It's efficient"
      page.should have_css '.reason h3', :text => 'Source code included'
      page.should have_css '.reason h3', :text => "It's flexible"
      page.should have_css '.reason h3', :text => 'Powered by data'
      page.should have_css '.reason h3', :text => 'Different basemaps'

      page.should have_css '.reason', :text => 'All the maps delivered by MapMe are made ad-hoc for each client. We will find the best solution for your data.'
      page.should have_css '.reason', :text => 'With an experiencied team doing maps, we can have your map ready in just few days. More effective than doing yourself.'
      page.should have_css '.reason', :text => 'With every map, we deliver the complete source code of the visualization, so if you feel brave enough, you will be able to edit, modify or even repeat the work yourself for similar use cases.'
      page.should have_css '.reason', :text => "Creating a map doesn't mean to be boring. Since we use CartoDB we can do *almost* whatever you need. Custom styles, animations, infowindows, effects, etc..."
      page.should have_css '.reason', :text => 'If you have a CartoDB account, you will be able to update your data and see the results on your dynamic map.'
      page.should have_css '.reason', :text => 'You can have your maps over Google Maps, MapBox tiles or your own base layer.'
    end

  end

  scenario 'has a showcase of maps' do

    within '.showcase' do
      page.should have_content 'Showcase'
      page.should have_css 'img', :length => 7
      page.should have_css '.previous'
      page.should have_css '.next'
    end

  end

  scenario 'has a big button to order a new map' do

    within '.interested' do
      page.should have_content 'Interested?'
      page.should have_link 'Order your map and ask for a budget with no compromises'
      click_on 'Order your map and ask for a budget with no compromises'
    end

    current_path.should be == '/orders/new'

  end

  scenario 'has a footer' do

    within 'footer' do
      page.should have_content 'MapMe!'

      within '.understand' do
        page.should have_content 'Understand the service'
        page.should have_link 'How it works'
        page.should have_link 'Why MapMe'
        page.should have_link 'FAQ'
      end

      within '.see_results' do
        page.should have_content 'See our results'
        page.should have_link 'Showcase'
        page.should have_link 'Order your map'
        page.should have_link 'Blog'
      end

      within '.know_more' do
        page.should have_content 'Know more'
        page.should have_link 'Contact us'
      end

    end

  end

end

