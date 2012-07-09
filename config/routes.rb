MaaS::Application.routes.draw do
  resources :templates

  match "orders/new/:page" => "orders#new"

  resources :orders do
    resources :payments
  end

  resources :demo

  root :to => 'home#index'
end
