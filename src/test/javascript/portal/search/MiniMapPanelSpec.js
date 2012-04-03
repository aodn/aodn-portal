describe("Portal.search.MiniMapPanel", function() {
  
  var testWindow;
  
  beforeEach(function() {
    testWindow = new Ext.Window();
  });
  
  afterEach(function() {
    testWindow.close();
  });
  
  it("should change map extent when setExtent called and not trigger extentchange event", function() {
    var miniMapPanel = new Portal.search.MiniMapPanel();
    
    testWindow.add(miniMapPanel);
    testWindow.show();

    var oldBounds = miniMapPanel.map.getExtent();
    
    spyOn(miniMapPanel, 'fireEvent');
    
    miniMapPanel.setExtent({northBL: -22, westBL: -55, eastBL: -20, southBL: -25});
    
    var newBounds = miniMapPanel.map.getExtent();
    
    expect(miniMapPanel.fireEvent).not.toHaveBeenCalledWith('extentchange');
    expect(newBounds.top).not.toEqual(oldBounds.top);
    expect(newBounds.left).not.toEqual(oldBounds.left);
    expect(newBounds.right).not.toEqual(oldBounds.right);
    expect(newBounds.bottom).not.toEqual(oldBounds.bottom);
  });
});
