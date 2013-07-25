
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.SearchForm = Ext.extend(Ext.FormPanel, {
  url: '',
  defaultType: 'textfield',
  autoScroll: true,
  buttonAlign: 'left',
  footerStyle: 'padding:5px 0px 10px 10px',

  initComponent: function() {

    this.searchFiltersPanel = new Portal.search.filter.FiltersPanel({
      store: this.searchController.getActiveFilterStore()
    });

    this.filterSelector = new Portal.search.FilterSelector({
      store: this.searchController.getInactiveFilterStore()
    });
    
    this.searchButton = new Ext.Button({
      text: OpenLayers.i18n("searchButton"),
      width: 65
    });
    
    this.saveSearchLink = new Portal.search.SaveSearchLink({
      searchController: this.searchController,
      hidden: true
    });
    
    this.newSearchLink = new Portal.search.NewSearchLink({
      searchController: this.searchController,
      hidden: true
    });
    
    this.saveNewSpacer = new Ext.Spacer({
      width: 8,
      hidden: true
    });
    
    this.items = [
      this.searchFiltersPanel,
      {
        xtype: 'spacer',
        height: 10
      },
      this.filterSelector,
      {
        xtype: 'spacer',
        height: 10
      },
      {
        xtype: 'container',
        layout: 'hbox',
        cls: 'searchField',
        items: [
          this.newSearchLink,
          this.saveNewSpacer,
          this.saveSearchLink,
          {
            xtype: 'spacer',
            flex: 1
          },
          this.searchButton
        ]
      }
    ];

    Portal.search.SearchForm.superclass.initComponent.apply(this, arguments);

    this.addEvents('search','contentchange');
    this.relayEvents(this.searchFiltersPanel, ['bboxchange']);

    this.enableBubble('contentchange');

    this.mon(this.searchButton, 'click', this.onSearch, this);
    
    this.mon(this.searchController, 'newsearch', this.handleNewSearch, this);
 
  },

  setExtent: function(bounds) {
    this.bounds = bounds;

    var bboxes = this.searchFiltersPanel.findByType('portal.search.field.boundingbox');

    for (var i = 0; i<bboxes.length; i++){
      bboxes[i].setBox(bounds);
    }      
  },
  
  afterRender: function() {
    Portal.search.SearchForm.superclass.afterRender.call(this);

    // Launch search when enter key pressed in form
    new Ext.KeyMap(
        this.el,
        [{
          key: [10, 13],
          fn: this.onSearch,
          scope: this
        }]
    );
  },

  onSearch: function() {
    this.saveSearchLink.setVisible('currentUser' in Portal.app.config);
    this.saveNewSpacer.setVisible('currentUser' in Portal.app.config);
    this.newSearchLink.setVisible(true);
    this.fireEvent("search", this);
  },
  
  handleNewSearch: function() {
    this.saveSearchLink.setVisible(false);
    this.saveNewSpacer.setVisible(false);
    this.newSearchLink.setVisible(false);
  },

  addSearchFilters: function(searchFilters) {
    var fieldValues = this.getFieldValues(this.getForm());

    for (var fieldName in fieldValues) {
      var values = fieldValues[fieldName];
      
      if (Ext.isArray(values)) {
        this.addValueArray(searchFilters, fieldName, values);
      } else if (Ext.isString(values) && values.search(Portal.search.field.MultiSelectCombo.VALUE_DELIMITER)) {
        values = values.split(Portal.search.field.MultiSelectCombo.VALUE_DELIMITER);
        this.addValueArray(searchFilters, fieldName, values);
      } else {
        searchFilters.push({name: fieldName, value: values});
        if (fieldName=="protocol") protocolFilter=true;
      }
    }

    this.searchController.addInactiveFilterDefaults(searchFilters);

    return searchFilters;
  },

  addValueArray: function(searchFilters, fieldName, values) {
    for (var i = 0; i < values.length; i++) {
      searchFilters.push({name: fieldName, value: values[i]});
    }
  },
  
  setActionSide: function(actionSide) {
    this.searchFiltersPanel.setActionSide(actionSide);
  },
  
  /**
   * Retrieves the fields in the form as a set of key/value pairs, using the Ext.form.Field.getValue() method.
   * If multiple fields exist with the same name they are returned as an array.  
   * Same as Ext.form.BasicForm.getFieldValues() except 
   * that it ignores fields that have a submitValue property set to false  
   * @param {Boolean} dirtyOnly (optional) True to return only fields that are dirty.
   * @return {Object} The values in the form
   * 
   * TODO: Replace with an active FilterStore method that returns filter values
   */
  getFieldValues : function(form, dirtyOnly){
      var o = {},
          n,
          key,
          val;
      
      form.items.each(function(f) {
    	  var submitValue = Ext.isDefined(f.submitValue) ? f.submitValue : true;
    	  
          if (submitValue && !f.disabled && (dirtyOnly !== true || f.isDirty())) {
              n = f.getName();
              key = o[n];
              val = f.getValue();

              if(Ext.isDefined(key)){
                  if(Ext.isArray(key)){
                      o[n].push(val);
                  }else{
                      o[n] = [key, val];
                  }
              }else{
                  o[n] = val;
              }
          }
      });
      return o;
  }

});

Ext.reg('portal.search.searchform', Portal.search.SearchForm);

