# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  factory :visualization_method do

    factory :choropleth do
      name "choropleth"
    end

    factory :bubble do
      name "bubble"
    end

    factory :rectangular_grid do
      name "rectangular_grid"
    end

    factory :hexagonal_grid do
      name "hexagonal_grid"
    end

  end

end
