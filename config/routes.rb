MaaS::Application.routes.draw do
  ActiveAdmin.routes(self)

  devise_for :admin_users, ActiveAdmin::Devise.config

  match "orders/new/:page" => "orders#new"

  resources :client_data

  resources :questions
  resources :templates
  resources :faq

  resources :orders do
    resources :payments
  end

  match "home/show" => "home#show"

  resources :demo

  root :to => 'home#index'
end
