MaaS::Application.routes.draw do
  resources :templates

  resources :orders do
    resources :payments
  end

  root :to => 'home#index'
end
