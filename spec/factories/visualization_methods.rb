# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  factory :visualization_method do

    factory :choropleth_map do
      name "choropleth_map"
    end

    factory :bubble_map do
      name "bubble_map"
    end

    factory :rectangular_grid do
      name "rectangular_grid"
    end

    factory :hexagonal_grid do
      name "hexagonal_grid"
    end

  end

end
