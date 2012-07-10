MaaS::Application.routes.draw do
  resources :templates

  match "orders/new/:page" => "orders#new"

  resources :orders do
    resources :payments
  end

  match "home/show" => "home#show"

  resources :demo

  root :to => 'home#index'
end
