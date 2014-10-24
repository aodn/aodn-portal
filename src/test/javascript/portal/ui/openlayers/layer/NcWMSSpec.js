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
                'time >= 2000-01-01T01:01:01.000Z and time <= 2001-01-01T01:01:01.000Z'
            );

            ncwmsLayer.bodaacFilterParams = {
                dateRangeStart: startTime,
                dateRangeEnd: null
            };

            expect(ncwmsLayer.getCqlForTemporalExtent()).toEqual(
                'time >= 2000-01-01T01:01:01.000Z'
            );

            ncwmsLayer.bodaacFilterParams = {
                dateRangeStart: null,
                dateRangeEnd: endTime
            };

            expect(ncwmsLayer.getCqlForTemporalExtent()).toEqual(
                'time <= 2001-01-01T01:01:01.000Z'
            );
        });
    });

    describe('_setMetadataFromNcWMS', function() {

        it('called from initialize', function() {
            spyOn(OpenLayers.Layer.NcWMS.prototype, '_setExtraLayerInfoFromNcWMS');

            var ncwmsLayer = mockNcwmsLayer();

            expect(ncwmsLayer._setExtraLayerInfoFromNcWMS).toHaveBeenCalled();
        });

        it('_getExtraLayerInfoFromNcwmsUrl generates URL', function() {
            var ncwmsLayer = mockNcwmsLayer();

            expect(ncwmsLayer._getExtraLayerInfoFromNcwmsUrl()).toEqual(
                'http://ncwms.aodn.org.au/ncwms/wms?layerName=ncwmsLayerName&REQUEST=GetMetadata&item=layerDetails'
            );
        });

        it('_setExtraLayerInfoFromNcWMS calls URL', function() {
            spyOn(OpenLayers.Layer.NcWMS.prototype, '_getExtraLayerInfoFromNcwmsUrl').andReturn('mockedMetadataUrl');
            spyOn(Ext.ux.Ajax, 'proxyRequest');

            var ncwmsLayer = mockNcwmsLayer();

            expect(ncwmsLayer._getExtraLayerInfoFromNcwmsUrl).toHaveBeenCalled();

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
