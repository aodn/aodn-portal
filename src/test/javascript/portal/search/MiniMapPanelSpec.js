
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.CloneMapPanel", function() {
  
  var testWindow;
  var cloneMapPanel;
  
  beforeEach(function() {
    testWindow = new Ext.Window();
    cloneMapPanel = new Portal.search.CloneMapPanel({initialBbox: '130,-60,160,-20'});
  });
  
  afterEach(function() {
    testWindow.close();
  });
  
  it("should change map extent when setExtent called and not trigger extentchange event", function() {

    // add a base layer - required if map is to be rendered
    var layer = new OpenLayers.Layer.WMS(
       "World Bathymetry",
       "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi", 
       {layers: "HiRes_aus-group"},
       {tileSize: new OpenLayers.Size(256,256), buffer: 1 }
    );
    
    cloneMapPanel.map.addLayer(layer);
    
    testWindow.add(cloneMapPanel);
    testWindow.show();

    var oldBounds = cloneMapPanel.map.getExtent();
    
    spyOn(cloneMapPanel, 'fireEvent');
    
    cloneMapPanel.setBounds({northBL: -22, westBL: -55, eastBL: -20, southBL: -25});
    
    var newBounds = cloneMapPanel.map.getExtent();
    
    expect(cloneMapPanel.fireEvent).not.toHaveBeenCalledWith('extentchange');
    expect(newBounds.top).not.toEqual(oldBounds.top);
    expect(newBounds.left).not.toEqual(oldBounds.left);
    expect(newBounds.right).not.toEqual(oldBounds.right);
    expect(newBounds.bottom).not.toEqual(oldBounds.bottom);
  });
});
