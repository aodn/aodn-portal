function getParameterByNameFromUrlString(urlString, name) {

    urlString = decodeURIComponent(urlString);
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(urlString);

    if (results == null) {
        return null;
    }
    else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}

describe("Portal.details.StylePanel", function() {

    var stylePanel;
    var dataCollection;
    var layerAdapter;
    var layerSelectionModel;

    beforeEach(function() {
        layerAdapter = {
            setStyle: jasmine.createSpy('setStyle'),
            getStyle: returns('aStyle')
        };

        var simpleLayer = {
            params: {},
            url: ""
        };

        layerSelectionModel = {
            on: returns(),
            getScaleRange: returns({}),
            getSelectedLayer: returns(simpleLayer)
        };

        dataCollection = {
            getLayerAdapter: returns(layerAdapter),
            getLayerSelectionModel: returns(layerSelectionModel),
            getTitle: returns('Data Collection Title')
        };

        spyOn(Ext.MsgBus, 'subscribe');
        spyOn(window, 'trackLayerControlUsage');

        spyOn(Portal.details, 'NcWmsScaleRangeControls');
        spyOn(Portal.details.StylePanel.prototype, '_initWithLayer');
        stylePanel = new Portal.details.StylePanel({
            dataCollection: dataCollection
        });
    });

    describe('setChosenStyle', function() {
        beforeEach(function() {
            spyOn(stylePanel, 'refreshLegend');

            var styleCombo = {};
            var selectedStyleOption = {get: returns('pink swirls')};

            stylePanel.setChosenStyle(styleCombo, selectedStyleOption);
        });

        it('sets style and refreshes legend', function() {
            expect(stylePanel.refreshLegend).toHaveBeenCalled();
            expect(layerAdapter.setStyle).toHaveBeenCalledWith('pink swirls');
        });

        it('tracks action to google analytics', function() {
            expect(window.trackLayerControlUsage).toHaveBeenCalledWith(
                'style',
                'pink swirls',
                'Data Collection Title'
            );
        });
    });

    describe("buildGetLegend()", function() {

        it("should have empty version when no type specified", function() {

            var layer = {
                params: {},
                url: "",
                isNcwms: returns(false)
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "VERSION")).toEqual(null);
        });

        it("should include version if present", function() {

            var layer = {
                params: {},
                url: "",
                server: {wmsVersion: '1.1.0'},
                isNcwms: returns(false)
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "VERSION")).toEqual("1.1.0");
        });

        it("should include numColorBands if it is defined", function() {

            var layer = {
                extraLayerInfo: {numColorBands: '24'},
                url: "",
                params: {},
                isNcwms: returns(false)
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, 'NUMCOLORBANDS')).toEqual('24');
        });

        it("should not include numColorBands if it is not defined in extraLayerInfo", function() {

            var layer = {
                extraLayerInfo: {},
                url: "",
                params: {},
                isNcwms: returns(false)
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, 'NUMCOLORBANDS')).toEqual(null);
        });

        it("should not include numColorBands if no extraLayerInfo is defined", function() {

            var layer = {
                url: "",
                params: {},
                isNcwms: returns(false)
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, 'NUMCOLORBANDS')).toEqual(null);
        });

        it("should include style in url if style is not empty", function() {

            var layer = {
                params: {},
                url: "",
                isNcwms: returns(false)
            };
            var urlString = stylePanel.buildGetLegend(layer, 'style/palette', null, false);
            expect(getParameterByNameFromUrlString(urlString, "STYLE")).toEqual("style/palette");
        });

        it("should not include style in url if style is empty", function() {

            var layer = {
                params: {},
                url: "",
                isNcwms: returns(false)
            };
            var urlString = stylePanel.buildGetLegend(layer, '', null, false);
            expect(getParameterByNameFromUrlString(urlString, "STYLE")).toEqual(null);
        });

        it("should include palette in url if palette is not empty", function() {

            var layer = {
                params: {},
                url: "",
                isNcwms: returns(false)
            };
            var urlString = stylePanel.buildGetLegend(layer, '', 'palette', false);
            expect(getParameterByNameFromUrlString(urlString, "PALETTE")).toEqual("palette");
        });

        it("should not include palette in url if palette is empty", function() {

            var layer = {
                params: {},
                url: "",
                isNcwms: returns(false)
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "PALETTE")).toEqual(null);
        });
    });

    describe("_processStyleData()", function() {

        it("Returns empty array if layer.styles is undefined", function() {

            dataCollection.getLayerSelectionModel = returns({
                getSelectedLayer: returns({styles: undefined})
            });

            var retVal = stylePanel._processStyleData();

            expect(JSON.stringify(retVal)).toBe(JSON.stringify([]));
        });

        it("Returns array of name and legend URL", function() {

            stylePanel.buildGetLegend = function(a, b, c, d) {
                return String.format('{0} {1} {2} {3}', a, b, c, d);
            };

            dataCollection.getLayerSelectionModel = returns({
                getSelectedLayer: returns({
                    isNcwms: returns(true),
                    styles: [
                        {name: 'style1', palette: 'palette1'},
                        {name: 'style1', palette: 'palette2'},
                        {name: 'style2', palette: 'palette1'},
                        {name: 'style2', palette: 'palette2'}
                    ]
                })
            });

            var retVal = stylePanel._processStyleData();
            var expected = '[' +
                '["style1/palette1","[object Object] style1/palette1 palette1 true"],' +
                '["style1/palette2","[object Object] style1/palette2 palette2 true"],' +
                '["style2/palette1","[object Object] style2/palette1 palette1 true"],' +
                '["style2/palette2","[object Object] style2/palette2 palette2 true"]' +
            ']';

            expect(JSON.stringify(retVal)).toBe(expected);
        });
    });

    describe('_stylesLoaded', function() {

        var combo;

        beforeEach(function() {

            combo = {
                collapse: jasmine.createSpy('collapse'),
                show: jasmine.createSpy('show'),
                hide: jasmine.createSpy('hide'),
                enable: jasmine.createSpy('enable'),
                setValue: jasmine.createSpy('setValue'),
                store: {
                    loadData: jasmine.createSpy('loadData')
                }
            };

            stylePanel.styleCombo = combo;

            spyOn(stylePanel, 'refreshLegend');
        });

        it('does not load combo box data if 1 style or fewer', function() {

            stylePanel._processStyleData = returns(['style1']);

            stylePanel._stylesLoaded();

            expect(combo.hide).toHaveBeenCalled();
            expect(combo.store.loadData).not.toHaveBeenCalled();
            expect(combo.collapse).not.toHaveBeenCalled();
            expect(combo.enable).not.toHaveBeenCalled();
            expect(combo.show).not.toHaveBeenCalled();
        });

        it('loads combo box data if more than 1 style to choose from', function() {

            var styles = ['style1', 'style2'];
            stylePanel._processStyleData = returns(styles);

            stylePanel._stylesLoaded({
                defaultStyle: 'theDefault'
            });

            expect(combo.store.loadData).toHaveBeenCalledWith(styles);
            expect(combo.setValue).toHaveBeenCalledWith('theDefault');
            expect(combo.collapse).toHaveBeenCalled();
            expect(combo.enable).toHaveBeenCalled();
            expect(combo.show).toHaveBeenCalled();
            expect(combo.hide).not.toHaveBeenCalled();
        });
    });

    describe("_getPalette()", function() {

        it("Returns palette when the style is in the form style/palette", function() {

            var retVal = stylePanel._getPalette("dots/rainbow");

            expect(retVal).toBe("rainbow");
        });

        it("Returns style when in other forms", function() {

            var retVal = stylePanel._getPalette("squiggle");

            expect(retVal).toBe("squiggle");
        });
    });
});
