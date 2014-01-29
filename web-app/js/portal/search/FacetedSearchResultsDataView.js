/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsDataView = Ext.extend(Ext.DataView, {

    initComponent:function () {

        this.rowId = 0;

        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div>',
            '   <div class="x-panel-header resultsHeaderBackground">',
            '       <h3 class="resultsRowHeader">{title}</h3>',
            '       <div class="facetedSearchBtn" id="fsSearchAddBtn-{storeRowIndex}-{uuid}">',
            '           {[this.getButton(values)]}',
            '       </div>',
            '   </div>',
            '   <div class="x-panel-body x-box-layout-ct facetedSearchResultBody" style="height:120px;">',
            '       <div class="miniMap x-panel x-box-item"',
            '            id="fsSearchMap-{storeRowIndex}-{uuid}">',
            '           {[this.getMiniMap(values)]}',
            '       </div>',
            '       <div class="x-panel x-box-item resultsTextBody" style="left:240px; ">',
            '           {[this.getParametersAsHtml(values)]}',
            '           <p class="resultsTextBody">',
            '               <i>',
            '                   {[this.trimAbstract(values.abstract,30)]}',
            '               </i>',
            '               &nbsp;{[this.getGeoNetworkRecordPointOfTruthLinkAsHtml(values)]}',
            '           </p>',
            '       </div>',
            '   </div>',
            '</div>',
            '</tpl>',
            this,
            {
                getButton: function(values) {
                    this.createButton.defer(1, this, [values.uuid, values.storeRowIndex]);
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

    collectData : function(records, startIndex){
        var r = [],
            i = 0,
            len = records.length;
        for(; i < len; i++){
            var newRecord = this.prepareData(records[i].data, startIndex + i, records[i]);
            newRecord =  this._addStoreRowCount(newRecord);
            r[r.length] = newRecord;
        }
        return r;
    },

    _addStoreRowCount: function(record) {
        record['storeRowIndex'] = this.rowId;
        this.rowId++;
        return record;
    },

    getParametersAsHtml: function(values) {
        var paramTpl = new Ext.Template(
            '<div><span class="x-panel-header">{label}</span>',
            '   <span>- {value}</span>',
            '</div>'
        );
        var html= "";

        html += this._getOrganisationAsHtml(paramTpl, values.organisation);
        html += this._getPlatformAsHtml(paramTpl, values.platform);
        html += this._getTemporalExtentAsHtml(paramTpl, {
            begin: values.temporalExtentBegin,
            end: values.temporalExtentEnd
        });
        html += this._getParametersAsHtml(paramTpl, values.parameter);

        return html;
    },

    _getOrganisationAsHtml: function(template, organisation) {
        if (organisation) {
            return template.apply({
                "label": OpenLayers.i18n('organisation'),
                "value": organisation
            });
        }

        return "";
    },

    _getPlatformAsHtml: function(template, platform) {
        if (platform) {
            return template.apply({
                "label": OpenLayers.i18n('platform'),
                "value": platform
            });
        }

        return "";
    },

    _getTemporalExtentAsHtml: function(template, temporalExtent) {
        if (temporalExtent.begin && temporalExtent.end) {
            return template.apply({
                "label": OpenLayers.i18n('dateRange'),
                "value": String.format(
                    "{0} - {1}",
                    this._formatTemporalExtentDateString(temporalExtent.begin),
                    this._formatTemporalExtentDateString(temporalExtent.end)
                )
            });
        }

        return "";
    },

    _formatTemporalExtentDateString: function(dateString) {
        return this._parseTemporalExtentDateString(dateString).format("YYYY-MM-DD Z");
    },
    
    _parseTemporalExtentDateString: function(dateString) {
        return moment(dateString, "YYYY-MM-DDtHH:mm:ss:SSSz");
    },

    _getParametersAsHtml: function(template, parameters) {
        if (parameters.length > 0) {
            return template.apply({
                "label": OpenLayers.i18n('parameters'),
                "value": parameters.join(" - ")
            });
        }

        return "";
    },

    createButton: function(uuid, storeRowIndex) {
        var cls = "";
        if (this.isRecActive(uuid)) {
            cls = "x-btn-selected";
        }

        new Ext.Button({
            text: OpenLayers.i18n('navigationButtonSelect'),
            cls: "navigationButton forwardsButton " + cls,
            width: 100,
            scope: this,
            renderTo: "fsSearchAddBtn-" + storeRowIndex + "-" + uuid,
            listeners: {
                click: {
                    fn: this._viewButtonOnClick,
                    scope: this
                }
            }
        });
    },

    getGeoNetworkRecordPointOfTruthLinkAsHtml: function(values) {
        return '<a href="' + values.pointOfTruthLink.href + '" target="_blank" class="nowrap" title="'
            + values.pointOfTruthLink.title + '">more</a>';
    },

    getMiniMap: function(values) {
        var miniMap = new Portal.search.FacetedSearchResultsMiniMap(values);
        miniMap.addLayersAndRender();

        // Must return something, otherwise 'undefined' is rendered in the mini map div in some browsers,
        // e.g. firefox (but not chrome).
        return '';
    },

    isRecActive: function(uuid) {
        var record = this._getRecordFromUuid(uuid);
        return (Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(record))
    },

    _getRecordFromUuid: function(uuid) {
        var record;
        this.store.each(function(rec) {
            if (rec.data.uuid == uuid) {
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
        Ext.MsgBus.publish(PORTAL_EVENTS.VIEW_GEONETWORK_RECORD, record);
    }
});

Ext.reg('portal.search.facetedsearchresultsdataview', Portal.search.FacetedSearchResultsDataView);
