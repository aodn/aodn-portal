Ext.namespace('Portal.search.data');

/** api: (define) 
 *  module = Portal.search.data
 *  class = FacetStore
 */
/** api: method[FacetStore] 
 *
 *   Class used to store search facets TODO: use an ExtJS store?
 *
*/

Portal.search.data.FacetStore = Ext.extend(Ext.util.Observable, {
   /** api: property[data] 
    * ``Object`` Source data object from which search facets were read (Geonetwork search summary)
    */
   data: null,
   
   include: [
      'keywords',
      'organizationNames',
      'dataParameters'
   ],
   
   /** private: method[constructor]
    *  Add 'loaded' event
    *
    */
   constructor: function(config){
      Portal.search.data.FacetStore.superclass.constructor.call(this, config);
      
      this.filters = new Portal.search.data.RefinementList(),

      /** private: event[load] 
       *  Fires after data loaded.
       */
      
      this.addEvents('load');
   },
   
   /** api: method[loadData] 
    *  :param data: ``Object`` Geonetwork summary object
    *
    *  load data from a passed summary and fires the loaded event 
    */
   loadData: function(data) {
      this.data = data;
      this.readFacets(data);
      this.onLoad();
   },
   
   readFacets: function(data) {
      this.facets = [];
      for (var fieldName in this.data) {
         var field = this.data[fieldName];
         if (!(field instanceof Array)) continue;
         for (var childName in field) {
            var children = field[childName];
            if (!(children instanceof Array)) continue;
            var topValues = [];
            for (var childIdx = 0; childIdx < children.length; childIdx++) {
               var values = children[childIdx];
               topValues.push({value: values['name'], count: values['count']});
            }
            this.facets.push({name: fieldName, topValues: topValues});
         }
      }
   },
   
   /** api: method[getFacets] 
    *
    *  return filtered facets
    */
   getFacets: function() {
      var facets = [];
      for (var fidx = 0; fidx < this.facets.length; fidx++) {
         var field = this.facets[fidx];
         if (this.include.indexOf(field.name)>-1) {
            var topValues = [];
            for (var vidx = 0; vidx < field.topValues.length; vidx++) {
               var topValue = field.topValues[vidx];
               if (this.filters.contains(field.name, topValue.value)) continue;
               topValues.push({value: topValue.value, count: topValue.count});
            }
            if (topValues.length > 0) {
               facets.push({name: field.name, topValues: topValues});
            }
         }
      }
      return facets;
   },
   
   /** api: method[getArray] 
    *
    *  returns facets from source data as a an array of facet values
    */
   getArray: function() {
      var facetValues = [];
      var jsonData = this.getFacets();
      for (var fidx = 0; fidx < jsonData.length; fidx++) {
         var facet = jsonData[fidx];
         for (var vidx = 0; vidx < facet.topValues.length; vidx++) {
            var value = facet.topValues[vidx].value;
            facetValues.push({name: facet.name, value: value});
         }
      }
      return facetValues;
   },
   
   /** api: method[onLoaded]
    *  :param e: ``Object``
    *
    * The "onLoaded" listener.
    *
    *  Listeners will be called with the following arguments:
    *
    *    * ``this`` : Portal.search.data.FacetStore
    *    * ``Object`` : Summary data formatted as a JSON object
    */
   onLoad: function(){
        this.fireEvent('load', this, this.getFacets());
   }
   
});


