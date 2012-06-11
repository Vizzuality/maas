# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  factory :template_option do

    factory :dynamic_filters do
      name 'dynamic_filters'
      price 350
    end

    factory :custom_infowindows do
      name 'custom_infowindows'
      price 350
    end

    factory :different_markers do
      name 'different_markers'
      price 200
    end

    factory :dynamic_clusters do
      name 'dynamic_clusters'
      price 350
    end

    factory :different_polygons do
      name 'different_polygons'
      price 200
    end

    factory :variable_selection do
      name 'variable_selection'
      price 350
    end

    factory :custom_regions do
      name 'custom_regions'
      price 350
    end

  end

end
