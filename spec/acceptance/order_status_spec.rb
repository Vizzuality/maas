require_relative 'acceptance_helper'

feature 'Order status' do

  context 'placed' do

    scenario 'are reviewed by the Vizzuality crew'

    context 'reviewed by Vizzuality' do

      scenario 'may need customer feedback'
      scenario 'can be cancelled'
      scenario 'can be accepted by Vizzuality'

      context 'accepted by Vizzuality' do

        scenario 'can be rejected by the client'
        scenario 'can be accepted by the client'

        context 'accepted by the client' do

          scenario 'are finished by the Vizzuality team'

          context 'finished by Vizzuality' do

            scenario 'may need final customer feedback'
            scenario 'may be reopened'

          end
        end
      end

    end

  end
end
