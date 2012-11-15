describe("Portal.ui.Map", function() {

    Ext.Ajax.request.isSpy = false;
    spyOn(Ext.Ajax, 'request').andReturn('');

    var appConfig = {
        initialBbox : '130,-60,160,-20',
        autoZoom : false,
        hideLayerOptions : false
    };

    var map;
    
    beforeEach(function() {
        map = new Portal.ui.Map({
            appConfig : appConfig
        });
    });
    
    afterEach(function() {
       map.destroy(); 
    });

    var layer = {
        'class' : "au.org.emii.portal.Layer",
        id : 87,
        abstractTrimmed : "",
        activeInLastScan : true,
        bbox : null,
        blacklisted : false,
        cache : false,
        cql : null,
        dataSource : "Unknown",
        isBaseLayer : true,
        lastUpdated : "2012-01-16T04:09:30Z",
        layers : [],
        name : "satellite",
        namespace : null,
        parent : null,
        projection : null,
        queryable : false,
        server : {
            'class' : "au.org.emii.portal.Server",
            id : 6,
            allowDiscoveries : false,
            comments : null,
            disable : false,
            imageFormat : "image/png",
            lastScanDate : null,
            name : "IMOS Tile Cache",
            opacity : 100,
            scanFrequency : 120,
            shortAcron : "IMOS_Tile_Cache",
            type : "WMS-1.1.1",
            uri : "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi"
        },
        styles : "",
        title : "satellite"
    };

    describe('getServerImageFormat', function() {
        it("should return default png", function() {
            expect(map.getServerImageFormat(undefined)).toEqual(undefined);
            expect(map.getServerImageFormat(null)).toEqual(undefined);
            expect(map.getServerImageFormat({})).toEqual('image/png');
        });

        it("should return the format set on the descriptor", function() {
            var server = {
                imageFormat : 'image/jpeg'
            }
            expect(map.getServerImageFormat(server)).toEqual('image/jpeg');
        });

    });

    describe('getWmsVersionString', function() {
        it('returns the string undefined', function() {
            var server = {
                type : 'lkajsdjalkdjas'
            }
            expect(map.getWmsVersionString(server)).toEqual('undefined');
        });

        it('returns the string "1.1.0"', function() {
            var server = {
                type : 'WMSajkshdkahsd1.1.0asjkhdjkashsdkja'
            }
            expect(map.getWmsVersionString(server)).toEqual('1.1.0');
        });

        it('returns the string "1.1.0"', function() {
            var server = {
                type : 'WMSajkshdkahsd1.1.0asjkhdjkashsdkja'
            }
            expect(map.getWmsVersionString(server)).toEqual('1.1.0');
        });
    });

    describe('getOpenLayerOptions', function() {
        it('testing setting of OpenLayers options',
                function() {
                    var options = map.getOpenLayerOptions(layer);
                    expect(options.version).toEqual('1.1.1');
                    expect(options.isBaseLayer).toBeTruthy();
                    expect(options.opacity).toEqual(1);
                    expect(options.projection).toEqual(
                            new OpenLayers.Projection(null));
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

    describe('getLayerUid', function() {
        it('tests layer UID creation', function() {
            var openLayer = {
                name : 'test'
            };
            expect(map.getLayerUid(openLayer)).toEqual('UNKNOWN::test');

            openLayer.cql = 'some cql';
            expect(map.getLayerUid(openLayer)).toEqual(
                    'UNKNOWN::test::some cql');

            openLayer.url = 'http://localhost';
            expect(map.getLayerUid(openLayer)).toEqual(
                    'http://localhost::test::some cql');

            openLayer.server = {
                uri : 'http://remotehost'
            };
            expect(map.getLayerUid(openLayer)).toEqual(
                    'http://remotehost::test::some cql');
        });
    });

    describe('containsLayer', function() {
        it('tests contains layer', function() {
            var openLayer = {
                name : 'test'
            };
            map.activeLayers[map.getLayerUid(openLayer)] = openLayer;
            // As it isn't actually added to the Map so perhaps this is a
            // rubbish
            // test? It did lead to me finding an undefined reference however
            expect(map.containsLayer(openLayer)).toBeFalsy();
        });
    });

    describe('parent layer reference functions', function() {
        it('tests underlying access to parent', function() {
            var layerDescriptor = {
                title : 'test',
                parent : {
                    id : 100,
                    name : 'parent layer'
                }
            };
            expect(map.getParentId(layerDescriptor)).toEqual(100);
            expect(map.getParentName(layerDescriptor)).toEqual('parent layer');
            layerDescriptor.parent = undefined;
            expect(map.getParentId(layerDescriptor)).toBeFalsy();
            expect(map.getParentName(layerDescriptor)).toBeFalsy();
        });
    });

    describe('message bus tests', function() {
        
        it('updateAnimationPanel called on selectedLayerChanged event', function() {
            spyOn(map, 'updateAnimationPanel');
            
            Ext.MsgBus.publish('selectedLayerChanged', { isAnimatable: function() { return true;}});
            
            expect(map.updateAnimationPanel).toHaveBeenCalled();
        });
    });
    
    Ext.Ajax.request.isSpy = false;
});