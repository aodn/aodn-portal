
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.ui.openlayers.LayerParams", function() {
   
    var layerDescriptor;
    
    var layer = {
        server : {
            type : "WMS-1.1.1",
        }
    };
    
    var layerParams;
    
    beforeEach(function() {
        layerDescriptor = new Portal.common.LayerDescriptor(layer);
        layerParams = new Portal.ui.openlayers.LayerParams(layerDescriptor, {});
    });
    
    describe('getServerImageFormat', function() {
        it("should return default png", function() {
            
            expect(layerParams._getServerImageFormat(undefined)).toEqual(undefined);
            expect(layerParams._getServerImageFormat(null)).toEqual(undefined);
            expect(layerParams._getServerImageFormat({})).toEqual('image/png');
        });

        it("should return the format set on the descriptor", function() {
            var server = {
                imageFormat : 'image/jpeg'
            }
            expect(layerParams._getServerImageFormat(server)).toEqual('image/jpeg');
        });

    });

    describe('getWmsVersionString', function() {
        it('returns the string undefined', function() {
            var server = {
                type : 'lkajsdjalkdjas'
            }
            expect(layerParams._getWmsVersionString(server)).toEqual('undefined');
        });

        it('returns the string "1.1.0"', function() {
            var server = {
                type : 'WMSajkshdkahsd1.1.0asjkhdjkashsdkja'
            }
            expect(layerParams._getWmsVersionString(server)).toEqual('1.1.0');
        });

        it('returns the string "1.1.0"', function() {
            var server = {
                type : 'WMSajkshdkahsd1.1.0asjkhdjkashsdkja'
            }
            expect(layerParams._getWmsVersionString(server)).toEqual('1.1.0');
        });
    });

    describe('getOpenLayerParams', function() {
        it('testing setting of OpenLayers params', function() {
            expect(layerParams.version).toEqual('1.1.1');
            expect(layerParams.format).toEqual('image/png');
            expect(layerParams.queryable).toBeFalsy();
        });
    });
});