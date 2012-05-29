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
  end

end
