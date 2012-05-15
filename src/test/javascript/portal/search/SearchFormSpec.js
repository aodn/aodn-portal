describe("Portal.search.SearchForm", function() 
{

  var testWindow;
  
  var buildMockSearchForm = function() {
    var searchController = new Portal.search.SearchController();

    return new Portal.search.SearchForm({searchController: searchController});
  };

  beforeEach(function() {
    testWindow = new Ext.Window();
  });
  
  afterEach(function() {
    testWindow.close();
  });
  
  it("creates search form with default options on instantiation", function() {
    var searchForm = buildMockSearchForm();

    expect(searchForm.items.getCount()).toEqual(4);
  });
  
// HTMLUnit can't run this (IE mode)  
//  it("modifies existing bounding box criteria when setExtent called", function()
//  {
//    var searchForm = buildMockSearchForm();
//    testWindow.add(searchForm);
//    testWindow.show();
//
//    var oldBounds = {northBL: -22, westBL: -55, eastBL: -20, southBL: -25};
//    searchForm.setExtent(oldBounds);
//    
//    // add bounding box criteria
//    var combo = searchForm.advancedSearchCombo;
//    var comboStore = combo.getStore();
//    var boundingBoxRec = comboStore.getById('2'); 
//    combo.fireEvent('select', searchForm.advancedSearchCombo, boundingBoxRec, 1);
//    
//    var newBounds = {northBL: -35, westBL: -150, eastBL: -120, southBL: -75};
//    
//    searchForm.setExtent(newBounds);
//    
//    var boundingBoxField = searchForm.searchFieldSelector.findByType('portal.search.field.boundingbox')[0];
//    
//    expect(boundingBoxField.northBL.getValue()).toEqual(-35);
//    expect(boundingBoxField.southBL.getValue()).toEqual(-75);
//    expect(boundingBoxField.eastBL.getValue()).toEqual(-120);
//    expect(boundingBoxField.westBL.getValue()).toEqual(-150);
//  });
});
