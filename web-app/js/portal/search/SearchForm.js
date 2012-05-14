Ext.namespace('Portal.search');

Portal.search.SearchForm = Ext.extend(Ext.FormPanel, {
  url: '',
  defaultType: 'textfield',
  autoHeight: true,
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
      width: 65,
    });
    
    this.saveSearchLink = new Portal.search.SaveSearchLink({
      searchController: this.searchController,
      hidden: !Portal.app.config.currentUser
    });
    
    this.items = [
      this.searchFiltersPanel,
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
          this.saveSearchLink,
          {
            xtype: 'spacer',
            flex: 1
          },
          this.searchButton
        ]
      },
    ];

    Portal.search.SearchForm.superclass.initComponent.apply(this, arguments);

    this.addEvents('search','contentchange');
    this.relayEvents(this.searchFiltersPanel, ['bboxchange']);

    this.enableBubble('contentchange');

    this.mon(this.searchButton, 'click', this.onSearch, this);
    this.mon(this.searchFiltersPanel, 'contentchange', this.refreshDisplay, this);
    
    this.on('activate', this.refreshDisplay, this);    
  },

  setExtent: function(bounds) {
    this.bounds = bounds;

    var bboxes = this.searchFiltersPanel.findByType('portal.search.field.boundingbox');

    for (var i = 0; i<bboxes.length; i++){
      bboxes[i].setBox(bounds);
    }      
  },
  
  refreshDisplay: function() {

    this.doLayout();
//  this.syncSize();
    // let parent components know that the size of this component may have changed!
    this.fireEvent('contentchange');
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
    this.fireEvent("search", this);
  },

  addSearchFilters: function(searchFilters) {
    var fieldValues = this.getForm().getFieldValues(), protocolFilter=false;

    for (var fieldName in fieldValues) {
      var values = fieldValues[fieldName];
      if (Ext.isArray(values)) {
        for (var i = 0; i < values.length; i++) {
          searchFilters.push({name: fieldName, value: values[i]});
        }
      } else {
        searchFilters.push({name: fieldName, value: values});
        if (fieldName=="protocol") protocolFilter=true;
      }
    }

    // default is to show layers only
    if (!protocolFilter) searchFilters.push({name: "protocol", value: Portal.app.config.metadataLayerProtocols.split("\n").join(' or ')});

    return searchFilters;
  },
  
  setActionSide: function(actionSide) {
    this.searchFiltersPanel.setActionSide(actionSide);
  }
});

Ext.reg('portal.search.searchform', Portal.search.SearchForm);

