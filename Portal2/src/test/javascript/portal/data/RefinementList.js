describe("Portal.data.RefinementList", function() {

   describe("instantiation", function() {

      it('Should create an empty list', function() {
         var refinementList = new Portal.data.RefinementList();

         var json = refinementList.getJson();
         
         expect(json.length).toEqual(0);
      });
      
   });
      
   describe("addition", function() {

      it('Should add facet and value to the list', function() {
          var refinementList = new Portal.data.RefinementList();
          
          refinementList.add('facet1', 'value1');
          
          var json = refinementList.getJson();
          
          expect(json.length).toEqual(1);
          var facet = json[0];
          expect(facet.name).toEqual('facet1');
          var values = facet.values;
          expect(values.length).toEqual(1);
          var value = values[0];
          expect(value.value).toEqual('value1');
      });
      
      it('Should add new value for facet to existing facet values', function() {
          var refinementList = new Portal.data.RefinementList();
          
          refinementList.add('facet1', 'value1');
          refinementList.add('facet1', 'value2');
          
          var json = refinementList.getJson();
          
          expect(json.length).toEqual(1);
          var facet = json[0];
          expect(facet.name).toEqual('facet1');
          var values = facet.values;
          expect(values.length).toEqual(2);
          expect(values[0].value).toEqual('value1');
          expect(values[1].value).toEqual('value2');
      });
      
      it('Should add new facet to existing facets', function() {
          var refinementList = new Portal.data.RefinementList();
          
          refinementList.add('facet1', 'value1');
          refinementList.add('facet1', 'value2');
          refinementList.add('facet2', 'value1');
          
          var json = refinementList.getJson();
          
          expect(json.length).toEqual(2);
          expect(json[0].name).toEqual('facet1');
          expect(json[0].values.length).toEqual(2);
          expect(json[0].values[0].value).toEqual('value1');
          expect(json[0].values[1].value).toEqual('value2');
          expect(json[1].name).toEqual('facet2');
          expect(json[1].values.length).toEqual(1);
          expect(json[1].values[0].value).toEqual('value1');
      });
      
   });
   
   describe("removal", function() {

      it('Should remove a facet value from the list', function() {
          var refinementList = new Portal.data.RefinementList();
          
          refinementList.add('facet1', 'value1');
          refinementList.add('facet2', 'value1');
          refinementList.add('facet3', 'value1');
          refinementList.add('facet1', 'value2');
          refinementList.add('facet3', 'value2');
          
          refinementList.remove('facet1','value2');
          
          var json = refinementList.getJson();
          
          expect(json.length).toEqual(3);
          expect(json[0].name).toEqual('facet1');
          expect(json[0].values.length).toEqual(1);
          expect(json[0].values[0].value).toEqual('value1');
          expect(json[1].name).toEqual('facet2');
          expect(json[1].values.length).toEqual(1);
          expect(json[1].values[0].value).toEqual('value1');
          expect(json[2].name).toEqual('facet3');
          expect(json[2].values.length).toEqual(2);
          expect(json[2].values[0].value).toEqual('value1');
          expect(json[2].values[1].value).toEqual('value2');
          
       });
       
      it('Should remove last facet on list', function() {
          var refinementList = new Portal.data.RefinementList();
          
          refinementList.add('facet1', 'value1');
          
          refinementList.remove('facet1','value1');
          
          var json = refinementList.getJson();
          
          expect(json.length).toEqual(0);
       });
       
      it('Should remove last facet value from a facet', function() {
          var refinementList = new Portal.data.RefinementList();
          
          refinementList.add('facet1', 'value1');
          refinementList.add('facet2', 'value1');
          refinementList.add('facet3', 'value1');
          refinementList.add('facet1', 'value2');
          refinementList.add('facet3', 'value2');
          
          refinementList.remove('facet2','value1');
          
          var json = refinementList.getJson();
          
          expect(json.length).toEqual(2);
          expect(json[0].name).toEqual('facet1');
          expect(json[0].values.length).toEqual(2);
          expect(json[0].values[0].value).toEqual('value1');
          expect(json[0].values[1].value).toEqual('value2');
          expect(json[1].name).toEqual('facet3');
          expect(json[1].values.length).toEqual(2);
          expect(json[1].values[0].value).toEqual('value1');
          expect(json[1].values[1].value).toEqual('value2');
          
       });
   });

   describe("clear", function() {

	      it('Should clear the list', function() {
	          var refinementList = new Portal.data.RefinementList();
	          
	          refinementList.add('facet1', 'value1');
	          refinementList.add('facet2', 'value1');
	          refinementList.add('facet3', 'value1');
	          refinementList.add('facet1', 'value2');
	          refinementList.add('facet3', 'value2');
	          
	          refinementList.clear();
	          
	          var json = refinementList.getJson();
	          
	          expect(json.length).toEqual(0);
	          
	       });
		        
	   });
	 
   describe("contains", function() {

      it('Should find facet value in the list', function() {
          var refinementList = new Portal.data.RefinementList();
          
          refinementList.add('facet1', 'value1');
          refinementList.add('facet2', 'value1');
          refinementList.add('facet3', 'value1');
          refinementList.add('facet1', 'value2');
          refinementList.add('facet3', 'value2');
          
          var result = refinementList.contains('facet2', 'value1');
          
          expect(result).toEqual(true);
          
       });
	        
	   it("Shouldn't find value not in the list", function() {
          var refinementList = new Portal.data.RefinementList();
          
          refinementList.add('facet1', 'value1');
          refinementList.add('facet2', 'value1');
          refinementList.add('facet3', 'value1');
          refinementList.add('facet1', 'value2');
          refinementList.add('facet3', 'value2');
          
          var result = refinementList.contains('facet2', 'value2');
          
          expect(result).toEqual(false);
	    });
	        
	});
   
   describe("getArray", function() {
	   it("Should return array containing all facets", function() {
	       var refinementList = new Portal.data.RefinementList();
	       
	       refinementList.add('facet1', 'value1');
	       refinementList.add('facet2', 'value1');
	       refinementList.add('facet3', 'value1');
	       refinementList.add('facet1', 'value2');
	       refinementList.add('facet3', 'value2');
	       
	       var result = refinementList.getArray();
	       
	       expect(result.length).toEqual(5);
	       expect(result[0].name).toEqual('facet1');
	       expect(result[0].value).toEqual('value1');
	       expect(result[1].name).toEqual('facet1');
	       expect(result[1].value).toEqual('value2');
	       expect(result[2].name).toEqual('facet2');
	       expect(result[2].value).toEqual('value1');
	       expect(result[3].name).toEqual('facet3');
	       expect(result[3].value).toEqual('value1');
	       expect(result[4].name).toEqual('facet3');
	       expect(result[4].value).toEqual('value2');
	   });
   });

   
});