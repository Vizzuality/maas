require_relative 'acceptance_helper'

feature 'MaaS orders' do

  background do
    visit new_order_path
  end

  context 'allows customers to create them' do

    scenario 'uploading custom data', :js => true do

      within 'form' do

        set_user_data

        upload_data_file

        select_template_type

        set_some_comments

        expect do
          click_on 'Place your order'
          sleep 1
        end.to change{ Order.count }.by(1)

        order = Order.last
        order.name.should == 'ACME'
        order.email.should == 'coyote@acme.com'
        order.template_type.should == 1
        order.comments.should == 'Bla bla bla...'
        order.data_sources.should have(1).data_source
        order.data_sources.last.file.url.should match(/uploads\/data_source\/file\/\d+\/whs_features\.csv/)

      end

    end

    scenario 'uploading data from a url', :js => true do

      within 'form' do

        set_user_data

        set_data_url

        select_template_type

        set_some_comments

        expect do
          click_on 'Place your order'
          sleep 1
        end.to change{ Order.count }.by(1)

        order = Order.last
        order.name.should == 'ACME'
        order.email.should == 'coyote@acme.com'
        order.template_type.should == 1
        order.comments.should == 'Bla bla bla...'
        order.data_sources.should have(1).data_source
        order.data_sources.last.file.url.should match(/uploads\/data_source\/file\/\d+\/whs_features\.csv/)

      end

    end
    scenario 'the customer can select a marker type template'
    scenario 'the customer can select a thematic type template'
    scenario 'the customer can select a density type template'
    scenario 'the customer can select a polygon type template'
  end

  context 'in the third step' do
    scenario 'the customer has to upload his data'
  end

  context 'in the fourth step' do
    scenario 'the customer can see an order summary'
    scenario 'can place the order'
  end

    scenario 'sending data by email', :js => true do

      within 'form' do

        set_user_data

        data_by_email

        select_template_type

        set_some_comments

        expect do
          click_on 'Place your order'
          sleep 1
        end.to change{ Order.count }.by(1)

        order = Order.last
        order.name.should == 'ACME'
        order.email.should == 'coyote@acme.com'
        order.template_type.should == 1
        order.comments.should == 'Bla bla bla...'
        order.data_sources.should be_blank

      end

    end

    scenario 'selecting amongst different templates', :js => true do

      within 'form' do

        fill_order_form :marker, 1

        visit new_order_path

        fill_order_form :thematic, 2

        visit new_order_path

        fill_order_form :not_sure, 3

      end

    end

    scenario 'selecting amongst different visualization features', :js => true do

      within 'form' do

        set_user_data

        upload_data_file

        select_template_type

        select_visualization_options

        set_some_comments

        expect do
          click_on 'Place your order'
          sleep 1
        end.to change{ Order.count }.by(1)

        order = Order.last
        order.name.should == 'ACME'
        order.email.should == 'coyote@acme.com'
        order.template_type.should == 1
        order.options_1.should be_true
        order.options_2.should be_true
        order.options_3.should be_true
        order.options_4.should be_true
        order.comments.should == 'Bla bla bla...'
        order.data_sources.should have(1).data_source
        order.data_sources.last.file.url.should match(/uploads\/data_source\/file\/\d+\/whs_features\.csv/)

      end

    end

  end

end
