/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchResults = Ext.extend(Ext.Panel, {


    initComponent:function () {

        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="">',
                    '<div class="x-panel-header facetedSearchResultRow">',
                        '<h3 class="facetedSearchResultHeader">{title}</h3>',
                        '<div class="facetedSearchBtn" id="fsSearchAddBtn{uuid}">{[this.getButton(values)]}</div>',
                    '</div>',
                    '<div class="x-panel-body x-box-layout-ct" style="height:120px;">',
                        '<div class="x-panel x-box-item" style="height:120px;width:240px;padding:5px;" id="fsSearchMap{uuid}">{[this.getMiniMap(values)]}</div>',
                        '<div class="x-panel x-box-item facetedSearchResultTextBody" style="left:240px; ">',
                            '<div><span class="x-panel-header">Organisation</span>',
                                '<span>- Shooters and Chainsaw Operators Party</span>',
                            '</div>',
                            '<p class="facetedSearchResultTextBody"><i>{[this.trimAbstract(values.abstract,40)]}</i>',
                            '&nbsp;{[this.getMetadataLink(values)]}</p>',
                        '</div>',
                    '</div>',
                '</div>',
            '</tpl>',
            this,
            {
                getButton: function(values) {
                    this.createButton.defer(1, this,[values.uuid]);
                    return "";
                }

            }
        )

        this.pagingBar = new Ext.PagingToolbar({
            pageSize: 25,
            store: this.store,
            height: 60,
            flex: 1,
            autoLoad: true
        });

        var config = {
            title: false,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                new Ext.DataView({
                autoScroll: true,
                flex:15,
                store: this.store,
                tpl: tpl
            }),
                this.pagingBar

            ]
        };


        Ext.apply(this, config);

        Portal.search.FacetedSearchResults.superclass.initComponent.apply(this, arguments);

        this.store.on('load', function() {
            this._onStoreLoad();
        }, this);

        this._subscribeToActiveGeoNetworkRecordStoreEvents();
    },

    createButton: function(uuid) {
        var cls = "";
        if (this.isRecActive(uuid)) {
            cls = "x-btn-selected";
        }

        new Ext.Button({
            text: "Select",
            cls: cls,
            scope: this,
            renderTo: "fsSearchAddBtn" + uuid,
            listeners: {
                click: {
                    fn: this._viewButtonOnClick,
                    scope: this
                }
            }
        })
    },

    getMetadataLink: function(values) {
        var ret = "";
        var links = values.links;

        console.log(values);
        for (var i = 0; i < links.length; i++) {
            if (links[i].protocol == "WWW:LINK-1.0-http--metadata-URL") {
                ret = '<a href="' + links[i].href + '"  class="nowrap" title="' + links[i].title + '"> more </a>';
            }
        }
        return ret;

    },

    getMiniMap: function(values) {


        function _baseLayer() {
            return new OpenLayers.Layer.WMS(
                "IMOS Tile Cache Simple Baselayer",
                "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi/1.0.0/",
                { layers: 'default_basemap_simple' }
            );
        };

        function _zoomLevel(map, bounds) {
            var zoomLevel = map.getZoomForExtent(bounds);
            if (zoomLevel == 0) {
                // 0 is too large
                zoomLevel = 1;
            }
            else if (zoomLevel > 4) {
                // Anything over 4 doesn't show enough to get an idea of where things are
                zoomLevel = 4;
            }
            return zoomLevel;
        };


        function getBestBbox(bbox) {
            if (bbox.getBounds() != undefined) {
                return bbox;
            }
            else {
                return new  OpenLayers.Bounds.fromString(Portal.app.config.defaultDatelineZoomBbox);
            }
        };

        var componentId = Ext.id();

        var metadataExtent = values.bbox;
        var emptyString =  (metadataExtent.getBounds() == undefined) ? OpenLayers.i18n('unavailableExtent') : '';

        var map = new OpenLayers.Map({
            controls: [
                new OpenLayers.Control.MousePosition({
                    emptyString: emptyString
                })
            ]
        });
        map.addLayer(_baseLayer());
        map.addLayer(metadataExtent.getLayer());

        setTimeout(function() {
            map.render("fsSearchMap" + values.uuid);
            if (metadataExtent.getBounds()) {
                map.setCenter(metadataExtent.getBounds().getCenterLonLat(), _zoomLevel(map, metadataExtent.getBounds()));
            }
            else {
                map.zoomToExtent( new  OpenLayers.Bounds.fromString(Portal.app.config.defaultDatelineZoomBbox));
            }
        }, 10);
        return "";


    },

    isRecActive: function(uuid) {
        var record = this._getRecordFromUuid(uuid);
        return (Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(record))
    },

    trimAbstract: function(text,wordCount) {
        return text.split(' ').splice(0, wordCount).join(' ') + " ... ";
    },

    _viewButtonOnClick: function(btn) {

        btn.addClass("x-btn-selected");
        var uuid = btn.container.id.replace("fsSearchAddBtn",'');
        var record = this._getRecordFromUuid(uuid);

        if (!Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(record)) {
            Portal.data.ActiveGeoNetworkRecordStore.instance().add(record);
        }
        Ext.MsgBus.publish('viewgeonetworkrecord', record);
    },

    _getRecordFromUuid: function(uuid) {
        var record;
        this.store.each(function(rec) {
            if(rec.data.uuid == uuid)   {
                record = rec;
            }
        });
        return record;
    },
    _subscribeToActiveGeoNetworkRecordStoreEvents: function() {
        Ext.each(['activegeonetworkrecordadded', 'activegeonetworkrecordremoved'], function(eventName) {
            Ext.MsgBus.subscribe(eventName, function() {
                this._refreshView();
            }, this);
        }, this);
    },

    _refreshView: function() {
        if (this.view) {
            this.view.refresh();
        }
    },

    afterRender: function () {
        Portal.search.FacetedSearchResults.superclass.afterRender.call(this);

        /*this.loadMask = new Portal.common.LoadMask(this.getView().mainBody, {
            msg: OpenLayers.i18n('maskText'),
            setTopPixels: 50
        });
        */
    },

    showMask: function () {
        if (this.rendered) {
            //this.loadMask.showAtTop();
        }
    },

    _onStoreLoad: function() {

        this.pagingBar.onLoad(
            this.store,
            null,
            {
                params: {
                    start: this.store.startRecord,
                    limit: 10
                }
            }
        );
    }
});

Ext.reg('portal.search.facetedsearchresults', Portal.search.FacetedSearchResults);
