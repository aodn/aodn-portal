/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.MessageBox.alert = function () {
};

//overwrite Ext.Ajax.request so it doesn't try to make requests.
Ext.Ajax.request = function(options) {
};

// Ref: http://stackoverflow.com/questions/11942085/is-there-a-way-to-add-a-jasmine-matcher-to-the-whole-environment
beforeEach(function() {

    setupTestConfigAndStubs();
    this.addMatchers({
        toBeSame: function(expected) {

            var notText = this.isNot ? " not" : "";
            var actualText = this.actual ? moment(this.actual).format() : this.actual;
            var expectedText = expected ? moment(expected).format() : this.expected;

            this.message = function() {
                return "Expected " + actualText + notText + " to be same as " + expectedText;
            };

            if (this.actual instanceof Array && expected instanceof Array) {
                if (this.actual.length != expected.length) {
                    return false;
                }

                var equal = true;
                for (var i = 0; i < expected.length; i++) {
                    if (!this.actual[i].isSame(expected[i])) {
                        equal = false;
                    }
                }

                return equal;
            }
            return moment(this.actual).isSame(moment(expected));   // moment.js#isSame()
        },

        toBeInstanceOf: function(expected) {
            return this.actual instanceof expected;
        },

        toStartWith: function(expected) {
            return this.actual.indexOf(expected) == 0;
        },

        toHaveParam: function(key, value) {

            var notText = this.isNot ? " not" : "";

            this.message = function() {
                return "Expected the query string" + notText + " to contain the key '" + key + "' with the value '" + value + "'. URL was: '" + this.actual + "'.";
            };

            var easySearchString = "&" + this.actual.replace(/\?/g, '&') + "&";

            return easySearchString.indexOf("&" + key + "=" + value + "&") >= 0;
        }
    });
});

var setupTestConfigAndStubs = function() {
    appConfigStore.getById = function(id) {
        if (id == 'spatialsearch.url') {
            return { data: { value: "spatialsearch.aodn.org.au" }};
        }
        return "";
    };

    Ext.namespace('Portal.app.config');
    Portal.app.config.metadataLayerProtocols = "OGC:WMS-1.1.1-http-get-map\nOGC:WMS-1.3.0-http-get-map";
    Portal.app.config.defaultDatelineZoomBbox = '90, 90, -90, -90';

    // Stop 404s.
    OpenLayers.Lang.en.loadingSpinner = '';
};

var mockLayoutForMainPanel = function(mainPanel) {
    // This is required because these things are normally set when the panel is rendered - but
    // we don't want to render in tests, because it is slow.
    mainPanel.layout.container = mainPanel;
    mainPanel.layout.setActiveItem = function(item) {
        mainPanel.layout.activeItem = mainPanel.getComponent(item);
    };
};

var mockMap = function() {
    return {
        events: { register: function(event, scope, fn) {}}
    };
};

// An empty function to pass as a parameter
var noOp = function() {};

var constructGeometry = function() {
    return OpenLayers.Geometry.fromWKT('POLYGON((1 2, 3 4, 1 2))');
};
