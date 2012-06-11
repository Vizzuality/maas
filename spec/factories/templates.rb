# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  factory :template do

    factory :markers do
      name 'markers'
      price 2000

      after(:create) do |template, evaluator|
        FactoryGirl.create(:dynamic_filters,    template: template)
        FactoryGirl.create(:custom_infowindows, template: template)
        FactoryGirl.create(:different_markers,  template: template)
        FactoryGirl.create(:dynamic_clusters,   template: template)
      end
    end

    factory :polygons do
      name 'polygons'
      price 2000

      after(:create) do |template, evaluator|
        FactoryGirl.create(:dynamic_filters,    template: template)
        FactoryGirl.create(:custom_infowindows, template: template)
        FactoryGirl.create(:different_polygons,  template: template)
      end
    end

    factory :thematic do
      name 'thematic'
      price 2000

      after(:create) do |template, evaluator|
        FactoryGirl.create(:choropleth, template: template)
        FactoryGirl.create(:bubble,     template: template)

        FactoryGirl.create(:variable_selection, template: template)
        FactoryGirl.create(:custom_infowindows, template: template)
        FactoryGirl.create(:custom_regions,     template: template)
      end
    end

    factory :density do
      name 'density'
      price 2000

      after(:create) do |template, evaluator|
        FactoryGirl.create(:rectangular_grid, template: template)
        FactoryGirl.create(:hexagonal_grid,   template: template)

        FactoryGirl.create(:variable_selection, template: template)
      end
    end

    factory :dont_know do
      name 'dont_know'
    end

  end

end
