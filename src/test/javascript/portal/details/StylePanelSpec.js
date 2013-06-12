
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
		return "";
	}
	else {
		return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
}

var stylePanel;

describe("Portal.details.StylePanel", function() {

    beforeEach(function() {

        stylePanel = new Portal.details.StylePanel({});
    });

    describe("buildGetLegend()", function() {

        var stylePanel = new Portal.details.StylePanel({});

        it("should have empty version when no type specified", function() {

            var layer = {
                params: {},
                url: ""
            };
            var urlString = stylePanel.buildGetLegend(layer, null, null, false);
            expect(getParameterByNameFromUrlString(urlString, "VERSION")).toEqual("");
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
    });

    describe("update() (incomplete, only tests some functionality)", function() {

        var server = {
            type: "NCWMS-1.3.0",
            uri: "http://geoserver.imos.org.au/geoserver/wms"
        };

        var ncwmsLayer = new OpenLayers.Layer.WMS(
            "test layer",
            "http://geoserver.imos.org.au/geoserver/wms",
            {
                queryable: true
            },
            {isBaseLayer: false, server: server}
        );

        ncwmsLayer.allStyles = [{title: "black", name: "sillynoncolour"},{title:"primary", name: "extremelylimiting"}];

        it("should call collapse() on StyleCombo combo box", function() {

            spyOn(stylePanel.styleCombo, "collapse");
            var ob = {};
            ob.call = function(){return true;};
            var func = function(){return true;};
            stylePanel.refreshLegend = function(ncwmsLayer){};

            stylePanel.update(ncwmsLayer, func, func, null);

            expect(stylePanel.styleCombo.collapse).toHaveBeenCalled();
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

            expect(retVal).toBe(undefined);
        });
    });
});
