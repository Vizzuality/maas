MaaS::Application.routes.draw do
  resources :client_data

  resources :questions
  resources :templates
  resources :faq

  match "orders/new/:page" => "orders#new"
  match "orders/new/:page" => "orders#new"

  resources :orders do
    resources :payments
  end
  match "home/show" => "home#show"

  resources :demo

  root :to => 'home#index'
end
