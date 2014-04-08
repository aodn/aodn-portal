/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SpatialConstraintDisplayPanel = Ext.extend(Ext.Panel, {
    constructor: function(cfg) {

        this.boxDisplayPanel = new Portal.details.BoxDisplayPanel(cfg);
        this.polygonDisplayPanel = new Portal.details.PolygonDisplayPanel({
            height: 90,
            width: 200
        });
        this.noneDisplayPanel = new Ext.Panel({
            setGeometry: function() {}
        });

        var config = Ext.apply({
            layout: new Ext.layout.CardLayout(),
            activeItem: this.noneDisplayPanel,
            items: [
                this.boxDisplayPanel,
                this.polygonDisplayPanel,
                this.noneDisplayPanel
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
                'spatialconstraintcleared': this._showCardForNone
            });

            this.map.events.on({
                scope: this,
                'spatialconstrainttypechanged': this._showCardForNone
            });

            this.on('beforedestroy', function(self) {
                self.map.events.unregister('spatialconstraintadded', self, self._showCardForGeometry);
                self.map.events.unregister('spatialconstraintcleared', self, self._showCardForNone);
                self.map.events.unregister('spatialconstrainttypechanged', self, self._showCardForNone);
            });

            this._showCardForGeometry(this.map.getConstraint());
        }
    },

    _showCardForNone: function() {
        this._showCard(this.noneDisplayPanel);
    },

    _showCardForGeometry: function(geometry) {
        if (geometry) {
            var card = geometry.isBox() ? this.boxDisplayPanel : this.polygonDisplayPanel;
            this._showCard(card, geometry);
        }
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
        // doLayout call required here to correctly redraw the box display panel on initialisation
        this.doLayout();
    }
});
