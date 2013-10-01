
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.openlayers.MapOptions = Ext.extend(Object, {

    constructor: function(cfg, mapPanel) {
        var config = Ext.apply({}, cfg);
        Portal.ui.openlayers.MapOptions.superclass.constructor.call(this, config);

        Ext.QuickTips.init();

        var container = document.getElementById("navtoolbar");

        this.navigation = new OpenLayers.Control.Navigation({
            title: OpenLayers.i18n('panControl')
        });

        var zoom = new OpenLayers.Control.ZoomBox({
            title: OpenLayers.i18n('zoomAndCentre')
        });
        var toolPanel = new OpenLayers.Control.Panel({
            defaultControl: this.navigation,
            div: container
        });
        toolPanel.addControls( [ zoom, this.navigation ] );

        // Control to get feature info or pop up
        this.clickControl = new Portal.ui.openlayers.ClickControl({
            fallThrough: true,
            onClick: function(event) {

                mapPanel.handleFeatureInfoClick(event);
            }
        });

        this.timeControl = new OpenLayers.Control.Time();

        this.controls = [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.OverviewMap({
                autoPan: true,
                minRectSize: 30,
                mapOptions:{
                    resolutions: [0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125]
                }
            }),
            toolPanel,
            this.clickControl,
            this.timeControl
        ];

        this.theme = null;
        this.displayProjection = new OpenLayers.Projection("EPSG:4326");
        this.prettyStateKeys = true; // for pretty permalinks,
        this.resolutions = [  0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625,  0.000171661376953125];

        // This is included here, as it is essentially just another control for the map, although
        // not an actual OpenLayers.Control.
        this.mapPanel = mapPanel;
    },

    afterRender: function(mapPanel) {
        this._initMapActionsControl(mapPanel);

        this.clickControl.activate();
        this.navigation.events.on({
            "activate": function() {
                this.clickControl.activate();
            },
            "deactivate": function() {
                this.clickControl.deactivate();
            },
            scope: this
        });
    },

    _initMapActionsControl: function(mapPanel) {
        this.mapActionsControl = new Portal.ui.openlayers.MapActionsControl(mapPanel.appConfig);
        mapPanel.map.addControl(this.mapActionsControl);
        this.mapActionsControl.maximizeControl();
    },

    /**
     * Create a new map, from using the options specified by 'this'.
     */
    newMap: function() {
        this.restrictedExtent = new OpenLayers.Bounds.fromArray([null, -90, null, 90]);
        return new OpenLayers.TemporalMap(this);
    }
});
