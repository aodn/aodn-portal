
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {
        var config = Ext.apply({
            title: OpenLayers.i18n('stepHeader', { stepNumber: 2, stepDescription: OpenLayers.i18n('step2Description')}),
            headerCfg: {
                cls: 'steps'
            },
            layout: 'vbox',
            layoutConfig: {
                align: 'stretch'
            },
            stateful: true
        }, cfg);

        this.mapPanel = cfg.mapPanel;

        Portal.details.DetailsPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.SELECTED_LAYER_CHANGED, function (eventName, openlayer) {
            this.updateDetailsPanel(openlayer);
        }, this);
    },

    initComponent: function () {
        this.detailsPanelTabs = new Portal.details.DetailsPanelTab({
            map: this.map
        });

        this.opacitySlider = new Portal.common.LayerOpacitySliderFixed({
            id: "opacitySlider",
            layer: new OpenLayers.Layer("Dummy Layer"),
            keyIncrement: 10,
            increment: 5,
            minValue: 20, // we dont want a user to be able to give zero vis
            maxValue: 100,
            aggressive: true,
            width: 175,
            isFormField: true,
            inverse: false,
            fieldLabel: "Opacity",
            plugins: new GeoExt.LayerOpacitySliderTip({
                template: '<div class="opacitySlider" >Opacity: {opacity}%</div>'
            })
        });

        this.status = new Ext.Container({
            html: OpenLayers.i18n('noActiveCollectionSelected'),
            cls: 'collectionTitle',
            margins: {top:20, right:5, bottom:10, left:0},
            autoHeight: true
        });

        this.opacitySliderContainer = new Ext.Panel({
            layout: 'form',
            height: 26,
            margins: {
                top: 5,
                right: 5,
                bottom: 0,
                left: 5
            },
            items: [this.opacitySlider]
        });

        this.transectControl = new Portal.mainMap.TransectControl({
            ref: 'transectControl',
            height: 30,
            listeners: {
                scope: this,

                transect: function (inf) {
                    var newTab = this.detailsPanelTabs.add({
                        xtype: 'panel',
                        title: OpenLayers.i18n('transectTab'),
                        closable: true,
                        layout: 'form',
                        autoScroll: true,
                        items: [
                            {
                                //TODO: use template
                                html: "<img width=\"300\" src=\"" + inf.transectUrl + "\" onclick=\"Ext.Msg.alert('" + OpenLayers.i18n('transectDataHeading') + "', '" + inf.line + "');\" />"
                            }
                        ]
                    });

                    this.detailsPanelTabs.setActiveTab(this.detailsPanelTabs.items.indexOf(newTab));
                }
            }
        });

        this.items = [
            this.status,
            this.opacitySliderContainer,
            this.transectControl,
            this.detailsPanelTabs
        ];

        Portal.details.DetailsPanel.superclass.initComponent.call(this);

        this.hideDetailsPanelContents();
    },

    // must be called when the panel is fully expanded for the slider
    updateDetailsPanel: function (layer, forceOpen) {

        if (layer) {
            this.setStatus(layer.name);

            // show new layer unless user requested 'hideLayerOptions'
            this.detailsPanelTabs.update(layer);
            this.transectControl.hide();

            // remove any transect tabs for previous layer
            var transectTabs = this.detailsPanelTabs.find('title', OpenLayers.i18n('transectTab'));
            for (var i=0;i<transectTabs.length;i++) {
                this.detailsPanelTabs.remove(transectTabs[i]);
            }

            //turn on transect control if server is NCWMS and layer is not animated.
            if (   layer.server.type.search("NCWMS") > -1
                && !layer.isAnimated)  {
                this.transectControl.setMapPanel(this.mapPanel);
                this.transectControl.layer = layer;
                this.transectControl.show();
                this.transectControl.ownerCt.doLayout();
            }

            this.opacitySliderContainer.doLayout();
            this.opacitySliderContainer.show();
            //weird stuff happens if you set layer before showing the container, see Bug #1582
            this.opacitySlider.setLayer(layer);

            // #2165 - need to "doLayout", since showing/hiding components above (or else, the opacity
            // slider won't be rendered properly, for example).
            this.doLayout();
        }
        else {
            this.setStatus(OpenLayers.i18n('noActiveCollectionSelected'));
            this.hideDetailsPanelContents();
        }
    },

    setStatus: function(status) {

        if (this.status.rendered) {
            this.status.update(status);
        }

    },

    hideDetailsPanelContents: function () {
        // clear the details Panel. ie. Don't show any layer options

        //DO NOT HIDE THE opacitySlider directly, or you WILL break things.-Alex
        this.opacitySliderContainer.setVisible(false);
        this.detailsPanelTabs.setVisible(false);
        this.deactivateDrawingControl();
        this.transectControl.hide();
    },

    deactivateDrawingControl: function () {
        if (this.transectControl != null) {
            this.transectControl.deactivateDrawingControl();
        }
    }
});
