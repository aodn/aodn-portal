describe("Portal.search.ResultsGrid", function() {
	
   //Mock relevant config settings
   Ext.namespace('Portal.app.config');
   Portal.app.config.catalogUrl = 'http://dummy.org.au';
   Portal.app.config.downloadCartDownloadableProtocols = "WWW:DOWNLOAD-1.0-http--download\nWWW:LINK-1.0-http--link"
      
   var testData = [{
		href: "http://geoserverdev.emii.org.au:80/geoserver/wms?SERVICE=WMS&",
		name: "topp:xbt_realtime",
		protocol: "OGC:WMS-1.1.1-http-get-map",
		title: "xbt_realtime",
		type: "application/vnd.ogc.wms_xml",
		value: ""			
	},{
		href: "http://localhost:8080/geonetwork/srv/en/google.kml?uuid=5adf6c9b-6550-4232-a8db-6a1acca8f05b&layers=topp:xbt_realtime",
		name: "topp:xbt_realtime",
		title: "xbt_realtime",
		type: "application/vnd.google-earth.kml+xml",
		value: ""
	},{
		type: "wms",
		value: "javascript:addWMSLayer([['topp:xbt_realtime','http://geoserverdev.emii.org.au:80/geoserver/wms?SERVICE=WMS&', 'topp:xbt_realtime','311836']])"
	},{
		type: "googleearth",
		value: "/geonetwork/srv/en/google.kml?uuid=5adf6c9b-6550-4232-a8db-6a1acca8f05b&layers=topp:xbt_realtime"
	}];

   var resultsRecord = Ext.data.Record.create([ 
       'links'
   ]);

   var testRecord1 = new resultsRecord({
       links: testData
  });
  
   var testRecord2 = new resultsRecord({
       links: [{
		href: "http://geoserverdev.emii.org.au:80/geoserver/wms?SERVICE=WMS&",
		name: "topp:xbt_realtime",
		title: "xbt_realtime",
		type: "application/vnd.ogc.wms_xml",
		value: ""			
	}]
  });
  
   var multiProtocolRec = new resultsRecord({
       links: [{
		href: "http://geoserverdev.emii.org.au:80/geoserver/wms?SERVICE=WMS&",
		name: "topp:xbt_realtime",
		title: "xbt_realtime",
		type: "application/vnd.ogc.wms_xml",
		value: ""			
	},{
		href: "http://geoserverdev.emii.org.au:80/geoserver/wms?SERVICE=WMS&",
		name: "topp:xbt_realtime2",
		title: "xbt_realtime2",
		type: "application/vnd.ogc.wms_xml",
		value: ""			
	}]
  });
  
    var recordDownloadableLink = new resultsRecord({
       links: [{
                protocol: "WWW:DOWNLOAD-1.0-http--download"
        },{
                protocol: "OGC:WMS-1.1.1-http-get-map"			
        }]
    });

    var recordNoDownloadableLink = new resultsRecord({
       links: [{
                protocol: "OGC:WMS-1.3.0-http-get-map"
        },{
                protocol: "OGC:WMS-1.1.1-http-get-map"			
        }]
    });
  
    var recordNoLinks = new resultsRecord({
       links: []
    });
  
    var resultGrid = new Portal.search.ResultsGrid({});
	   
    describe("getProtocolCount", function() {

      it('Should handle links containing protocol', function() {
          expect(resultGrid.getProtocolCount(testData, ["OGC:WMS-1.1.1-http-get-map"])).toEqual(1);
      });

      it('Should handle links containing one of the protocols', function() {
          expect(resultGrid.getProtocolCount(testData, ["OGC:WMS-1.3.0-http-get-map", "OGC:WMS-1.1.1-http-get-map"])).toEqual(1);
      });

      it('Should handle links not containing protocol', function() {
          expect(resultGrid.getProtocolCount(testData, ["OGC:WMS-1.2.1-http-get-map"])).toEqual(0);
      });

      it('Should handle links not containing one of the protocols', function() {
          expect(resultGrid.getProtocolCount(testData, ["OGC:WMS-1.3.0-http-get-map", "OGC:WMS-1.2.1-http-get-map"])).toEqual(0);
      });

    });

    describe("getMapGoClass", function() {
      it('Should identify links containing one instance of the protocol', function() {
          expect(resultGrid.getMapGoClass('', {}, testRecord1)).toEqual('p-result-map-go');
      });

      it('Should identify links containing one instance of the protocol', function() {
          expect(resultGrid.getMapGoClass('', {}, multiProtocolRec)).toEqual('p-result-disabled');
      });

      it('Should identify links not containing protocol', function() {
          expect(resultGrid.getMapGoClass('', {}, testRecord2)).toEqual('p-result-disabled');
      });
    });

    describe("getMapAddClass", function() {
      it('Should identify links containing one instance of the protocol', function() {
          expect(resultGrid.getMapAddClass('', {}, testRecord1)).toEqual('p-result-map-add');
      });

      it('Should identify links containing one instance of the protocol', function() {
          expect(resultGrid.getMapAddClass('', {}, multiProtocolRec)).toEqual('p-result-disabled');
      });

      it('Should identify links not containing protocol', function() {
          expect(resultGrid.getMapAddClass('', {}, testRecord2)).toEqual('p-result-disabled');
      });
    });
   
    describe("getAddToDownloadClass", function() {
        it('Should identify records with downloadable links', function() {
            expect(resultGrid.getAddToDownloadClass('', {}, recordDownloadableLink)).toEqual('p-result-cart-add');
        });
        
        it('Should identify records with no downloadable links', function() {
            expect(resultGrid.getAddToDownloadClass('', {}, recordNoDownloadableLink)).toEqual('p-result-disabled');
        });
        
        it('Should identify records with no links', function() {
            expect(resultGrid.getAddToDownloadClass('', {}, recordNoLinks)).toEqual('p-result-disabled');
        });
    });
    
    describe("containsProtocol", function() {
        it('Should find the protocol in the array', function() {
            expect( resultGrid.containsProtocol( ["FirstProtocolName", "SecondProtocolName"], "FirstProtocolName" )).toEqual( true );
        });
        
        it('Should not find the protocol in the array', function() {
            expect( resultGrid.containsProtocol( ["FirstProtocolName", "SecondProtocolName"], "ThirdProtocolName" )).toEqual( false );
        });
        
        it('Should not find the protocol in an empty array', function() {
            expect( resultGrid.containsProtocol( [], "ThirdProtocolName" )).toEqual( false );
        });
    });
});
