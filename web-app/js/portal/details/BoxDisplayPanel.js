Ext.namespace('Portal.details');

Portal.details.BoxDisplayPanel = Ext.extend(Portal.details.GeomDisplayPanel, {

    TABLE_WIDTH: 165,

    constructor: function(cfg) {

        this.map = cfg.map;

        var config = Ext.apply({
            cls: "bboxExtentPicker",
            items: [
                this._buildBoundingBox(cfg)
            ],
            padding: '0 5px 0 5px'
        }, cfg);

        Portal.details.BoxDisplayPanel.superclass.constructor.call(this, config);
    },


    getBounds: function() {
        return new OpenLayers.Bounds(
            this.westBL.getValue(),
            this.southBL.getValue(),
            this.eastBL.getValue(),
            this.northBL.getValue()
        );
    },

    setBounds: function(bounds) {
        this.southBL.setValue(bounds.bottom);
        this.westBL.setValue(bounds.left);
        this.northBL.setValue(bounds.top);
        this.eastBL.setValue(bounds.right);
    },

    emptyBounds: function() {
        this.southBL.setRawValue();
        this.westBL.setRawValue();
        this.northBL.setRawValue();
        this.eastBL.setRawValue();
    },

    _buildBoundingBox: function(config) {
        this.northBL = this._buildCoord('northBL',-90,90);
        this.eastBL = this._buildCoord('eastBL',-180,180);
        this.southBL = this._buildCoord('southBL',-90,90);
        this.westBL = this._buildCoord('westBL',-180,180);

        return [
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack:'center',
                    align: 'middle'
                },
                width: this.TABLE_WIDTH,
                height: this.TABLE_HEIGHT,
                items: [
                    this._buildLabel('northBL'),
                    this.northBL
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                width: this.TABLE_WIDTH,
                height: this.TABLE_HEIGHT,
                items: [
                    this._buildLabel('westBL'),
                    this.westBL,
                    {
                        xtype: 'label',
                        text: ' ',
                        flex: 1
                    },
                    this._buildLabel('eastBL'),
                    this.eastBL,
                    {
                        xtype: 'label',
                        text: ' ',
                        flex: 1
                    }
                ]
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    pack: 'center',
                    align: 'middle'
                },
                width: this.TABLE_WIDTH,
                height: this.TABLE_HEIGHT,
                items: [
                    this._buildLabel('southBL'),
                    this.southBL
                ]
            }
        ];
    }
});
