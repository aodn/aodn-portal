/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.TermClassificationStore = Ext.extend(Ext.data.XmlStore, {

    constructor : function() {
        var config = {
            record : 'dimension',
            totalProperty: 'summary/@count',
            fields: Portal.data.TermClassification
        };
        Portal.data.TermClassificationStore.superclass.constructor.call(this, config);
    },

    getBroaderTerms: function(term, depth, dimensionName) {

      function searchBroaderTerms(term, depth, categories) {
          var foundTerms = [];
          if(categories[term]) {
              Ext.each(categories[term], function(item) {
                  if(item.depth == depth) {
                      foundTerms.push(item.broader);
                  }
                  else {
                      foundTerms = foundTerms.concat(searchBroaderTerms(item.broader , depth, categories));
                  }
              });
          }
          return foundTerms;
      };
      found = [];
      Ext.each(this.data.items, function( dimension) {
          if(dimensionName in dimension.data.categories) {
              found = searchBroaderTerms( term, depth, dimension.data.categories );
          }
      });
      return found;
    }
});
