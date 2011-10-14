describe("Portal.search.data.LinkStore", function() {
	
   describe("Data load", function() {

      it('Should load sample data', function() {
         
		var testStore = new Portal.search.data.LinkStore({ 
			data: {
				links: [{
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
				}]
		}});

         expect(testStore.getCount()).toEqual(4);
         
         expect(testStore.getAt(0).fields.getCount()).toEqual(5);
         expect(testStore.getAt(0).get('url')).toEqual("http://geoserverdev.emii.org.au:80/geoserver/wms?SERVICE=WMS&");
         expect(testStore.getAt(0).get('name')).toEqual("topp:xbt_realtime");
         expect(testStore.getAt(0).get('protocol')).toEqual("OGC:WMS-1.1.1-http-get-map");
         expect(testStore.getAt(0).get('title')).toEqual("xbt_realtime");
         expect(testStore.getAt(0).get('type')).toEqual("application/vnd.ogc.wms_xml");

         expect(testStore.getAt(1).fields.getCount()).toEqual(5);
         expect(testStore.getAt(1).get('url')).toEqual("http://localhost:8080/geonetwork/srv/en/google.kml?uuid=5adf6c9b-6550-4232-a8db-6a1acca8f05b&layers=topp:xbt_realtime");
         expect(testStore.getAt(1).get('name')).toEqual("topp:xbt_realtime");
         expect(testStore.getAt(1).get('protocol')).toEqual("");
         expect(testStore.getAt(1).get('title')).toEqual("xbt_realtime");
         expect(testStore.getAt(1).get('type')).toEqual("application/vnd.google-earth.kml+xml");
         
         expect(testStore.getAt(2).fields.getCount()).toEqual(5);
         expect(testStore.getAt(2).get('url')).toEqual("");
         expect(testStore.getAt(2).get('name')).toEqual("");
         expect(testStore.getAt(2).get('protocol')).toEqual("");
         expect(testStore.getAt(2).get('title')).toEqual("");
         expect(testStore.getAt(2).get('type')).toEqual("wms");

         expect(testStore.getAt(3).fields.getCount()).toEqual(5);
         expect(testStore.getAt(3).get('url')).toEqual("");
         expect(testStore.getAt(3).get('name')).toEqual("");
         expect(testStore.getAt(3).get('protocol')).toEqual("");
         expect(testStore.getAt(3).get('title')).toEqual("");
         expect(testStore.getAt(3).get('type')).toEqual("googleearth");

      });
      
   });
      
   describe("getLink", function() {

		var testStore = new Portal.search.data.LinkStore({ 
			data: {
				links: [{
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
				}]
		}});

		it('Should return link at index', function() {
	         
         var firstLink = testStore.getLink(0);
         
         expect(firstLink.server).toEqual('http://geoserverdev.emii.org.au:80/geoserver/wms?SERVICE=WMS&');
         expect(firstLink.layer).toEqual('topp:xbt_realtime');
         expect(firstLink.protocol).toEqual('OGC:WMS-1.1.1-http-get-map');
         expect(firstLink.title).toEqual('xbt_realtime');

         var secondLink = testStore.getLink(1);
         
         expect(secondLink.server).toEqual('http://localhost:8080/geonetwork/srv/en/google.kml?uuid=5adf6c9b-6550-4232-a8db-6a1acca8f05b&layers=topp:xbt_realtime');
         expect(secondLink.layer).toEqual('topp:xbt_realtime');
         expect(secondLink.protocol).toEqual('');
         expect(secondLink.title).toEqual('xbt_realtime');

		});
      
		it('Should return an error if no link at index', function() {
         var noLink = testStore.getLink(11);
         
			expect(noLink).toEqual(undefined);
		});
   });
	      
});