Ext.namespace('Portal.search');

Portal.search.SearchForm = Ext.extend(Ext.FormPanel, {
   url: '',
   defaultType: 'textfield',

   padding: '15px 0px 0px 15px',
   layout: 'hbox',
   autoHeight: true,
   width: 800,
   buttonAlign: 'left',
   footerStyle: 'padding:5px 0px 10px 10px',

   //TODO: Refactor into components
   initComponent: function() {
      var opensearchSuggest = Portal.app.config.catalogUrl + '/srv/en/main.search.suggest';
   
      this.items = [
         {
            ref: 'searchFields', 
            xtype: 'container',
            layout: 'form',
            labelWidth: 125,
            autoHeight: true,
            flex: 1,
            items: [{
               xtype: 'portal.search.field.freetext'
            }]                
         },{
            ref: 'searchFieldSelector',
            xtype: 'container',
            width: 230,
            layout: 'form',
            labelWidth: 80,
            items: [{
               ref: '../advancedSearchCombo',
               fieldLabel: 'Add criteria',
               submitValue: false,
               xtype: 'combo',
               width: 100,
               mode: 'local',
               editable: false,
               filters: [],
               store: new Ext.data.ArrayStore({
                  id: 0,
                  fields: [
                     'id',
                     'displayText',
                     'multipleOk',
                     'field'
                  ],
                  data: [
                     [1, 'Date range', false, {xtype: 'portal.search.field.daterange'}],
                     [2, 'Bounding Box', false, {xtype: 'portal.search.field.boundingbox'}],
                     //TODO: replace geonetwork opensearch?
                     [3, 'Keyword', false, {
                        fieldLabel: 'Keyword',
                        name: 'themekey',
                        field: 'keyword',
                        minChars: 1,
                        xtype: 'portal.search.field.opensearchsuggestiontextfield',
                        proxyUrl: proxyURL,
                        url: opensearchSuggest,
                        hideLabel: false,
                        width: 250}],
                     [4, 'Parameter', false, {
                        fieldLabel: 'Parameter',
                        name: 'dataparam',
                        field: 'dplongname',
                        minChars: 1,
                        xtype: 'portal.search.field.opensearchsuggestiontextfield',
                        proxyUrl: proxyURL,
                        url: opensearchSuggest,
                        hideLabel: false,
                        width: 250}],
                     [5, 'Organisation', false, {
                        fieldLabel: 'Organisation',
                        name: 'orgName',
                        field: 'orgName',
                        minChars: 1,
                        xtype: 'portal.search.field.opensearchsuggestiontextfield',
                        proxyUrl: proxyURL,
                        url: opensearchSuggest,
                        hideLabel: false,
                        width: 250}],
                     [6, 'Map Layer', false, {
                    	fieldLabel: 'Map Layer',
                    	name: 'protocol',
                    	xtype: 'checkbox',
                    	checked: true,
                    	getValue: function() {return this.checked?"OGC:WMS-1.1.1-http-get-map or OGC:WMS-1.3.0-http-get-map":"";},
                    	width: 250}]
                  ]
               }),
               valueField: 'xtype',
               displayField: 'displayText',
               listeners:{
                  scope: this,
                  'select': this.searchFieldSelectorSelect
               }
            }]
         }
      ];

      this.buttons = [{
         text: 'Search',
         ref: '../searchButton'
      }];

      Portal.search.SearchForm.superclass.initComponent.apply(this, arguments);
      
      this.addEvents('search');

      this.mon(this.searchButton, 'click', this.onSearch, this);
   },
   
   setExtent: function(bounds) {
      this.bounds = bounds;

      var bboxes = this.searchFields.findByType('portal.search.field.boundingbox');

      for (var i = 0; i<bboxes.length; i++){
          bboxes[i].setBox(bounds);
      };      
   },
   
   //TODO: Create new search critera wrapper component?
   searchFieldSelectorSelect: function(combo, record) {
      var field = record.get('field');
      var id = record.get('id');
      var multipleOk = record.get('multipleOk');
      
      var comp = this.searchFields.add({
         xtype: 'container',
         layout: 'hbox',
         fieldId: id,
         labelWidth: 125,
         items: [{
               xtype: 'container',
               layout: 'form',
               width: 400,
               items: field
            },{
               ref: 'removeField',
               xtype: 'button',
               text: 'Remove',
               listeners:{
                  scope: this,
                  'click': this.removeFieldClick
               }
            }
         ]
      });
      

      if (!multipleOk) {
         this.advancedSearchCombo.filters.push(id);
         combo.store.filterBy(
            function(record) {
               var id = record.get('id');
               return this.filters.indexOf(id)==-1;
            },
            combo
         );
      };
      
      combo.clearValue();
      this.refreshDisplay();

      //TODO: must be a better way to do this
      if (field.xtype == 'portal.search.field.boundingbox') {
         comp.items.itemAt(0).items.itemAt(0).setBox(this.bounds);
      };

   },
   
   refreshDisplay: function() {
      this.syncSize();
      
      //TODO: use contentChange event - this sucks
      this.ownerCt.syncSize();
      this.ownerCt.ownerCt.syncSize();
      this.doLayout();      
   },
   
   removeFieldClick: function(btn) {
      var comp = btn.ownerCt;
      
      this.advancedSearchCombo.filters.remove(comp.fieldId);
      this.advancedSearchCombo.store.filterBy(
         function(record) {
            var id = record.get('id');
            return this.filters.indexOf(comp.fieldId)==-1;
         },
         this.advancedSearchCombo
      );
      this.searchFields.remove(comp.getId());
      
      this.refreshDisplay();
   },

   afterRender: function() {
      Portal.search.SearchForm.superclass.afterRender.call(this);

      // Launch search when enter key pressed in form
      var map = new Ext.KeyMap(
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
      var fieldValues = this.getForm().getFieldValues();
      
      for (var fieldName in fieldValues) {
         var values = fieldValues[fieldName];
         if (Ext.isArray(values)) {
            for (var i = 0; i < values.length; i++) {
               searchFilters.push({name: fieldName, value: values[i]});
            }
         } else {
            searchFilters.push({name: fieldName, value: values});
         }
      }
      
      return searchFilters;
   }    
   
});
    
Ext.reg('portal.search.searchform', Portal.search.SearchForm);

