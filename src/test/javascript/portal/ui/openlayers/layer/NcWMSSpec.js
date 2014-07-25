/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.ui.openlayers.layer.NcWMS', function() {
    describe('getCqlForTemporalExtent', function() {
        it('constructs CQL', function() {

            var ncwmsLayer = mockNcwmsLayer();
            var startTime = moment('2000-01-01T01:01:01Z');
            var endTime = moment('2001-01-01T01:01:01Z');

            ncwmsLayer.bodaacFilterParams = {
                dateRangeStart: startTime,
                dateRangeEnd: endTime
            };

            expect(ncwmsLayer.getCqlForTemporalExtent()).toEqual(
                'time%20%3E%3D%202000-01-01T01%3A01%3A01.000Z%20and%20time%20%3C%3D%202001-01-01T01%3A01%3A01.000Z'
            );
        });
    });

    describe('_setMetadata', function() {

        it('called from initialize', function() {
            spyOn(OpenLayers.Layer.NcWMS.prototype, '_setMetadata');

            var ncwmsLayer = mockNcwmsLayer();

            expect(ncwmsLayer._setMetadata).toHaveBeenCalled();
        });

        it('_getMetadataUrl generates URL', function() {
            var ncwmsLayer = mockNcwmsLayer();

            expect(ncwmsLayer._getMetadataUrl()).toEqual(
                'http://ncwms.aodn.org.au/ncwms/wms?layerName=ncwmsLayerName&REQUEST=GetMetadata&item=layerDetails'
            );
        });

        it('_setMetadata calls URL', function() {
            spyOn(OpenLayers.Layer.NcWMS.prototype, '_getMetadataUrl').andReturn('mockedMetadataUrl');
            spyOn(Ext.ux.Ajax, 'proxyRequest');

            var ncwmsLayer = mockNcwmsLayer();

            expect(ncwmsLayer._getMetadataUrl).toHaveBeenCalled();

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
