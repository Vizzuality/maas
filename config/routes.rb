MaaS::Application.routes.draw do
  resources :orders do
    resources :payments
  end
end
