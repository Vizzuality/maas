ActiveAdmin.register Order do

  scope :all, :default => true
  scope :not_reviewed do |orders|
    orders.where(:total => nil)
  end

  scope :reviewed do |orders|
    orders.where('total IS NOT NULL')
  end

  scope :paid do |orders|
    orders.joins(:payments).where("payments.invoice_state = 'collected'")
  end

  scope :not_paid do |orders|
    orders.joins(:payments).where("payments.invoice_state IS NULL OR payments.invoice_state <> 'collected'")
  end

  scope :ready do |orders|
    orders.where('map_url IS NOT NULL AND map_source_url IS NOT NULL')
  end

  index do
    column :id do |order|
      link_to order.id, admin_order_path(order)
    end
    column :name do |order|
      link_to order.name, admin_order_path(order)
    end
    column :email do |order|
      link_to order.email, admin_order_path(order)
    end
    column :template
    column :visualization_method
    column :starting_from
    column :total
    column :comments
    column :customer_files do |order|
      order.client_data.count
    end

    default_actions
  end

  show do
    panel "Order Details" do
      attributes_table_for order do
        row("id")
        row("name") {order.name }
        row("email") { order.email }
        row("template")
        row("visualization_method")
        row("order_options") { order.order_options.map{|o| t("orders.new.templates-detail.template_options.#{o.template_option.name}.name")}.join(', ') }
        row("starting_from")
        row("total")
        row("comments")
        order.client_data.each_with_index do |client_data|
          row("client_data") { link_to File.basename(client_data.data.url), client_data.data.url }
        end
        row('map_url') { if order.map_url.present? then link_to order.map_url, order.map_url else nil end }
        row('map_source_url') { if order.map_source_url.present? then link_to order.map_source_url, order.map_source_url else nil end }
      end
    end

    active_admin_comments
  end

  form do |f|
    f.inputs do
      f.input :name
      f.input :email
      f.input :total
    end

    f.inputs do
      f.input :template
      f.input :visualization_method
    end

    f.inputs do
      f.input :map_url
      f.input :map_source_url
    end

    f.buttons
  end

end
