require_relative 'acceptance_helper'

feature 'MapMe payments', :js => :selenium do

  let(:awesome_map_order) { FactoryGirl.create(:awesome_map_order) }

  background do
    visit new_order_payment_path(awesome_map_order)
  end

  context 'allows customers to pay their brand new maps', :vcr => true do

    scenario 'if all payment data is correct', :js => :selenium do

      within 'form' do

        within '.contact_info' do
          within '.first_name' do find('input').set 'Naruto'           end
          within '.last_name'  do find('input').set 'Uzumaki'          end
          within '.email'      do find('input').set 'naruto@konoha.jp' end
        end

        within '.billing_info' do
          within '.first_name'  do find('input').set 'Naruto'              end
          within '.last_name'   do find('input').set 'Uzumaki'             end
          within '.card_number' do find('input').set '4111-1111-1111-1111' end
          within '.cvv'         do find('input').set '666'                 end

          within '.expires' do
            page.should have_content 'Expires'
            within '.month' do find('option[value="1"]').set true   end
            within '.year'  do find('option[name="2013"]').set true end
          end

          within '.address' do
            within '.address1'   do find('input').set 'Hokage street'   end
            within '.address2'   do find('input').set '6'               end
            within '.city'       do find('input').set 'Konoha'          end
            within '.state'      do find('input').set 'Gakure'          end
            within '.zip'        do find('input').set '66666'           end
            within '.country'    do find('option[value="JP"]').set true end
          end

          within '.vat_number' do find('input').set '111' end
        end

        expect do
          click_on 'Pay'
          wait_until { Payment.count == 1 }
        end.to change{ Payment.count }.by(1)

      end

      payment = Payment.last
      payment.recurly_token.should_not be_empty
      payment.order_id.should be == awesome_map_order.id
    end

  end

  context "doesn't allow customers to pay their brand new maps" do
    scenario "if all payment data isn't correct"
  end

end
