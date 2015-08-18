/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.ui.openlayers.layer.NcWMS', function() {

    describe('_setExtraLayerInfoFromNcwms', function() {

        it('called from initialize', function() {
            spyOn(OpenLayers.Layer.NcWMS.prototype, '_setExtraLayerInfoFromNcwms');

            var ncwmsLayer = mockNcwmsLayer();

            expect(ncwmsLayer._setExtraLayerInfoFromNcwms).toHaveBeenCalled();
        });

        it('_getExtraLayerInfoFromNcwms generates URL', function() {
            var ncwmsLayer = mockNcwmsLayer();

            expect(ncwmsLayer._getExtraLayerInfoFromNcwms()).toEqual(
                'http://ncwms.aodn.org.au/ncwms/wms?layerName=ncwmsLayerName&REQUEST=GetMetadata&item=layerDetails'
            );
        });

        it('_setExtraLayerInfoFromNcwms calls URL', function() {
            spyOn(OpenLayers.Layer.NcWMS.prototype, '_getExtraLayerInfoFromNcwms').andReturn('mockedMetadataUrl');
            spyOn(Ext.ux.Ajax, 'proxyRequest');

            var ncwmsLayer = mockNcwmsLayer();

            expect(ncwmsLayer._getExtraLayerInfoFromNcwms).toHaveBeenCalled();

            var ajaxParams = Ext.ux.Ajax.proxyRequest.mostRecentCall.args[0];
            expect(ajaxParams.url).toBe("mockedMetadataUrl");
        });
    });

    function mockNcwmsLayer() {
        return new OpenLayers.Layer.NcWMS(
            'someLayer',
            'http://ncwms.aodn.org.au/ncwms/wms',
            { LAYERS: 'ncwmsLayerName' },
            {},
            {}
        );
    }
});
