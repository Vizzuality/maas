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
      price 3000
    end

    factory :choropleths do
      name 'choropleths'
      price 4000
    end

    factory :bubble do
      name 'bubble'
      price 5000
    end

    factory :dont_know do
      name 'dont_know'
      price 6000
    end

  end

end
