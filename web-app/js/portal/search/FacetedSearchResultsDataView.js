/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsDataView = Ext.extend(Ext.DataView, {

    MINIMAP_HEIGHT: 90,
    MINIMAP_WIDTH: 160, // 16:9 ratio http://size43.com/jqueryVideoTool.html
    MINIMAP_PADDING: 4,
    MAP_ID_PREFIX: "facetedSearchMap",

    DATE_FACET_INPUT_FORMAT: 'YYYY-MM-DDtHH:mm:ss:SSSz',

    initComponent: function() {

        this.rowId = 0;

        this.setTplSizeVariables();

        var tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="resultsHeaderBackground">',
            '    <div class="x-panel-header">',
            '        <div class="resultsRowHeaderTitle"><h3>{[this.getTitle(values)]}</h3></div>',
            '        <div class="facetedSearchBtn" id="fsSearchAddBtn{[this.encode(values)]}">',
            '            {[this.getButton(values)]}',
            '        </div>',
            '    </div>',
            '    <div class="x-panel-body x-box-layout-ct facetedSearchResultBody" style="height:{[this.resultBodyHeight]}px;">',
            '         <div class="x-panel x-box-item miniMap {[this.getStatusClasses(values)]}" title="{[this.getMiniMapLinkTitle(values)]}"',
            '            style="height:{[this.MINIMAP_HEIGHT]}px;width:{[this.MINIMAP_WIDTH]}px;margin:{[this.MINIMAP_PADDING]}px! important"',
            '            id="{[this.MAP_ID_PREFIX]}{[this.encode(values)]}">',
            '            {[this.getMiniMap(values)]}',
            '        </div>' +
            '        <div class="x-panel x-box-item resultsTextBody {[this.getStatusClasses(values)]}" style="left:{[this.textBodyLeftMargin]}px; ">',
            '            <h5 class="resultsTextBody"><i>',
            '                {[values.title]}',
            '                &nbsp;{[this.getGeoNetworkRecordPointOfTruthLinkAsHtml(values)]}',
            '            </i></h5>',
            '            {[this.getParametersAsHtml(values)]}',
            '        </div>',
            '    </div>',
            '</div>',
            '</tpl>',
            this,
            {
                getButton: function(values) {
                    this.createButton.defer(1, this, [values.uuid, values.storeRowIndex]);
                    return "";
                },
                encode: function(values) {
                    return this.superEncodeUuid(values.storeRowIndex, values.uuid);
                },
                getStatusClasses: function(values) {
                    return (this.isRecActive(values.uuid)) ? "x-item-disabled" : "";
                },
                getMiniMapLinkTitle: function(values) {
                    return (this.isRecActive(values.uuid)) ? OpenLayers.i18n('collectionExistsMsg') : OpenLayers.i18n("addDataCollectionMsg");
                },
                getTitle: function(values) {
                    var broader = [];  
                    Ext.each(values.parameter, function(param) {
                        var broaderTerms = this.classificationStore.getBroaderTerms(param, 2, 'Measured parameter');
                        if(broaderTerms.length > 0) { 
                            broader = broader.concat(broaderTerms); 
                        }
                    }, this);
                    broader = broader.sort();
                    return broader.filter( function(item, pos) {
                        return !pos || item != broader[pos - 1];
                    }).join( ', ');
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

    setTplSizeVariables: function() {
        this.resultBodyHeight = this.MINIMAP_HEIGHT + (2 * this.MINIMAP_PADDING) + 2;
        this.textBodyLeftMargin = this.MINIMAP_WIDTH + (2 * this.MINIMAP_PADDING);
    },

    addMinimapLink: function(storeRowIndex, uuid) {

        var that = this;
        var selector = '#' + this.getUniqueId(storeRowIndex, uuid);
        jQuery(selector).live("click", that, function() {
            var superUuid = jQuery(this).attr('id').replace(this.MAP_ID_PREFIX, '');
            that.addRecordFromSuperUuid(superUuid);
            jQuery(this).addClass("x-item-disabled");
            return false;
        });
    },

    collectData: function(records, startIndex) {
        var r = [];

        for (var i = 0; i < records.length; i++) {
            var newRecord = this.prepareData(records[i].data, startIndex + i, records[i]);
            newRecord = this._addStoreRowCount(newRecord);
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
            '   <span> {value}</span>',
            '</div>'
        );
        var html = "";

        html += this._getOrganisationAsHtml(paramTpl, values.organisation);
        html += this._getPlatformAsHtml(paramTpl, values.platform);
        html += this._getTemporalExtentAsHtml(paramTpl, {
            begin: values.temporalExtentBegin,
            end: values.temporalExtentEnd
        });

        return html;
    },

    _getOrganisationAsHtml: function(template, organisation) {
        var label = this._buildLabel("fa-institution", OpenLayers.i18n('searchOrganisationText'));
        if (organisation) {
            return template.apply({
                "label": label,
                "value": organisation.join(', ')
            });
        }
        return "";
    },

    _getPlatformAsHtml: function(template, platform) {

        var label = this._buildLabel("fa-tags", OpenLayers.i18n('searchPlatformText'));

        var broader = this.classificationStore.getBroaderTerms(platform, 1, 'Platform');	
        if(broader.length > 0) { 
            broader = broader.sort();
            broader = broader.filter( function(item, pos) {
                return !pos || item != broader[pos - 1];
            });
            return template.apply({
                "label": label,
                "value": broader.join( ', ')
            });
        }
        return "";
    },

    _getTemporalExtentAsHtml: function(template, temporalExtent) {
        var label = this._buildLabel("fa-calendar", OpenLayers.i18n('searchDateText'));
        if (temporalExtent.begin && temporalExtent.end) {
            return template.apply({
                "label": label,
                "value": String.format(
                    "{0} - {1}",
                    this._formatTemporalExtentDateString(temporalExtent.begin),
                    this._formatTemporalExtentDateString(temporalExtent.end)
                )
            });
        }
        return "";
    },

    _buildLabel: function(fontAwesomeClass, text) {
        return "<span class=\"fa fa-fw " + fontAwesomeClass + "\"></span> " + text;
    },

    _formatTemporalExtentDateString: function(dateString) {
        var dateFormat = OpenLayers.i18n('temporalExtentDateFormat');
        return this._parseTemporalExtentDateString(dateString).format(dateFormat);
    },

    _parseTemporalExtentDateString: function(dateString) {
        return moment(dateString, this.DATE_FACET_INPUT_FORMAT);
    },

    createButton: function(uuid, storeRowIndex) {
        var cls = "";
        var tooltip = OpenLayers.i18n('collectionExistsMsg');

        if (this.isRecActive(uuid)) {
            cls = "x-btn-selected";
        }
        else {
            tooltip = OpenLayers.i18n('addDataCollectionMsg');
        }

        var buttonElementId = "fsSearchAddBtn" + this.superEncodeUuid(storeRowIndex, uuid);

        if (Ext.get(buttonElementId)) {
            new Ext.Button({
                text: OpenLayers.i18n('navigationButtonSelect'),
                tooltip: tooltip,
                tooltipType: "title",
                cls: "navigationButton forwardsButton listButtonWrapper " + cls,
                width: 100,
                scope: this,
                renderTo: buttonElementId,
                listeners: {
                    click: {
                        fn: this._viewButtonOnClick,
                        scope: this
                    }
                }
            });
        }
    },

    getGeoNetworkRecordPointOfTruthLinkAsHtml: function(values) {
        var html;

        if (values.pointOfTruthLink) {

            var trackUsageText = String.format(OpenLayers.i18n('onClickTrackUsageFunction'),
                OpenLayers.i18n('metadataTrackingCategory'),
                OpenLayers.i18n('metadataTrackingStep1Action'),
                cleanStringForFunctionParameter(values.title));

            html = String.format('<a href="{0}" target="_blank" class="nowrap" title="{1}" {2} >{3}</a>',
                values.pointOfTruthLink.href,
                values.pointOfTruthLink.title,
                trackUsageText,
                OpenLayers.i18n('metadataLink'));
        }

        return html;
    },

    getMiniMap: function(values) {

        values.mapContainerId = this.getUniqueId(values.storeRowIndex, values.uuid);

        var miniMap = new Portal.search.FacetedSearchResultsMiniMap(values);
        miniMap.addLayersAndRender();

        this.addMinimapLink(values.storeRowIndex, values.uuid);

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

    getUniqueId: function(storeRowIndex, uuid) {
        return  this.MAP_ID_PREFIX + this.superEncodeUuid(storeRowIndex, uuid);
    },

    // uuid alone is unique unless search results have duplicates
    superEncodeUuid: function(storeRowIndex, uuid) {
        return "-" + storeRowIndex + "-" + uuid;
    },

    decodeSuperUuid: function(encodedUuid) {
        var chunks = encodedUuid.split("-");
        chunks.splice(0, 2);
        return chunks.join("-");
    },

    _viewButtonOnClick: function(btn) {

        btn.addClass("x-btn-selected");
        var superUuid = btn.container.id.replace("fsSearchAddBtn", '');
        this.addRecordFromSuperUuid(superUuid);
    },

    addRecordFromSuperUuid: function(superUuid) {
        var uuid = this.decodeSuperUuid(superUuid);
        var record = this._getRecordFromUuid(uuid);

        trackUsage(OpenLayers.i18n('layerSelectionTrackingCategory'), OpenLayers.i18n('layerSelectionTrackingAction'), record.data.title);

        if (!Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(record)) {
            log.info(
                "Selected collection: " + JSON.stringify({
                    'title': record.data.title
                })
            );
            Portal.data.ActiveGeoNetworkRecordStore.instance().add(record);
        }
        Ext.MsgBus.publish(PORTAL_EVENTS.VIEW_GEONETWORK_RECORD, record);
    }
});

Ext.reg('portal.search.facetedsearchresultsdataview', Portal.search.FacetedSearchResultsDataView);
