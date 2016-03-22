Ext.namespace('Portal.details');

Portal.details.PointDisplayPanel = Ext.extend(Portal.details.GeomDisplayPanel, {

    constructor: function(cfg) {

        this.map = cfg.map;

        var config = Ext.apply({
            cls: "bboxExtentPicker",
            items: [
                this._buildPointBox(cfg)
            ],
            padding: '15px 0 0 0'
        }, cfg);

        Portal.details.PointDisplayPanel.superclass.constructor.call(this, config);
    },

    getBounds: function() {
        return new OpenLayers.Bounds(
            this.lon.getValue(),
            this.lat.getValue(),
            this.lon.getValue(),
            this.lat.getValue()
        );
    },

    setBounds: function(bounds) {
        this.lon.setValue(bounds.left);
        this.lat.setValue(bounds.top);
        this.lat.setValue(bounds.bottom);
        this.lon.setValue(bounds.right);
    },

    emptyBounds: function() {
        this.lon.setRawValue();
        this.lat.setRawValue();
    },

    _buildLabel: function(i18nKey) {
        return new Ext.form.Label({
            text: OpenLayers.i18n(i18nKey),
            width: 25
        });
    },

    _buildPointBox: function(config) {
        this.lat = this._buildCoord('lat',-90,90);
        this.lon = this._buildCoord('lon',-180,180);

        return [
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack:'center',
                    align: 'middle'
                },
                height: this.TABLE_HEIGHT,
                items: [
                    this._buildLabel('lon'),
                    this.lon
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'middle'
                },
                height: this.TABLE_HEIGHT,
                items: [
                    this._buildLabel('lat'),
                    this.lat
                ]
            }
        ];
    }
});
