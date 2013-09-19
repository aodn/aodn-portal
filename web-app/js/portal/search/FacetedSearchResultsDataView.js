/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsDataView = Ext.extend(Ext.DataView, {


    initComponent:function () {

        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div>',
            '   <div class="x-panel-header facetedSearchResultRow">',
            '       <h3 class="facetedSearchResultHeader">{title}</h3>',
            '       <div class="facetedSearchBtn" id="fsSearchAddBtn{uuid}">{[this.getButton(values)]}</div>',
            '   </div>',
            '   <div class="x-panel-body x-box-layout-ct facetedSearchResultBody" style="height:120px;">',
            '       <div class="x-panel x-box-item" style="height:118px;width:238px;border:1px solid #cccccc;" id="fsSearchMap{uuid}">{[this.getMiniMap(values)]}</div>',
            '       <div class="x-panel x-box-item facetedSearchResultTextBody" style="left:240px; ">',
            '           {[this.getParametersAsHtml(values)]}',
            '           <p class="facetedSearchResultTextBody"><i>{[this.trimAbstract(values.abstract,30)]}</i>',
            '           &nbsp;{[this.getMetadataLinksAsHtml(values)]}</p>',
            '       </div>',
            '   </div>',
            '</div>',
            '</tpl>',
            this,
            {
                getButton: function(values) {
                    this.createButton.defer(1, this,[values.uuid]);
                    return "";
                }
            }
        );


        var config = {
            store: this.store,
            tpl: tpl
        };

        Ext.apply(this, config);
        Portal.search.FacetedSearchResultsDataView.superclass.initComponent.apply(this, arguments);

    },

    getParametersAsHtml: function(values){

        var paramTpl = new Ext.Template(
            '<div><span class="x-panel-header">{label}</span>',
            '   <span>- {value}</span>',
            '</div>'
        );
        var html= "";
        if (values.organisation) {
            html += paramTpl.apply({"label":"Organisation","value":values.organisation});
        }
        if (values.platform) {
            html += paramTpl.apply({"label":"Platform","value":values.platform});
        }
        if (values.temporalExtentBegin) {
            html += paramTpl.apply({
                "label":"Date Range",
                "value": moment(values.temporalExtentBegin).format("YYYY-MM-DD Z") + " - " + moment(values.temporalExtentEnd).format("YYYY-MM-DD Z")
            });
        }
        if (values.parameter.size > 0) {
            html += paramTpl.apply({"label":"Parameters","value": values.parameter.join(" - ")});
        }

        return html;
    },

    createButton: function(uuid) {
        var cls = "";
        if (this.isRecActive(uuid)) {
            cls = "x-btn-selected";
        }

        new Ext.Button({
            text: OpenLayers.i18n('navigationButtonSelect'),
            cls: "navigationButton forwardsButton " + cls,
            width: 100,
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

    getMetadataLinksAsHtml: function(values) {
        var ret = "";
        var links = values.links;

        for (var i = 0; i < links.length; i++) {
            if (links[i].protocol == "WWW:LINK-1.0-http--metadata-URL") {
                ret = '<a href="' + links[i].href + '" target="_blank" class="nowrap" title="' + links[i].title + '"> more </a>';
            }
        }
        return ret;
    },

    getMiniMap: function(values) {


        function _baseLayer() {
            return new OpenLayers.Layer.WMS(
                "IMOS Tile Cache Simple Baselayer",
                "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi/1.0.0/",
                { layers: 'satellite' }
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

    _getRecordFromUuid: function(uuid) {
        var record;
        this.store.each(function(rec) {
            if(rec.data.uuid == uuid)   {
                record = rec;
            }
        });
        return record;
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
    }
});

Ext.reg('portal.search.facetedsearchresultsdataview', Portal.search.FacetedSearchResultsDataView);
