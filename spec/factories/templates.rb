# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  factory :template do

    factory :markers do
      name 'markers'
      price 2300

      after(:create) do |template, evaluator|

        FactoryGirl.create(:different_markers_for_different_categories,   template: template)
        FactoryGirl.create(:custom_infowindows, template: template)
        FactoryGirl.create(:dynamic_filters,    template: template)

      end
    end

    factory :polygons do
      name 'polygons'
      price 2500

      after(:create) do |template, evaluator|

        # Options
        FactoryGirl.create(:dynamic_filters,    template: template)
        FactoryGirl.create(:custom_infowindows, template: template)
        FactoryGirl.create(:different_styles_for_different_types_of_polygons,  template: template)

      end
    end

    factory :thematic do
      name 'thematic'
      price 3500

      after(:create) do |template, evaluator|
        
        # Visualization methods
        FactoryGirl.create(:choropleth_map,     template: template)
        FactoryGirl.create(:bubble_map,         template: template)

        # Options
        FactoryGirl.create(:variable_selection, template: template)
        FactoryGirl.create(:custom_infowindows, template: template)
      end
    end

    factory :density do
      name 'density'
      price 2500

      after(:create) do |template, evaluator|

        FactoryGirl.create(:hexagonal_grid,     template: template)
        FactoryGirl.create(:rectangular_grid,   template: template)
        FactoryGirl.create(:variable_selection, template: template)

      end
    end

    factory :dont_know do
      name 'dont_know'
      price 0
    end

  end

end
