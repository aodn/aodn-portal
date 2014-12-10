/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.FeatureInfoPopup = Ext.extend(GeoExt.Popup, {

    constructor: function(cfg) {
        this.numResultsToLoad = 0;
        this.numResultQueries = 0;
        this.numGoodResults = 0;

        var config = Ext.apply({
            title: OpenLayers.i18n('searchingTitle'),
            width: Portal.app.appConfig.portal.popupWidth,
            height: 80, // set height later when there are results
            maximizable: true,
            anchored: true,
            autoScroll: true,
            resizable: false
        }, cfg);

        Portal.ui.FeatureInfoPopup.superclass.constructor.call(this, config);

        this._addElements();

        this.on('maximize', this._onMaximizeRestore, this);
        this.on('restore', this._onMaximizeRestore, this);

        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, function() {
            this.close();
        }, this);
    },

    unanchorPopup: function() {
        this._makeResizable();
        Portal.ui.FeatureInfoPopup.superclass.unanchorPopup.call(this);
    },

    _makeResizable: function() {
        this.resizable = true;
        var resizer = new Ext.Resizable(this.getEl());
        resizer.on('resize', this._onResize, this);
    },

    _onResize: function() {
        this.syncSize();
        this.popupTab.doLayout();
        this.popupTab.delegateUpdates();
    },

    _onMaximizeRestore: function() {
        this.popupTab.doLayout();
        this.popupTab.delegateUpdates();
    },

    _addElements: function() {

        this.depthInfoPanel = new Ext.Container({
            html: OpenLayers.i18n('loadingMessage'),
            cls: 'popupHtml',
            ref: 'popupHtml'
        });

        this.add(this.depthInfoPanel);

        // Add tab panel (empty for now)
        this.add(new Ext.TabPanel({
            ref: 'popupTab',
            enableTabScroll: true,
            deferredRender: true,
            hidden: true
        }));
    },

    findFeatures: function(event) {
        this.location = this.map.getLonLatFromViewPortPx(event.xy);

        this._setLocationString();
        this._display();

        this._handleDepthService();
        this._handleLayers();
    },

    _handleDepthService: function() {

        Ext.Ajax.request({
            scope: this,
            url: 'depth',
            params: {
                lat: this.location.lat,
                lon: this.location.lon
            },
            success: function(response, options) {
                this._updatePopupDepthStatus(response);
            },
            failure: function(response, options) {
                this._updatePopupDepthStatus(null);
            }
        });
    },

    _handleLayers: function() {
        var wmsLayers = this._collectUniqueLayers();

        var queryableVisibleLayersCount = 0;

        Ext.each(wmsLayers, function(layer, index, all) {
            if (layer.params.QUERYABLE == true && layer.getVisibility()) {

                queryableVisibleLayersCount++;

                this._requestFeatureInfo(layer);
            }
        }, this);

        if (queryableVisibleLayersCount > 0) {
            this.setSize(Portal.app.appConfig.portal.popupWidth, Portal.app.appConfig.portal.popupHeight);
        }
        else if (queryableVisibleLayersCount == 0) {
            this.setTitle(OpenLayers.i18n('noDataCollectionTitle'));
            this.depthInfoPanel.update("");
        }
        trackUsage(OpenLayers.i18n('featureInfoTrackingCategory'), OpenLayers.i18n('trackingClickLabel'));
    },

    _requestFeatureInfo: function(layer) {
        this.numResultsToLoad++;

        var extraLayerInfo = layer.extraLayerInfo ? layer.extraLayerInfo : {};

        Ext.ux.Ajax.proxyRequestXML({
            scope: this,
            url: this._getLayerFeatureInfoRequestString(layer),
            extraParams: {
                layer: layer,
                name: layer.name,
                expectedFormat: layer.getFeatureInfoFormat(),
                units: extraLayerInfo.units,
                copyright: extraLayerInfo.copyright
            },
            success: function(resp, options) {
                // Delegate HTML formatting of response to layer
                this._addPopupTabContent(
                    options.extraParams.layer.formatFeatureInfoHtml(resp, options),
                    options.extraParams.name
                );
                this._featureInfoRequestCompleted();
                Portal.utils.Image.resizeWhenLoadedAfterDelay('div > .featureinfocontent .feature img', 500);
            },
            failure: this._featureInfoRequestCompleted
        });
    },

    _featureInfoRequestCompleted: function() {
        this.numResultQueries++;
        this._updateStatus();
    },

    _getLayerFeatureInfoRequestString: function(layer) {
        return layer.getFeatureInfoRequestString(
            this._clickPoint(),
            {
                BUFFER: Portal.app.appConfig.portal.mapGetFeatureInfoBuffer
            }
        );
    },

    _clickPoint: function() {
        var pixel = this.map.getViewPortPxFromLonLat(this.location);
        return { x: Math.round(pixel.x), y: Math.round(pixel.y)}
    },

    _collectUniqueLayers: function() {
        var uniqueLayers = [];
        var rootLayers = {};

        var allLayers = this.map.getLayersByClass("OpenLayers.Layer.WMS");
        allLayers.concat(this.map.getLayersByClass("OpenLayers.Layer.Image"));
        Ext.each(allLayers, function(layer, index, all) {
            if (!layer.isBaseLayer) {
                if (layer.isAnimated) {
                    var rootLayer = rootLayers[layer.params.LAYERS];
                    this._setLayerTimes(layer);
                    if (!rootLayer) {
                        rootLayers[layer.params.LAYERS] = layer;
                        rootLayer = layer;
                        uniqueLayers.push(rootLayer);
                    }
                    if (this._after(rootLayer, layer)) {
                        rootLayer.endTime = layer.endTime;
                    }
                    if (this._before(rootLayer, layer)) {
                        rootLayer.startTime = layer.startTime;
                    }
                }
                else {
                    uniqueLayers.push(layer);
                    rootLayers[layer.params.LAYERS] = layer;
                }
            }
        }, this);

        return uniqueLayers;
    },

    _setLayerTimes: function(layer) {
        layer.startTime = this._getLayerTimeFromUrl(layer);
        layer.endTime = this._getLayerTimeFromUrl(layer);
    },

    _getLayerTimeFromUrl: function(layer) {
        if (layer.params.TIME) {
            return new Date(layer.params.TIME);
        }
    },

    _after: function(layer, other) {
        var result = false;
        if (other.endTime && !layer.endTime) {
            result = true;
        }
        else if (layer.endTime && other.endTime) {
            result = other.endTime.getTime() > layer.endTime.getTime();
        }
        return result;
    },

    _before: function(layer, other) {
        var result = false;
        if (other.startTime && !layer.startTime) {
            result = true;
        }
        else if (layer.startTime && other.startTime) {
            result = other.startTime.getTime() < layer.startTime.getTime();
        }
        return result;
    },

    _display: function(clickLocation) {
        this.doLayout();
        this.show();
    },

    _setLocationString: function() {
        this.locationString = this._getCoordinateLabel("Lat:", this.location.lat) + " " + this._getCoordinateLabel("Lon:", this.location.lon);
    },

    _getCoordinateLabel: function(latLonLabel, coord) {
        // TODO move toNSigFigs into a class somewhere
        return this._boldify(latLonLabel) + " " + toNSigFigs(coord, 4);
    },

    _boldify: function(text) {
        return "<b>" + text + "</b>";
    },

    _updateStatus: function() {
        if (this.numGoodResults > 0) {
            this.setTitle(
                OpenLayers.i18n(
                    'infoFoundTitle',
                    { 'dataCollectionNumber': this.numGoodResults }
                ));
        }
        else if (this.numResultQueries == this.numResultsToLoad) {
            this.setTitle(
                OpenLayers.i18n(
                    'noInfoFoundTitle',
                    { 'dataCollectionNumber': this.numResultsToLoad }
                ));
        }
    },

    _updatePopupDepthStatus: function(response) {
        if (response !== undefined) {
            var xmldoc = response.responseXML;

            // Depth service can return 204 but our app changes that to a 200 and pipes down nothing
            if (xmldoc && xmldoc.getElementsByTagName('depth') !== undefined) {
                var depth = xmldoc.getElementsByTagName('depth')[0].firstChild.nodeValue;
                var label = OpenLayers.i18n(depth <= 0 ? 'depthLabel' : 'elevationLabel');

                this.depthInfoPanel.update(this.locationString + " " + this._boldify(label) + " " + Math.abs(depth) + "m");
            }
            else {
                this.depthInfoPanel.update("");
            }
        }
        else {
            // clear out any placeholder 'loading' text
            this.depthInfoPanel.update("");
        }
    },

    _addPopupTabContent: function(content, title) {
        if (!content) {
            return;
        }

        // We'll need to set the active tab index later, if there's not one currently.
        var activeTab = this.popupTab.getActiveTab();

        this.popupTab.add({
            xtype: "box",
            title: title,
            padding: 30,
            autoHeight: true,
            cls: "featureinfocontent",
            autoEl: {
                html: content
            },
            listeners: {
                // find any script loaded as text and run it when this tab is opened
                activate: function() {
                    var code = $('#' + this.getId() + ' script').text();
                    var codefunc = new Function(code);
                    codefunc();
                }
            }
        });

        if (!activeTab) {
            this.popupTab.setActiveTab(0);
        }

        this.popupTab.doLayout();
        this.popupTab.show();
        this.numGoodResults++;
    },

    fitContainer: function() {
        if (this.map.size) {
            this.setSize(this.map.size.w, this.map.size.h);
            if (this.dd) {
                this.dd.unlock();
            }

            if (this.maximisedPosition && this.maximisedPosition.x && this.maximisedPosition.y) {
                this.setPosition(this.maximisedPosition.x, this.maximisedPosition.y);
            }
        }
        else {
            GeoExt.Popup.prototype.fitContainer.call(this);
        }
    }
});
