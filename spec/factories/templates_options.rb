# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  factory :template_option do

    factory :dynamic_filters do
      name 'dynamic_filters'
      description 'a'
      price 350
    end

    factory :custom_infowindows do
      name 'custom_infowindows'
      description 'b'
      price 350
    end

    factory :different_markers do
      name 'different_markers'
      description 'c'
      price 200
    end

    factory :dynamic_clusters do
      name 'dynamic_clusters'
      description 'd'
      price 350
    end

    factory :different_polygons do
      name 'different_polygons'
      description 'e'
      price 200
    end

    factory :variable_selection do
      name 'variable_selection'
      description 'f'
      price 350
    end

    factory :custom_regions do
      name 'custom_regions'
      description 'g'
      price 350
    end

  end

end
