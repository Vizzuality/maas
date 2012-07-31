MaaS::Application.routes.draw do
  ActiveAdmin.routes(self)

  devise_for :admin_users, ActiveAdmin::Devise.config

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
