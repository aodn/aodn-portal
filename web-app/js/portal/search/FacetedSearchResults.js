/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchResults = Ext.extend(Ext.Panel, {

    layout: 'fit',

    initComponent:function () {

        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="">',
                    '<div class="x-panel-header facetedSearchResultRow">',
                        '<h3 class="facetedSearchResultHeader">{title}</h3>',
                        '<div class="facetedSearchBtn" >',
                        '<tpl if="this.isRecActive(values)" >',
                        '   <button type="button" id="fsSearchAddBtn{uuid}" class="x-btn x-btn-text x-btn-selected">Selected ></button></tpl>',
                        '<tpl if="!this.isRecActive(values)" >',
                        '   <button type="button" id="fsSearchAddBtn{uuid}" class="x-btn x-btn-text">Select ></button></tpl>',
                        '</div>',
                    '</div>',
                    '<div class="x-panel-body x-box-layout-ct" style=" height: 120px;">',
                        '<div class="x-panel x-box-item">',
                            '<img width="240" height="120" src="map.png">',
                        '</div>',
                        '<div class="x-panel x-box-item facetedSearchResultTextBody" style=" left: 240px; ">',
                            '<div><span class="x-panel-header">Organisation</span>',
                                '<span>- Shooters and Chainsaw Operators Party</span>',
                            '</div>',
                            '<p class="facetedSearchResultTextBody"><i>{abstract}</i>',
                            '&nbsp;<a href="http://mest.aodn.org.au"> read more </a></p>',
                        '</div>',
                    '</div>',
                '</div>',
            '</tpl>',
            this,
            {   isRecActive: function(values) {
                    var record = this._getRecordFromUuid(values.uuid);
                    return (Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(record))
                }
            }
        )


        var config = {
            title: false,

            items: new Ext.DataView({
                autoScroll: true,
                autoWidth: true,
                store: this.store,
                tpl: tpl,
                multiSelect: true,
                listeners: {
                    click: {
                        fn: this.onClick,
                        scope: this
                    }
                },
                onClick: function(event, item, options) {
                    if (item.className === "x-btn x-btn-text") {
                        // a better way to do this?
                        this.findParentByType(Ext.Panel)._viewButtonOnClick(item.id);
                        Ext.get(item.id).addClass("x-btn-selected");
                        Ext.get(item.id).update("Selected >");
                    }
                }
            })
        };


        Ext.apply(this, config);

        Portal.search.FacetedSearchResults.superclass.initComponent.apply(this, arguments);

        this.store.on('load', function() {
            this._onStoreLoad();
        }, this);

        this._subscribeToActiveGeoNetworkRecordStoreEvents();
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


    _viewButtonOnClick: function(identifier) {

        var uuid = identifier.replace("fsSearchAddBtn",'');
        var record = this._getRecordFromUuid(uuid);

        if (!Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(record)) {
            Portal.data.ActiveGeoNetworkRecordStore.instance().add(record);
        }

        Ext.MsgBus.publish('viewgeonetworkrecord', record);
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
/*
        this.getBottomToolbar().onLoad(
            this.store,
            null,
            {
                params: {
                    start: this.store.startRecord,
                    limit: 10
                }
            }
        );*/
    }
});

Ext.reg('portal.search.facetedsearchresultsgrid', Portal.search.FacetedSearchResults);
