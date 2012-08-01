class AddInvoiceUuidAccountCodeAndInvoiceStateToPayments < ActiveRecord::Migration
  def change
    add_column :payments, :invoice_uuid, :string
    add_column :payments, :account_code, :string
    add_column :payments, :invoice_state, :string
  end
end
