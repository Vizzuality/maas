FactoryGirl.define do

  factory :order do

    factory :awesome_map_order do
      name 'Acme'
      email 'coyote@acme.inc'
      comments 'Bla bla bla bla ...'
      total 50
    end

  end

end
