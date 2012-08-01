class Order < ActiveRecord::Base
  extend FriendlyId
  friendly_id :name, use: :slugged

  attr_accessible :name,
                  :email,
                  :slug,
                  :template_type,
                  :visualization_method_id,
                  :comments,
                  :total,
                  :data_sources_attributes,
                  :order_options_attributes,
                  :client_data_attributes

  belongs_to :visualization_method
  belongs_to :template, :foreign_key => 'template_type'
  has_many :data_sources
  has_many :payments
  has_many :order_options
  has_many :client_data

  accepts_nested_attributes_for :data_sources
  accepts_nested_attributes_for :order_options, :reject_if => proc { |attributes|
    attributes[:template_option_id].blank? || attributes[:template_option_id] == '0'
  }
  accepts_nested_attributes_for :client_data

  validates :name, :email, :presence => true
  validates :email, :format => { :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i }

  scope :not_reviewed, where(:total => nil)

  scope :reviewed, where('total IS NOT NULL')

  scope :paid, joins(:payments).where("payments.invoice_state == 'collected'")

  scope :not_paid, joins(:payments).where("payments.invoice_state != 'collected'")

  def starting_from
    self.template.price + self.order_options.sum { |p| p.template_option.price }
  end

  def normalize_friendly_id(value)
    Digest::MD5.hexdigest(value + Time.now.to_s)
  end

  def ready_for_payment?
    read_attribute('total').present?
  end

  def paid?
    payments.present? && payments.last.paid?
  end
end
