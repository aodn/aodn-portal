/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

function getParameterByNameFromUrlString(urlString, name) {

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

describe("Portal.details.StylePanel", function() {

    var stylePanel;

    beforeEach(function() {
        spyOn(Portal.details.StylePanel.prototype, '_initWithLayer');
        stylePanel = new Portal.details.StylePanel({});
    });

    describe("buildGetLegend()", function() {

        it("should have empty version when no type specified", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "VERSION")).toEqual(null);
        });

        it("should remove version prefix (before '-')", function() {

            var layer = {
                params: {},
                url: "",
                server: {type: "WMS-1.1.0"}
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "VERSION")).toEqual("1.1.0");

            // Check ncWMS
            layer.server.type = "NCWMS-1.1.1";
            urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "VERSION")).toEqual("1.1.1");
        });

        it("should include style in url if style is not empty", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = stylePanel.buildGetLegend(layer, 'style/palette', null, false);
            expect(getParameterByNameFromUrlString(urlString, "STYLE")).toEqual("style/palette");
        });

        it("should not include style in url if style is empty", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = stylePanel.buildGetLegend(layer, '', null, false);
            expect(getParameterByNameFromUrlString(urlString, "STYLE")).toEqual(null);
        });

        it("should include palette in url if palette is not empty", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = stylePanel.buildGetLegend(layer, '', 'palette', false);
            expect(getParameterByNameFromUrlString(urlString, "PALETTE")).toEqual("palette");
        });

        it("should not include palette in url if palette is empty", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "PALETTE")).toEqual(null);
        });
    });

    describe("_styleData(layer)", function() {

        it("Returns empty array if layer.allStyles is undefined", function() {

            var layer = {allStyles: undefined};
            var retVal = stylePanel._styleData(layer);

            expect(JSON.stringify(retVal)).toBe(JSON.stringify([]));
        });

        it("Returns empty array if layer.allStyles has only 1 element", function() {

            var layer = {allStyles: ['style1']};
            var retVal = stylePanel._styleData(layer);

            expect(JSON.stringify(retVal)).toBe(JSON.stringify([]));
        });

        it("Returns empty array if layer.allStyles has only 1 element", function() {

            stylePanel.buildGetLegend = function(a, b, c, d) { return '' + a + b + c + d };

            var layer = {
                isNcwms: function() {return true},
                allStyles: [
                    {name: 'name1', title: 'style1/palette1'},
                    {name: 'name2', title: ''},
                    {name: 'name3', title: 'title3'}
                ]
            };
            var retVal = stylePanel._styleData(layer);
            var expected = '[["name1","style1/palette1","[object Object]name1palette1true"],["name2","name2","[object Object]name2true"],["name3","title3","[object Object]name3title3true"]]';

            expect(JSON.stringify(retVal)).toBe(expected);
        });
    });

    describe("_getPalette(layer)", function() {

        var ncWmsLayer = {isNcwms: function() {return true}};
        var otherLayer = {isNcwms: function() {return false}};

        it("Returns palette when the style is in the form style/palette", function() {

            var retVal = stylePanel._getPalette(ncWmsLayer, "dots/rainbow");

            expect(retVal).toBe("rainbow");
        });

        it("Returns style when in other forms", function() {

            var retVal = stylePanel._getPalette(ncWmsLayer, "squiggle");

            expect(retVal).toBe("squiggle");
        });

        it("Returns undefined for non-ncWMS Layers", function() {

            var retVal = stylePanel._getPalette(otherLayer, "style name");

            expect(retVal).toBeUndefined();
        });
    });
});
