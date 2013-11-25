/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.details.AodaacPanel', function() {

    var map;
    var aodaacPanel;
    var geoNetworkRecord = {
        id: "45678",
        updateAodaac: noOp
    };
    var layer = _mockLayer();


    beforeEach(function() {
        map = mockMap();
        spyOn(map.events, 'register');

        aodaacPanel = new Portal.details.AodaacPanel({ map: map });
        aodaacPanel._setBounds =  function() {};
        aodaacPanel._populateFormFields = function() {};
        layer.getMissingDays =  function() { return []};
        layer.isNcwms = function() {return true};
        layer.events = { on: noOp };
        layer.processTemporalExtent = noOp;
    });

    describe('initialisation', function() {
        it('registers a handler for the map move event', function() {

            spyOn(Ext.Ajax, 'request').andCallFake(
                function(params) {
                    params.success.call(params.scope, { responseText: '[{"extents":{"lat":{"min":-48.02,"max":-7.99},"lon":{"min":103.99,"max":165.02},"dateTime":{"min":"01/01/2001","max":"31/12/2012"}},"name":"GHRSST SST subskin","productId":"1"}]' });
                }
            );

            var _aodaacPanel = new Portal.details.AodaacPanel({ map: map });
            expect(map.events.register).toHaveBeenCalledWith('move', _aodaacPanel, _aodaacPanel._setBounds);
        });
    });

    describe('GeoNetworkRecord', function() {

        it('assigns a GeoNetworkRecord instance from a layer', function() {
            spyOn(Ext.Ajax, 'request').andCallFake(
                function(params) {
                    params.success.call(params.scope, { responseText: '[{"extents":{"lat":{"min":-48.02,"max":-7.99},"lon":{"min":103.99,"max":165.02},"dateTime":{"min":"01/01/2001","max":"31/12/2012"}},"name":"GHRSST SST subskin","productId":"1"}]' });
                }
            );

            _applyCommonSpies();
            spyOn(aodaacPanel, '_populateFormFields');

            aodaacPanel.update(layer, noOp, noOp, {});
            expect(aodaacPanel.geoNetworkRecord).toBeTruthy();
            expect(aodaacPanel.geoNetworkRecord.id).toEqual(geoNetworkRecord.id);
        });
    });

    describe('input controls', function() {

        beforeEach(function() {
            _applyCommonSpies();
        });

        it('updates the aodaac object when the layer changes', function() {
            spyOn(Ext.Ajax, 'request').andCallFake(
                function(params) {
                    params.success.call(params.scope, { responseText: '[{"extents":{"lat":{"min":-48.02,"max":-7.99},"lon":{"min":103.99,"max":165.02},"dateTime":{"min":"01/01/2001","max":"31/12/2012"}},"name":"GHRSST SST subskin","productId":"1"}]' });
                }
            );

            aodaacPanel.update(layer, noOp, noOp, {});
            expect(aodaacPanel._buildAodaac).toHaveBeenCalled();
            delete aodaacPanel.geoNetworkRecord;
        });

        it('updates the date when the start date changes via the picker', function() {
            aodaacPanel._addTemporalControls(new Array());
            aodaacPanel.startDateTimePicker.fireEvent('select');
            expect(aodaacPanel._onDateSelected).toHaveBeenCalled();
        });

        it('updates the date when the start date changes via edit', function() {
            aodaacPanel._addTemporalControls(new Array());
            aodaacPanel.startDateTimePicker.fireEvent('change');
            expect(aodaacPanel._onDateSelected).toHaveBeenCalled();
        });

        it('updates the date when the end date changes via the picker', function() {
            aodaacPanel._addTemporalControls(new Array());
            aodaacPanel.endDateTimePicker.fireEvent('select');
            expect(aodaacPanel._onDateSelected).toHaveBeenCalled();
        });

        it('updates the date when the end date changes via edit', function() {
            aodaacPanel._addTemporalControls(new Array());
            aodaacPanel.endDateTimePicker.fireEvent('change');
            expect(aodaacPanel._onDateSelected).toHaveBeenCalled();
        });

        it('updates the aodaac object when the map moves', function() {
            spyOn(Portal.details.AodaacPanel.prototype, '_setBounds');
            var _aodaacPanel = new Portal.details.AodaacPanel({ map: _createMap() });
            _decorateMap(_aodaacPanel);
            _aodaacPanel.map.events.triggerEvent('move', {});
            expect(_aodaacPanel._setBounds).toHaveBeenCalled();
        });

        it('clears the date and time pickers when the layer is updating', function() {
            spyOn(aodaacPanel, '_clearDateTimeFields');
            spyOn(Ext.Ajax, 'request').andCallFake(
                function(params) {
                    params.success.call(params.scope, { responseText: '[{"extents":{"lat":{"min":-48.02,"max":-7.99},"lon":{"min":103.99,"max":165.02},"dateTime":{"min":"01/01/2001","max":"31/12/2012"}},"name":"GHRSST SST subskin","productId":"1"}]' });
                }
            );

            aodaacPanel.update(layer, noOp, noOp, {});
            expect(aodaacPanel._clearDateTimeFields).toHaveBeenCalled();
            delete aodaacPanel.geoNetworkRecord;
        });
    });

    describe('_newHtmlElement', function() {

        it('return an element with the html set', function() {

            var element = aodaacPanel._newHtmlElement('the html');

            expect(element.html).toBe('the html');
        });
    });

    describe('clearing the date and time pickers', function() {
        it('resets the start picker', function() {
            spyOn(aodaacPanel.startDateTimePicker, 'reset');
            aodaacPanel._clearDateTimeFields();
            expect(aodaacPanel.startDateTimePicker.reset).toHaveBeenCalled();
        });

        it('resets the end picker', function() {
            spyOn(aodaacPanel.endDateTimePicker, 'reset');
            aodaacPanel._clearDateTimeFields();
            expect(aodaacPanel.endDateTimePicker.reset).toHaveBeenCalled();
        });

        it('hides the next and previous buttons', function() {
            spyOn(aodaacPanel.buttonsPanel, 'hide');
            aodaacPanel._clearDateTimeFields();
            expect(aodaacPanel.buttonsPanel.hide).toHaveBeenCalled();
        });

        it('updates the time range label', function() {
            spyOn(aodaacPanel, '_updateTimeRangeLabel');
            aodaacPanel._clearDateTimeFields();
            expect(aodaacPanel._updateTimeRangeLabel).toHaveBeenCalledWith(null, true);
        });
    });

    describe('layer temporal extent loaded', function() {

        beforeEach(function() {
            aodaacPanel.selectedLayer = layer;
        });

        it('enables the start date picker', function() {
            aodaacPanel._layerTemporalExtentLoaded();
            expect(aodaacPanel.startDateTimePicker.disabled).toBeFalsy();
        });

        it('enables the end date picker', function() {
            aodaacPanel._layerTemporalExtentLoaded();
            expect(aodaacPanel.endDateTimePicker.disabled).toBeFalsy();
        });

        it('shows the next and previous buttons', function() {
            spyOn(aodaacPanel.buttonsPanel, 'show');
            aodaacPanel._layerTemporalExtentLoaded();
            expect(aodaacPanel.buttonsPanel.show).toHaveBeenCalled();
        });

        it('updates the time range label', function() {
            spyOn(aodaacPanel, '_updateTimeRangeLabel');
            aodaacPanel._layerTemporalExtentLoaded();
            expect(aodaacPanel._updateTimeRangeLabel).toHaveBeenCalled();
        });
    });

    function _decorateMap(panel) {
        var _panel = panel || aodaacPanel;
        _panel.map.getExtent = function() {
            return new OpenLayers.Bounds(0, -90, 180, 90);
        }
    }

    function _createMap() {
        var map = new OpenLayers.Map('map');
        map.addLayers([new OpenLayers.Layer.WMS(
            "OpenLayers WMS",
            "http://vmap0.tiles.osgeo.org/wms/vmap0?",
            {
                layers: 'basic'
            },
            {
                'attribution': 'Provided by OSGeo'
            })]
        );

        return map;
    }

    function _applyCommonSpies(panel) {
        var _panel = panel || aodaacPanel;
        spyOn(_panel, '_showAllControls');
        spyOn(_panel, '_buildAodaac');
        spyOn(_panel, '_onDateSelected');
        spyOn(_panel, '_setBounds');
    }

    function _mockLayer() {
        var extent = new Portal.visualise.animations.TemporalExtent();
        for (var i = 0; i < 24; i++) {
            extent.add(moment("2001-01-01T01:00:00.000Z").add('h', i));
        }
        return {
            parentGeoNetworkRecord: geoNetworkRecord,
            temporalExtent: extent,
            missingDays: [],
            productsInfo: [1,2,3],
            getTemporalExtent: function() {
                return this.temporalExtent;
            }
        };
    }
});

