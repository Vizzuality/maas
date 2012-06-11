module OrderHelper

  def markers_template_specs
    within '#templates-list' do
      page.should have_css 'a', :text => 'Markers map', :class => 'selected'
    end

    within '#templates-detail .markers' do
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
        lis[0].should have_css '.option_price', :visible => false

        lis[1].should have_css 'input', :type => 'checkbox'
        lis[1].should have_css 'label', :text => 'Custom infowindows.'
        lis[1].should have_css '.label_price', :text => '($350)'
        lis[1].should have_content 'This includes an ad-hoc design of your map infowindows.'
        lis[1].should have_css '.ellipsis', :text => '...'
        lis[1].should have_css '.option_price', :visible => false

        lis[2].should have_css 'input', :type => 'checkbox'
        lis[2].should have_css 'label', :text => 'Different markers for different categories.'
        lis[2].should have_css '.label_price', :text => '($200)'
        lis[2].should have_content 'This allows you to visual differentiate the features - styles may change-.'
        lis[2].should have_css '.ellipsis', :text => '...'
        lis[2].should have_css '.option_price', :visible => false

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

  def polygons_template_specs
    click_on 'Polygons map'

    within '#templates-list' do
      page.should have_css 'a', :text => 'Polygons map', :class => 'selected'
    end

    within '#templates-detail .polygons' do
      find('h4', :text => 'Polygons map').should be_visible
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
        lis[0].should have_css '.option_price', :visible => false

        lis[1].should have_css 'input', :type => 'checkbox'
        lis[1].should have_css 'label', :text => 'Custom infowindows.'
        lis[1].should have_css '.label_price', :text => '($350)'
        lis[1].should have_content 'This includes an ad-hoc design of your map infowindows.'
        lis[1].should have_css '.ellipsis', :text => '...'
        lis[1].should have_css '.option_price', :visible => false

        lis[2].should have_css 'input', :type => 'checkbox'
        lis[2].should have_css 'label', :text => 'Different polygons for different categories.'
        lis[2].should have_css '.label_price', :text => '($200)'
        lis[2].should have_content 'This allows you to visual differentiate the features - styles may change-.'
        lis[2].should have_css '.ellipsis', :text => '...'
        lis[2].should have_css '.option_price', :visible => false

      end

      within '.total' do
        page.should have_content 'Total'
        page.should have_content 'Starting from $2000'
      end

    end
  end

  def thematic_template_specs
    click_on 'Thematic map'

    within '#templates-list' do
      page.should have_css 'a', :text => 'Thematic map', :class => 'selected'
    end

    within '#templates-detail .thematic' do
      find('h4', :text => 'Thematic map').should be_visible
      find('p', :text => 'Including base interactivity, mouse-over effects and basic infowindows.').should be_visible
      find('.price', :text => '$2000').should be_visible
      find('.options').should be_visible

      within '.visualization_method' do
        lis = all('li')

        lis[0].should have_css 'input', :type => 'radio'
        lis[0].should have_css 'label', :text => 'Choropleth map'
        lis[0].should have_content 'Shows values coloring the geographic features in different colors or intensities.'

        lis[1].should have_css 'input', :type => 'radio'
        lis[1].should have_css 'label', :text => 'Bubble map'
        lis[1].should have_content 'Shows values through bubbles of different size.'

      end

      within '.options' do
        lis = all('li')

        lis[0].should have_css 'input', :type => 'checkbox'
        lis[0].should have_css 'label', :text => 'Variable selection.'
        lis[0].should have_css '.label_price', :text => '($350)'
        lis[0].should have_content 'This allows your users to toggle between different variables to visualize.'
        lis[0].should have_css '.ellipsis', :text => '...'
        lis[0].should have_css '.option_price', :visible => false

        lis[1].should have_css 'input', :type => 'checkbox'
        lis[1].should have_css 'label', :text => 'Custom infowindows.'
        lis[1].should have_css '.label_price', :text => '($350)'
        lis[1].should have_content 'This includes an ad-hoc design of your map infowindows.'
        lis[1].should have_css '.ellipsis', :text => '...'
        lis[1].should have_css '.option_price', :visible => false

        lis[2].should have_css 'input', :type => 'checkbox'
        lis[2].should have_css 'label', :text => 'Custom geographic regions.'
        lis[2].should have_css '.label_price', :text => '($350)'
        lis[2].should have_content 'Define the geographic regions you want to use instead of the default ones.'
        lis[2].should have_css '.ellipsis', :text => '...'
        lis[2].should have_css '.option_price', :visible => false

      end

      within '.total' do
        page.should have_content 'Total'
        page.should have_content 'Starting from $2000'
      end

    end
  end

  def density_template_specs
    click_on 'Density map'

    within '#templates-list' do
      page.should have_css 'a', :text => 'Density map', :class => 'selected'
    end

    within '#templates-detail .density' do
      find('h4', :text => 'Density map').should be_visible
      find('p', :text => 'Includes data process & visualization.').should be_visible
      find('.price', :text => '$2000').should be_visible
      find('.options').should be_visible

      within '.visualization_method' do
        lis = all('li')

        lis[0].should have_css 'input', :type => 'radio'
        lis[0].should have_css 'label', :text => 'Rectangular grid'
        lis[0].should have_content 'Group and represent data using a rectangular grid.'

        lis[1].should have_css 'input', :type => 'radio'
        lis[1].should have_css 'label', :text => 'Hexagonal grid'
        lis[1].should have_content 'Group and represent data using an hexagonal grid.'

      end

      within '.options' do
        lis = all('li')

        lis[0].should have_css 'input', :type => 'checkbox'
        lis[0].should have_css 'label', :text => 'Variable selection.'
        lis[0].should have_css '.label_price', :text => '($350)'
        lis[0].should have_content 'This allows your users to toggle between different variables to visualize.'
        lis[0].should have_css '.ellipsis', :text => '...'
        lis[0].should have_css '.option_price', :visible => false

      end

      within '.total' do
        page.should have_content 'Total'
        page.should have_content 'Starting from $2000'
      end

    end
  end

  def dont_know_template_specs
    click_on "Don't know"

    within '#templates-list' do
      page.should have_css 'a', :text => "Don't know", :class => 'selected'
    end

    within '#templates-detail .dont_know' do
      find('h4', :text => 'Custom consultancy').should be_visible
      find('p', :text => 'Just send us your data and a brief idea of what you need to analyze, and we will give you the best option to represent it and the corresponding estimate.').should be_visible
      page.should_not have_css '.price'
      page.should_not have_css '.total'
    end
  end

end

RSpec.configure { |config| config.include OrderHelper }
