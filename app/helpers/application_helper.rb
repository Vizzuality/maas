module ApplicationHelper

  def checkbox(form, id, name, value)
    render :partial => "common/checkbox", :locals => { :form => form, :id => id, :name => :name, :value => value }
  end

  def snippet(code, options = nil)
    comment       = options && options[:comment]
    snippet_class = options && options[:snippet_class]
    render :partial => "demo/snippet", :locals => { :code => code, :comment => comment, :snippet_class => snippet_class }
  end

  def color(code, name)
    render :partial => "demo/color", :locals => { :code => code, :name => name }
  end
end
