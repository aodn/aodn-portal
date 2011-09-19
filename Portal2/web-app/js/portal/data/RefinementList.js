Ext.namespace('Portal.data');

/** api: (define) 
 *  module = Portal.data
 *  class = RefinementList
 */
/** api: method[RefinementList] 
 *
 *   Class used to maintain a list of refinements
 *
*/

Portal.data.RefinementList = function() {};

Portal.data.RefinementList.prototype = function () {
   var refinements = {};
   
   return {
      add: function(facet, value) {
         if (!refinements[facet]) {
            refinements[facet] = {};
         }
         refinements[facet][value] = null;
      },
      
      remove: function(facet, value) {
         if (!refinements[facet]) return;
         delete refinements[facet][value];
         if (this.isEmptyObject(refinements[facet])) {
            delete refinements[facet];
         }
      },
      
      clear: function() {
         refinements = {};
      },
      
      contains: function(facet, value) {
         return refinements.hasOwnProperty(facet) && refinements[facet].hasOwnProperty(value);
      },
      
      getJson: function() {
         var jsonData = [];
         for (var facet in refinements) {
            var values = refinements[facet];
            var jsonValues = [];
            for (var value in values) {
               jsonValues.push({value: value});
            }
            jsonData.push({name: facet, values: jsonValues});
         }
         return jsonData;
      },

      getArray: function() {
         var arrayData = [];
         for (var facet in refinements) {
            var values = refinements[facet];
            for (var value in values) {
               arrayData.push({name: facet, value: value});
            }
         }
         return arrayData;
      },

      isEmptyObject: function(obj) {
         for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
               return false;
            }
         }
         return true;
      }
      
   };
     
} ();


