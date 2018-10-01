Ext.namespace('Portal.ui');

Portal.ui.openlayers.MapOptions = Ext.extend(Object, {

    constructor: function(cfg, mapPanel) {
        var config = Ext.apply({}, cfg);
        Portal.ui.openlayers.MapOptions.superclass.constructor.call(this, config);

        Ext.QuickTips.init();

        this.navigationControl = new OpenLayers.Control.Navigation({
            title: OpenLayers.i18n('panControl')
        });

        this.mapPanel = mapPanel;

        this.toolPanel = new OpenLayers.Control.Panel();
        this.toolPanel.addControls([this.navigationControl]);

        // Control to get feature info or pop up
        this.clickControl = new Portal.ui.openlayers.ClickControl({
            fallThrough: true,
            onClick: function(event) {
                this.map.events.triggerEvent('featureInfoClick', {xy: event.xy});
            }
        });

        this.layerSwitcher = new Portal.ui.openlayers.LayerSwitcher({
            'ascending': false
        });

        this.controls = [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.PanZoomBar(),
            this.layerSwitcher,
            new OpenLayers.Control.MousePosition(),
            new OpenLayers.Control.ScaleLine(),
            new OpenLayers.Control.OverviewMap({
                autoPan: true,
                minRectSize: 30,
                mapOptions: {
                    resolutions: [0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125]
                }
            }),
            this.toolPanel,
            this.clickControl
        ];

        this.tileManager = null;
        this.displayProjection = new OpenLayers.Projection("EPSG:4326");
        this.prettyStateKeys = true; // for pretty permalinks,
        this.resolutions = [0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 0.0006866455078125, 0.00034332275390625, 0.000171661376953125];
    },

    afterRender: function() {

        this.navigationControl.events.on({
            "activate": function() {
                this.clickControl.activate();
            },
            "deactivate": function() {
                this.clickControl.deactivate();
            },
            scope: this
        });
    },

    resetControls: function() {
        this.layerSwitcher.minimizeControl();
    },

    /**
     * Create a new map, from using the options specified by 'this'.
     */
    newMap: function() {
        this.restrictedExtent = new OpenLayers.Bounds.fromArray([-720, -90, 720, 90]);
        return new OpenLayers.SpatialConstraintMap(this);
    }
});
