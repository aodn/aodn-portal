Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsDataView = Ext.extend(Ext.DataView, {

    MINIMAP_HEIGHT: 90,
    MINIMAP_WIDTH: 160, // 16:9 ratio http://size43.com/jqueryVideoTool.html
    ICON_MAX_SIZE: 50,
    MINIMAP_PADDING: 4,
    MAP_ID_PREFIX: "facetedSearchMap",
    ADD_BUTTON_PREFIX: "fsSearchAddBtn",
    CSS_CLASS_ITEM_DISABLED: 'x-item-disabled',
    CSS_CLASS_BUTTON_SELECTED: 'x-btn-selected',

    DATE_FACET_INPUT_FORMAT: 'YYYY-MM-DDtHH:mm:ss:SSSz',

    initComponent: function() {

        this.tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="resultsHeaderBackground">',
            '    <div class="x-panel-header">',
            '        <div class="resultsRowHeaderTitle">',
            '            <h3>{[values.title]}</h3>',
            '        </div>',
            '        <div class="facetedSearchBtn" id="{[this.buttonElementId(values.uuid)]}">',
            '            {[this.getButton(values)]}',
            '        </div>',
            '    </div>',
            '    <div class="x-panel-body facetedSearchResultBody">',
            '         <div class="x-panel miniMap {[this.getStatusClasses(values)]}" title="{[this.getMiniMapLinkTitle(values)]}"',
            '            style="height:{[this.MINIMAP_HEIGHT]}px;width:{[this.MINIMAP_WIDTH]}px;margin:{[this.MINIMAP_PADDING]}px! important"',
            '            id="{[this.mapElementId(values.uuid)]}">',
            '        </div>',
            '        <div class="x-panel resultsTextBody {[this.getStatusClasses(values)]}">',
            '            <span class="floatRight x-hyperlink small">{[this.getMetadataRecordPointOfTruthLinkAsHtml(values)]}',
            '            </span>',
            '            {[this.getParametersAsHtml(values)]}',
            '        </div>',
            '        <div class="resultsIconContainer">',
            '            <img src="{[this.getIconUrl(values)]}" onClick="{[this.getTrackingFunction(values)]}" style="max-height: ' + this.ICON_MAX_SIZE +
            '; max-width: '+ this.ICON_MAX_SIZE +'" alt="Icon of metadata record holder" />',
            '        </div>',
            '    </div>',
            '</div>',
            '</tpl>',
            this,
            {
                getButton: function(values) {
                    this.createButton.defer(1, this, [values.uuid]);
                    return "";
                },
                getStatusClasses: function(values) {
                    return (this.isRecActive(values.uuid)) ? this.CSS_CLASS_ITEM_DISABLED : "";
                },
                getMiniMapLinkTitle: function(values) {
                    return (this.isRecActive(values.uuid)) ? OpenLayers.i18n('collectionExistsMsg') : OpenLayers.i18n("addDataCollectionMsg");
                },
                getIconUrl: function(values) {
                    return Ext.ux.Ajax.constructProxyUrl(this.getGeonetworkImageUrl(values.iconSourceUuid));
                }
            }
        );

        Portal.search.FacetedSearchResultsDataView.superclass.initComponent.apply(this, arguments);
    },

    getTrackingFunction: function(values) {
        var url = this.getGeonetworkImageUrl(values.iconSourceUuid);
        return String.format("trackNavigationUsage('navigationTrackingIconAction', '{0}');return true;", url);
    },

    getGeonetworkImageUrl: function(iconSourceUuid) {
        return Portal.app.appConfig.geonetwork.url + '/images/logos/' + iconSourceUuid + ".gif";
    },

    refresh: function() {
        Portal.search.FacetedSearchResultsDataView.superclass.refresh.call(this, arguments);

        this.store.each(function(record) {
            this.getMiniMap(record.data);
        }, this);
    },

    getMiniMap: function(values) {

        values.mapContainerId = this.mapElementId(values.uuid);

        // remove any existing content fixes #1757
        clearContents(values.mapContainerId);

        var miniMap = new Portal.search.FacetedSearchResultsMiniMap(values);
        miniMap.addLayersAndRender();

        this.addMinimapLink(values.uuid);

        // Must return something, otherwise 'undefined' is rendered in the mini map div in some browsers,
        // e.g. firefox (but not chrome).
        return '';
    },

    addMinimapLink: function(uuid) {

        var that = this;
        var selector = '#' + this.mapElementId(uuid);
        jQuery(selector).die();
        jQuery(selector).live("click", that, function(clickEvent) {

            var multiSelect = clickEvent.ctrlKey;
            var uuid = that.uuidFromElementId(jQuery(this).attr('id'));
            that.addRecordWithUuid(uuid, multiSelect);

            jQuery(this).addClass(this.CSS_CLASS_ITEM_DISABLED);

            return false;
        });
    },

    getParametersAsHtml: function(values) {
        var paramTpl = new Ext.Template(
            '<div><span class="x-panel-header">{label}</span>',
            '   <span> {value}</span>',
            '</div>'
        );
        var html = "";

        html += this._getMeasuredParametersAsHtml(paramTpl, values);
        html += this._getOrganisationAsHtml(paramTpl, values.organisation);
        html += this._getPlatformAsHtml(paramTpl, values.platform);
        html += this._getTemporalExtentAsHtml(paramTpl, {
            begin: values.temporalExtentBegin,
            end: values.temporalExtentEnd
        });

        return html;
    },

    _getMeasuredParametersAsHtml: function(template, values) {
        var label = this._buildLabel("fa-cog", OpenLayers.i18n('searchParametersText'));
        if (values.parameter) {
            return template.apply({
                "label": label,
                "value": this._getMeasuredParametersText(values)
            });
        }
        return "";
    },

    _getMeasuredParametersText: function(values) {
        var params = this._getMeasuredParameters(values);

        if (params.length > 0) {
            return params.join(', ');
        }
        else {
            return OpenLayers.i18n('noParametersForCollection');
        }
    },

    _getMeasuredParameters: function(values) {
        var broader = [];
        Ext.each(values.parameter, function(param) {
            var broaderTerms = this.classificationStore.getBroaderTerms(param, 2, 'Measured parameter');
            if (broaderTerms.length > 0) {
                broader = broader.concat(broaderTerms);
            }
        }, this);
        broader = broader.sort();
        return broader.filter(function(item, pos) {
            return !pos || item != broader[pos - 1];
        });
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
        if (broader.length > 0) {
            broader = broader.sort();
            broader = broader.filter(function(item, pos) {
                return !pos || item != broader[pos - 1];
            });
            return template.apply({
                "label": label,
                "value": broader.join(', ')
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

    createButton: function(uuid) {
        var cls = "";
        var tooltip = OpenLayers.i18n('collectionExistsMsg');

        if (this.isRecActive(uuid)) {
            cls = this.CSS_CLASS_BUTTON_SELECTED;
        }
        else {
            tooltip = OpenLayers.i18n('addDataCollectionMsg');
        }

        var buttonElementId = this.buttonElementId(uuid);

        // remove any existing content fixes #1757
        clearContents("#" + buttonElementId);

        if (Ext.get(buttonElementId)) {
            new Ext.Button({
                text: OpenLayers.i18n('navigationButtonNext', {label: "Select"}),
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

    getMetadataRecordPointOfTruthLinkAsHtml: function(values) {
        var html;

        if (values.pointOfTruthLink) {

            var trackUsageText = String.format(OpenLayers.i18n('onClickTrackUsageFunction'),
                OpenLayers.i18n('metadataTrackingCategory'),
                OpenLayers.i18n('metadataTrackingStep1Action'),
                cleanStringForFunctionParameter(values.title));

            html = String.format('<a href="{0}" class="external" target="_blank" class="nowrap " title="{1}" {2} >{3}</a>',
                values.pointOfTruthLink.href,
                values.pointOfTruthLink.title,
                trackUsageText,
                OpenLayers.i18n('metadataLink'));
        }

        return html;
    },

    isRecActive: function(uuid) {
        return this.dataCollectionStore.getByUuid(uuid);
    },

    mapElementId: function(uuid) {
        return this.elementIdFromUuid(this.MAP_ID_PREFIX, uuid);
    },

    buttonElementId: function(uuid) {
        return this.elementIdFromUuid(this.ADD_BUTTON_PREFIX, uuid);
    },

    elementIdFromUuid: function(prefix, uuid) {
        return String.format('{0}-{1}', prefix, uuid);
    },

    uuidFromElementId: function(elementId) {
        var chunks = elementId.split("-");
        chunks.splice(0, 1);
        return chunks.join("-");
    },

    _viewButtonOnClick: function(btn, clickEvent) {

        var multiSelect = clickEvent.ctrlKey;
        var uuid = this.uuidFromElementId(btn.container.id);
        this.addRecordWithUuid(uuid, multiSelect);

        btn.addClass(this.CSS_CLASS_BUTTON_SELECTED);
    },

    addRecordWithUuid: function(uuid, multiSelect) {
        var record = this.store.getByUuid(uuid);

        trackDataCollectionSelectionUsage('dataCollectionSelectionTrackingAction', record.get('title'));

        if (!this.isRecActive(uuid)) {

            this.dataCollectionStore.add(
                Portal.data.DataCollection.fromMetadataRecord(record)
            );
        }

        if (!multiSelect) {
            viewport.setActiveTab(TAB_INDEX_VISUALISE);
        }
    }
});

Ext.reg('portal.search.facetedsearchresultsdataview', Portal.search.FacetedSearchResultsDataView);
