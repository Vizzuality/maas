MaaS::Application.routes.draw do
  resources :templates

  resources :orders do
    resources :payments
  end

  resources :demo

  root :to => 'home#index'
end
