/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

function getParameterByNameFromUrlString(urlString, name) {

    urlString = decodeURIComponent(urlString);
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(urlString);

    if(results == null) {
        return null;
    }
    else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}

describe("Portal.details.LayerDetailsPanel", function() {

    var layerDetailsPanel;

    beforeEach(function() {
        spyOn(Portal.details.LayerDetailsPanel.prototype, '_initWithLayer');
        spyOn(Portal.details.LayerDetailsPanel.prototype, '_attachEvents');
        layerDetailsPanel = new Portal.details.LayerDetailsPanel({});
    });

    describe("buildGetLegend()", function() {

        it("should have empty version when no type specified", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = layerDetailsPanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "VERSION")).toEqual(null);
        });

        it("should include version if present", function() {

            var layer = {
                params: {},
                url: "",
                server: {wmsVersion: '1.1.0'}
            };
            var urlString = layerDetailsPanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "VERSION")).toEqual("1.1.0");
        });

        it("should include style in url if style is not empty", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = layerDetailsPanel.buildGetLegend(layer, 'style/palette', null, false);
            expect(getParameterByNameFromUrlString(urlString, "STYLE")).toEqual("style/palette");
        });

        it("should not include style in url if style is empty", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = layerDetailsPanel.buildGetLegend(layer, '', null, false);
            expect(getParameterByNameFromUrlString(urlString, "STYLE")).toEqual(null);
        });

        it("should include palette in url if palette is not empty", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = layerDetailsPanel.buildGetLegend(layer, '', 'palette', false);
            expect(getParameterByNameFromUrlString(urlString, "PALETTE")).toEqual("palette");
        });

        it("should not include palette in url if palette is empty", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = layerDetailsPanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "PALETTE")).toEqual(null);
        });
    });

    describe("_processStyleData(layer)", function() {

        it("Returns empty array if layer.styles is undefined", function() {

            var layer = {styles: undefined};
            var retVal = layerDetailsPanel._processStyleData(layer);

            expect(JSON.stringify(retVal)).toBe(JSON.stringify([]));
        });

        it("Returns array of name and legend URL", function() {

            layerDetailsPanel.buildGetLegend = function(a, b, c, d) {
                return String.format('{0} {1} {2} {3}', a, b, c, d);
            };

            var layer = {
                isNcwms: returns(true),
                styles: [
                    {name: 'style1', palette: 'palette1'},
                    {name: 'style1', palette: 'palette2'},
                    {name: 'style2', palette: 'palette1'},
                    {name: 'style2', palette: 'palette2'}
                ]
            };
            var retVal = layerDetailsPanel._processStyleData(layer);
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
                setValue: jasmine.createSpy('setValue'),
                store: {
                    loadData: jasmine.createSpy('loadData')
                }
            };

            layerDetailsPanel.styleCombo = combo;
            layerDetailsPanel.layer = {
                defaultStyle: 'theDefault'
            };
        });

        it('does not load combo box data if 1 style or fewer', function() {

            layerDetailsPanel._processStyleData = returns(['style1']);

            layerDetailsPanel._stylesLoaded();

            expect(combo.store.loadData).not.toHaveBeenCalled();
            expect(combo.setValue).not.toHaveBeenCalled();
            expect(combo.collapse).not.toHaveBeenCalled();
            expect(combo.show).not.toHaveBeenCalled();
        });

        it('loads combo box data if more than 1 style to choose from', function() {

            var styles = ['style1', 'style2'];
            layerDetailsPanel._processStyleData = returns(styles);

            layerDetailsPanel._stylesLoaded();

            expect(combo.store.loadData).toHaveBeenCalledWith(styles);
            expect(combo.setValue).toHaveBeenCalledWith('theDefault');
            expect(combo.collapse).toHaveBeenCalled();
            expect(combo.show).toHaveBeenCalled();
        });
    });

    describe("_getPalette(layer)", function() {

        var ncWmsLayer = {isNcwms: returns(true)};
        var otherLayer = {isNcwms: returns(false)};

        it("Returns palette when the style is in the form style/palette", function() {

            var retVal = layerDetailsPanel._getPalette(ncWmsLayer, "dots/rainbow");

            expect(retVal).toBe("rainbow");
        });

        it("Returns style when in other forms", function() {

            var retVal = layerDetailsPanel._getPalette(ncWmsLayer, "squiggle");

            expect(retVal).toBe("squiggle");
        });

        it("Returns undefined for non-ncWMS Layers", function() {

            var retVal = layerDetailsPanel._getPalette(otherLayer, "style name");

            expect(retVal).toBeUndefined();
        });
    });
});
