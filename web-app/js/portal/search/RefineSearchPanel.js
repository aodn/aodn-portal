
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

/**
 * @class Portal.search.RefineSearchPanel
 * @extends Ext.Panel
 * 
A RefineSearchPanel is used to refine a search on the catalog using search result facets

 * @constructor
 * @param {Object} config
 * @xtype refinesearch
 */

Portal.search.RefineSearchPanel = Ext.extend(Ext.Panel, {
   autoScroll: true,
   
   parameters: {
	   keywords: 'themekey',
	   organizationNames: 'orgName',
	   dataParameters: 'longParamName'
   },
   
   /* Example refinements data
   [
      {name: 'Parameter', values: [
         {value: 'Sea surface temperature'}, 
         {value: 'Sea water pressure'}]},
      {name: 'Type', values: [
         {value: 'Profiling Float'},
         {value: 'Mooring'}]}
   ]
    */   
   refinementsTpl: [
      '<tpl if="length &gt; 0">',
         '<div class="p-refinements">',
            '<div class="p-refinements-title">',
               '<p><span class="p-refinements-label">Filters</span><a class="p-remove-all" href="">Clear</a></p>',
            '</div>',
            '<tpl for=".">',
               '<div class="p-selected-name">',
                  '<p>{[OpenLayers.i18n("filterNames")[values.name]]}</p>',
                  '<tpl for="values">',
                     '<ul class="p-selected-values">',
                           '<li>',
                              '<p><a class="p-remove-value" href="">Remove</a>{value}</p>',
                           '</li>',
                     '</ul>',
                  '</tpl>',  
               '</div>',
            '</tpl>' , 
         '</div>',
      '</tpl>'
   ],
     
   removeSelector: '.p-remove-value',
   removeAllSelector: '.p-remove-all',

  /*  Example facets data in JSON format
  [
      {name: 'Parameter', topValues: [
         {value: 'Sea surface temperature', count: 100}, 
         {value: 'Sea water pressure', count: 200}]},
      {name: 'Type', topValues: [
         {value: 'Profiling Float', count: 35},
         {value: 'Mooring', count: 50}]}
   ],
   */
   
   tpl: [
      '<div class="p-facets">',
         '<tpl for=".">',
            '<div class="p-facet-name">',
               '<p>{[OpenLayers.i18n("filterNames")[values.name]]}</p>',
               '<ul class="p-facet-values">',
                  '<tpl for="topValues">',
                     '<li>',
                        '<a class="p-facet-value" href="">{value} ({count})</a>',
                     '</li>',
                  '</tpl>',  
               '</ul>',
            '</div>',
         '</tpl>' , 
      '</div>'
   ],
   
   valueSelector: '.p-facet-value',

   initComponent: function(){
      this.refinementsTpl = new Ext.XTemplate(this.refinementsTpl);
      this.tpl = new Ext.XTemplate(this.tpl);
      
      Portal.search.RefineSearchPanel.superclass.initComponent.call(this);
      
      /** private: event[click] 
       *  Fires when a field value is clicked
       */
      
      this.addEvents('filterchange');
   },
   
   afterRender: function(){
      Portal.search.RefineSearchPanel.superclass.afterRender.call(this);

      this.mon(this.el, 'click', this.onClick, this);

      if (this.facetStore) {
         this.mon(this.facetStore, "load", this.facetStoreLoad, this);
      };
   },

   addSearchFilters: function(searchFilters) {
      var facetValues = this.facetStore.filters.getArray();
      for (var i = 0; i < facetValues.length; i++) {
         searchFilters.push({name: this.parameters[facetValues[i].name], value: facetValues[i].value});
      }
      return searchFilters;
   },
      
   onClick: function(e){
      e.preventDefault();
      var value = e.getTarget(this.valueSelector, this.el);
      
      if (value) {
         var refinement = this.facetStore.getArray()[value.valueIndex];
         this.facetStore.filters.add(refinement.name, refinement.value);
         this.fireEvent("filterchange", this.addSearchFilters([]));
      }

      value = e.getTarget(this.removeSelector, this.el);

      if (value) {
         var refinement = this.facetStore.filters.getArray()[value.refinementIndex];
         this.facetStore.filters.remove(refinement.name, refinement.value);
         this.fireEvent("filterchange", this.addSearchFilters([]));
      }
      
      var all = e.getTarget(this.removeAllSelector, this.el);
      
      if (all) {
         this.facetStore.filters.clear();
         this.fireEvent("filterchange", this.addSearchFilters([]));
      }

   },
   
   facetStoreLoad: function() {
      this.refinementsTpl.overwrite(this.body, this.facetStore.filters.getJson());
      var refinementElements = Ext.query(this.removeSelector, this.el.dom);
      for (var i = 0; i < refinementElements.length; i++){
         refinementElements[i].refinementIndex = i;
      }
      this.tpl.append(this.body, this.facetStore.getFacets());
      var valueElements = Ext.query(this.valueSelector, this.el.dom);
      for (var i = 0; i < valueElements.length; i++){
         valueElements[i].valueIndex = i;
      }
   }
   
});

Ext.reg('portal.search.refinesearchpanel', Portal.search.RefineSearchPanel);

