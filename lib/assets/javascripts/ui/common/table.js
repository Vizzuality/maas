/**
 * generic table
 *
 * this class creates a HTML table based on Table model (see below) and modify it based on model changes
 *
 * usage example:
 *
      var table = new Table({
          model: table
      });

      $('body').append(table.render().el);

  * model should be a collection of Rows

 */

/**
 * represents a table row
 */
cdb.ui.common.Row = Backbone.Model.extend({
  url: 'test'
});

cdb.ui.common.TableData = Backbone.Collection.extend({
    model: cdb.ui.common.Row,

    /** 
     * get value for row index and columnName
     */
    getCell: function(index, columnName) {
      var r = this.at(index);
      if(!r) {
        return null;
      }
      return r.get(columnName);
    }

});

/**
 * contains information about the table, mainly the schema
 */
cdb.ui.common.TableProperties = Backbone.Model.extend({
});

/**
 * renders a table row
 */
cdb.ui.common.RowView = cdb.core.View.extend({
  tagName: 'tr',

  initialize: function() {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.clean, this);
    this.add_related_model(this.model);
  },

  render: function() {
    var tr = this.$el;
    tr.html('');
    var row = this.model;
    tr.attr('id', 'row_' + row.get('id'));
    _(row.attributes).each(function(value, key) {
      var td = $('<td>');
      td.attr('id', 'cell_' + row.get('id') + '_' + key);
      td.append(value);
      tr.append(td);
    });
    return this;
  }

});

/**
 * render a table
 * this widget needs two data sources
 * - the table model which contains information about the table (columns and so on). See TableProperties
 * - the model with the data itself (TableData)
 */
cdb.ui.common.Table = cdb.core.View.extend({

  tagName: 'table',

  events: {
  },

  default_options: {
  },

  initialize: function() {
    _.defaults(this.options, this.default_options);
    this.dataModel = this.options.dataModel;
    this.rowViews = [];

    // binding
    this.dataModel.bind('reset', this.render, this);
    this.dataModel.bind('add', this.addRow, this);

    // assert the rows are removed when table is removed
    this.bind('clean', this.clear_rows, this);

    // prepare for cleaning
    this.add_related_model(this.dataModel);
    this.add_related_model(this.model);
  },

  _renderHeader: function() {
    var thead = $("<thead>");
    var tr = $("<tr>");
    _(this.model.get('schema')).each(function(col) {
      tr.append($("<td>").html(col[0]));
    });
    thead.append(tr);
    return thead;
  },

  /**
   * remove all rows
   */
  clear_rows: function() {
    _(this.rowViews).each(function(tr) {
      tr.clean();
    });
    this.rowViews = [];
  },

  /**
   * add rows
   */
  addRow: function(row) {
    var self = this;
    var tr = new cdb.ui.common.RowView({ model: row });
    self.$el.append(tr.render().el);
    self.rowViews.push(tr);
  },

  /**
   * render table
   */
  render: function() {
    var self = this;
    self.clear_rows();
    self.$el.html('');

    // render header
    self.$el.append(self._renderHeader());

    // render data
    this.dataModel.each(function(row) {
      self.addRow(row);
    });
    return this;
  }
});
