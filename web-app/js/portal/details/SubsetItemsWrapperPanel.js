/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.SubsetItemsWrapperPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        var tabPanelForLayer = this._initSubsetItemsTabPanel(cfg);

        this.createTools(cfg.dataCollection.getSelectedLayer());

        cfg.dataCollection.getSelectedLayer().events.register('loadstart', this, function() {
            this._onLayerLoadStart();
        });

        cfg.dataCollection.getSelectedLayer().events.register('loadend', this, function() {
            this._onLayerLoadEnd();
        });

        cfg.dataCollection.getSelectedLayer().events.register('tileerror', this, function() {
            this._onLayerLoadError();
        });

        var config = Ext.apply({
            cls: 'subsetPanelAccordionItem',
            title: '<h4>' + cfg.dataCollection.getSelectedLayer().name + '</h4>',
            autoHeight: true,
            defaults: {
                style: {padding: '10px'},
                autoHeight: true
            },
            items: [tabPanelForLayer],
            toolTemplate: new Ext.Template('<div class="x-tool-awesome fa fa-fw {styles}" title="{title}"></div>'),
            tools: [
                this.errorToolItem,
                this.spinnerToolItem,
                this.deleteToolItem
            ]
        }, cfg);

        Portal.details.SubsetItemsWrapperPanel.superclass.constructor.call(this, config);
    },

    _onLayerLoadStart: function() {
        this._indicateLayerLoading(true);
        this._indicateLayerError(false);
    },

    _onLayerLoadEnd: function() {
        this._indicateLayerLoading(false);
    },

    _onLayerLoadError: function() {
        this._indicateLayerLoading(false);
        this._indicateLayerError(true);
    },

    _indicateLayerError: function(show) {
        show ? this.tools.errorToolItem.show() : this.tools.errorToolItem.hide();
    },

    _indicateLayerLoading: function(loading) {
        loading ? this.tools.spinnerToolItem.show() : this.tools.spinnerToolItem.hide();
    },

    _initSubsetItemsTabPanel: function(cfg) {
        return new Portal.details.SubsetItemsTabPanel({
            map: cfg.map,
            dataCollection: cfg.dataCollection,
            dataCollectionStore: cfg.dataCollectionStore,
            listeners: {
                beforeTabChange: this._doTracking
            }
        });
    },

    createTools: function(layer) {

        this.errorToolItem = {
            id: 'errorToolItem',
            styles: 'error fa-exclamation-triangle',
            hidden: true,
            title: OpenLayers.i18n('layerProblem')
        };
        this.spinnerToolItem = {
            id: 'spinnerToolItem',
            styles: 'fa-spin fa-spinner',
            hidden: !layer.loading,
            title: OpenLayers.i18n('loadingMessage')
        };
        this.deleteToolItem = {
            id: 'deleteToolItem',
            styles: 'fa-close',
            handler: this._layerDelete,
            title: OpenLayers.i18n('removeDataCollection'),
            scope: this
        };
    },

    _layerDelete: function() {
        this.dataCollectionStore.remove(this.dataCollection);
    },

    _doTracking: function(panel, newTab, currentTab) {

        if (currentTab) {
            trackUsage(
                OpenLayers.i18n('subsetItemsTrackingCategory'),
                OpenLayers.i18n('subsetItemsTabsTrackingAction'),
                newTab.title,
                this.dataCollection.getSelectedLayer().name
            );
            return true;
        }
    }
});
