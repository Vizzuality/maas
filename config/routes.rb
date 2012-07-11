MaaS::Application.routes.draw do
  resources :templates
  resources :faq

  match "orders/new/:page" => "orders#new"
  match "orders/new/:page" => "orders#new"

  resources :orders do
    resources :payments
  end

  resources :demo

  root :to => 'home#index'
end
