describe("Portal.ui.Map", function() {
	
	var map = new Portal.ui.Map();
	
	var layer = {
		'class': "au.org.emii.portal.Layer",
		id: 87,
		abstractTrimmed: "",
		activeInLastScan: true,
		bbox: null,
		blacklisted: false,
		cache: false,
		cql: null,
		dataSource: "Unknown",
		isBaseLayer: true,
		lastUpdated: "2012-01-16T04:09:30Z",
		layers: [],
		metaUrl:null,
		name: "satellite",
		namespace: null,
		parent: null,
		projection: null,
		queryable: false,
		server: {
			'class': "au.org.emii.portal.Server",
			id: 6,
			allowDiscoveries: false,
			comments: null,
			disable: false,
			imageFormat: "image/png",
			lastScanDate: null,
			name: "IMOS Tile Cache",
			opacity: 100,
			scanFrequency: 120,
			shortAcron: "IMOS_Tile_Cache",
			type:"WMS-1.1.1",
			uri:"http://tilecache.emii.org.au/cgi-bin/tilecache.cgi"
		},
		styles: "",
		title: "satellite"
	};
	
	describe('getServerImageFormat', function() {
		it("should return default png", function () {
			expect(map.getServerImageFormat(undefined)).toEqual(undefined);
			expect(map.getServerImageFormat(null)).toEqual(undefined);
			expect(map.getServerImageFormat({})).toEqual('image/png');
		});
	    
		it("should return the format set on the descriptor", function () {
		    var server = {
				imageFormat: 'image/jpeg'
		    }  
			expect(map.getServerImageFormat(server)).toEqual('image/jpeg');
		});
		
	});
	
	describe('getWmsVersionString', function() {
		it('returns the string undefined', function() {
			var server = {
				type: 'lkajsdjalkdjas'
		    }  
			expect(map.getWmsVersionString(server)).toEqual('undefined');
		});
		
		it('returns the string "1.1.0"', function() {
			var server = {
				type: 'WMSajkshdkahsd1.1.0asjkhdjkashsdkja'
		    }  
			expect(map.getWmsVersionString(server)).toEqual('1.1.0');
		});
		
		it('returns the string "1.1.0"', function() {
			var server = {
				type: 'WMSajkshdkahsd1.1.0asjkhdjkashsdkja'
		    }  
			expect(map.getWmsVersionString(server)).toEqual('1.1.0');
		});
	});
	
	describe('getOpenLayerOptions', function() {
		it('testing setting of OpenLayers options', function() {
			var options = map.getOpenLayerOptions(layer);
			expect(options.version).toEqual('1.1.1');
			expect(options.isBaseLayer).toBeTruthy();
			expect(options.opacity).toEqual(1);
			expect(options.projection).toEqual(new OpenLayers.Projection(null));
		});
	});
	
	describe('getOpenLayerParams', function() {
		it('testing setting of OpenLayers params', function() {
			var options = map.getOpenLayerParams(layer);
			expect(options.version).toEqual('1.1.1');
			expect(options.format).toEqual('image/png');
			expect(options.queryable).toBeFalsy();
		});
	});
});