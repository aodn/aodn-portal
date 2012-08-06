describe("Portal.search.MiniMapPanel", function() {
  
  var testWindow;
  
  beforeEach(function() {
    testWindow = new Ext.Window();
  });
  
  afterEach(function() {
    testWindow.close();
  });
  
  it("should change map extent when setExtent called and not trigger extentchange event", function() {
    var miniMapPanel = new Portal.search.MiniMapPanel({initialBbox: '130,-60,160,-20'});

    // add a base layer - required if map is to be rendered 
    var layer = new OpenLayers.Layer.WMS(
       "World Bathymetry",
       "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi", 
       {layers: "HiRes_aus-group"},
       {tileSize: new OpenLayers.Size(256,256), buffer: 1 }
    );
    
    miniMapPanel.map.addLayer(layer);
    
    testWindow.add(miniMapPanel);
    testWindow.show();

    var oldBounds = miniMapPanel.map.getExtent();
    
    spyOn(miniMapPanel, 'fireEvent');
    
    miniMapPanel.setBounds({northBL: -22, westBL: -55, eastBL: -20, southBL: -25});
    
    var newBounds = miniMapPanel.map.getExtent();
    
    expect(miniMapPanel.fireEvent).not.toHaveBeenCalledWith('extentchange');
    expect(newBounds.top).not.toEqual(oldBounds.top);
    expect(newBounds.left).not.toEqual(oldBounds.left);
    expect(newBounds.right).not.toEqual(oldBounds.right);
    expect(newBounds.bottom).not.toEqual(oldBounds.bottom);
  });
});
