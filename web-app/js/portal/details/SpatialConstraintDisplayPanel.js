Ext.namespace('Portal.details');

Portal.details.SpatialConstraintDisplayPanel = Ext.extend(Ext.Panel, {
    constructor: function(cfg) {

        this.boxDisplayPanel = new Portal.details.BoxDisplayPanel(cfg);
        this.pointDisplayPanel = new Portal.details.PointDisplayPanel(cfg);

        this.polygonDisplayPanel = new Portal.details.PolygonDisplayPanel({
            height: 90,
            width: 200
        });

        this.emptyPolygonDisplayPanel = new Ext.Panel({
            cls: 'italic',
            html: OpenLayers.i18n("emptyPolygonHelperText"),
            padding: '0 5px 0 5px',
            setGeometry: function() {}
        });

        var config = Ext.apply({
            layout: new Ext.layout.CardLayout(),
            activeItem: this.boxDisplayPanel,
            layoutOnCardChange: true, // required for boxDisplayPanel
            items: [
                this.boxDisplayPanel,
                this.polygonDisplayPanel,
                this.pointDisplayPanel,
                this.emptyPolygonDisplayPanel
            ]
        }, cfg);

        Portal.details.SpatialConstraintDisplayPanel.superclass.constructor.call(this, config);

        if (this.map) {

            this.map.events.on({
                scope: this,
                'spatialconstraintadded': this._showCardForGeometry
            });

            this.map.events.on({
                scope: this,
                'spatialconstraintcleared': this._showCardForReset
            });

            this.map.events.on({
                scope: this,
                'spatialconstrainttypechanged': this._showCardForType
            });

            this.on('beforedestroy', function(self) {
                self.map.events.unregister('spatialconstraintadded', self, self._showCardForGeometry);
                self.map.events.unregister('spatialconstraintcleared', self, self._showCardForReset);
                self.map.events.unregister('spatialconstrainttypechanged', self, self._showCardForType);
            });

            this._showCardForGeometry(this.map.getConstraint());
        }
    },

    _showCardForType: function(type) {
        var card = this.emptyPolygonDisplayPanel;
        if (type == Portal.ui.openlayers.SpatialConstraintType.BOUNDING_BOX) {
            card = this.boxDisplayPanel;
        }
        else if (type == Portal.ui.openlayers.SpatialConstraintType.POINT) {
            card = this.pointDisplayPanel;
        }
        this._showCard(card, this.lastSpatialGeometry);
    },

    _showCardForReset: function() {

        this.lastSpatialGeometry = undefined;
        this.boxDisplayPanel.emptyBounds();
        this._showCard(this.boxDisplayPanel);
    },

    _showCardForGeometry: function(geometry) {

        if (geometry) {
            this.lastSpatialGeometry = geometry;
            var card;

            if (geometry.isBox()) {
                if (this.isInfinatelySmallGeometry(geometry)) {
                    card = this.pointDisplayPanel;
                }
                else {
                    card = this.boxDisplayPanel;
                }
            }
            else {
                card = this.polygonDisplayPanel;
            }

            this._showCard(card, geometry);
        }
    },

    isInfinatelySmallGeometry: function(geometry) {
        return geometry.getArea() == 0 &&
                geometry.getBounds().getWidth() == 0 &&
                geometry.getBounds().getHeight() == 0
    },

    _showCard: function(card, geometry) {

        if (this.rendered) {
            this.layout.setActiveItem(card);
        }
        else {
            this.activeItem = card;
        }

        if (geometry) {
            card.setGeometry(geometry);
        }
    }
});
