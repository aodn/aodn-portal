

describe("Portal.ui.openlayers.LayerParams", function() {

    var layerDescriptor;

    var layer = {
        name: 'argo',
        namespace: 'imos',
        server : {
            wmsVersion : "1.1.1"
        }
    };

    var layerParams;

    beforeEach(function() {
        layerDescriptor = new Portal.common.LayerDescriptor(layer);
        layerParams = new Portal.ui.openlayers.LayerParams(layerDescriptor, {});
    });

    it('layer name set properly', function() {
        expect(layerParams.layers).toBe('imos:argo');
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
            };
            expect(layerParams._getServerImageFormat(server)).toEqual('image/jpeg');
        });

    });

    describe('getOpenLayerParams', function() {
        it('testing setting of OpenLayers params', function() {
            expect(layerParams.version).toEqual('1.1.1');
            expect(layerParams.format).toEqual('image/png');
            expect(layerParams.queryable).toBeFalsy();
            expect(layerParams.exceptions).toEqual('application/vnd.ogc.se_xml');
        });
    });
});
