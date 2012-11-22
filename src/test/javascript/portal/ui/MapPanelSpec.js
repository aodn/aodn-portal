
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.MapPanel", function() {

    Ext.Ajax.request.isSpy = false;
    spyOn(Ext.Ajax, 'request').andReturn('');

    var appConfig = {
        initialBbox : '130,-60,160,-20',
        autoZoom : false,
        hideLayerOptions : false
    };

    var mapPanel;
    
    beforeEach(function() {
        mapPanel = new Portal.ui.MapPanel({
            appConfig : appConfig
        });
    });
    
    afterEach(function() {
        mapPanel.destroy(); 
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
            expect(mapPanel.getServerImageFormat(undefined)).toEqual(undefined);
            expect(mapPanel.getServerImageFormat(null)).toEqual(undefined);
            expect(mapPanel.getServerImageFormat({})).toEqual('image/png');
        });

        it("should return the format set on the descriptor", function() {
            var server = {
                imageFormat : 'image/jpeg'
            }
            expect(mapPanel.getServerImageFormat(server)).toEqual('image/jpeg');
        });

    });

    describe('getWmsVersionString', function() {
        it('returns the string undefined', function() {
            var server = {
                type : 'lkajsdjalkdjas'
            }
            expect(mapPanel.getWmsVersionString(server)).toEqual('undefined');
        });

        it('returns the string "1.1.0"', function() {
            var server = {
                type : 'WMSajkshdkahsd1.1.0asjkhdjkashsdkja'
            }
            expect(mapPanel.getWmsVersionString(server)).toEqual('1.1.0');
        });

        it('returns the string "1.1.0"', function() {
            var server = {
                type : 'WMSajkshdkahsd1.1.0asjkhdjkashsdkja'
            }
            expect(mapPanel.getWmsVersionString(server)).toEqual('1.1.0');
        });
    });

    describe('getOpenLayerOptions', function() {
        it('testing setting of OpenLayers options',
                function() {
                    var options = mapPanel.getOpenLayerOptions(layer);
                    expect(options.version).toEqual('1.1.1');
                    expect(options.isBaseLayer).toBeTruthy();
                    expect(options.opacity).toEqual(1);
                    expect(options.projection).toEqual(
                            new OpenLayers.Projection(null));
                });
    });

    describe('getOpenLayerParams', function() {
        it('testing setting of OpenLayers params', function() {
            var options = mapPanel.getOpenLayerParams(layer);
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
            expect(mapPanel.getLayerUid(openLayer)).toEqual('UNKNOWN::test');

            openLayer.cql = 'some cql';
            expect(mapPanel.getLayerUid(openLayer)).toEqual(
                    'UNKNOWN::test::some cql');

            openLayer.url = 'http://localhost';
            expect(mapPanel.getLayerUid(openLayer)).toEqual(
                    'http://localhost::test::some cql');

            openLayer.server = {
                uri : 'http://remotehost'
            };
            expect(mapPanel.getLayerUid(openLayer)).toEqual(
                    'http://remotehost::test::some cql');
        });
    });

    describe('containsLayer', function() {
        it('tests contains layer', function() {
            var openLayer = {
                name : 'test'
            };
            mapPanel.activeLayers[mapPanel.getLayerUid(openLayer)] = openLayer;
            // As it isn't actually added to the Map so perhaps this is a
            // rubbish
            // test? It did lead to me finding an undefined reference however
            expect(mapPanel.containsLayer(openLayer)).toBeFalsy();
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
            expect(mapPanel.getParentId(layerDescriptor)).toEqual(100);
            expect(mapPanel.getParentName(layerDescriptor)).toEqual('parent layer');
            layerDescriptor.parent = undefined;
            expect(mapPanel.getParentId(layerDescriptor)).toBeFalsy();
            expect(mapPanel.getParentName(layerDescriptor)).toBeFalsy();
        });
    });

    describe('message bus tests', function() {
        
        it('updateAnimationControlsPanel called on selectedLayerChanged event', function() {
            spyOn(mapPanel, 'updateAnimationControlsPanel');
            
            Ext.MsgBus.publish('selectedLayerChanged', { isAnimatable: function() { return true;}});
            
            expect(mapPanel.updateAnimationControlsPanel).toHaveBeenCalled();
        });
    });
    
    Ext.Ajax.request.isSpy = false;
});
