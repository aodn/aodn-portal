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
            height: 90
        });

        var config = Ext.apply({
            layout: new Ext.layout.CardLayout(),
            activeItem: this.boxDisplayPanel,
            items: [
                this.boxDisplayPanel,
                this.polygonDisplayPanel
            ]
        }, cfg);

        Portal.details.SpatialConstraintDisplayPanel.superclass.constructor.call(this, config);

        if (this.map) {
            this.map.events.addEventType('spatialconstraintadded');

            this.map.events.on({
                scope: this,
                'spatialconstraintadded': function(geometry) {
                    this._showCardForGeometry(geometry);
                }
            });

            this._showCardForGeometry(this.map.getConstraint());
        }
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

        card.setGeometry(geometry);
    }
});
