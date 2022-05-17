Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsDataView = Ext.extend(Ext.DataView, {

    MINIMAP_HEIGHT: 90,
    MINIMAP_WIDTH: 160, // 16:9 ratio http://size43.com/jqueryVideoTool.html
    ICON_MAX_SIZE: 50,
    MINIMAP_PADDING: 4,
    MAP_ID_PREFIX: "facetedSearchMap",
    ADD_BUTTON_PREFIX: "fsSearchAddBtn",
    CLICKABLE_PARAMETERS_PREFIX: "FacetedSearchResultParameters",
    CSS_CLASS_ITEM_DISABLED: 'x-item-disabled',
    CSS_CLASS_BUTTON_SELECTED: 'x-btn-selected',

    DATE_FACET_INPUT_FORMAT: 'YYYY-MM-DDtHH:mm:ss:SSSz',
    paramTpl: new Ext.Template(
        '<div class="facetedSearchMapParamTpl {classes}">',
        '   <div class="x-panel-header">{label}</div>',
        '   <div class="results"> {value}</div>',
        '</div>'
    ),

initComponent: function() {

        this.tpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="resultsHeaderBackground expandable">',
            '    <div class="x-panel-header">',
            '        <div class="resultsRowHeaderTitle">',
            '            {[this.getHtmlTitle(values)]}',
            '        </div>',
            '        <div class="facetedSearchBtn" id="{[this.buttonElementId(values.uuid)]}">',
            '            {[this.getButton(values)]}',
            '        </div>',
            '    </div>',
            '    <div class="x-panel-body facetedSearchResultBody" style="height: 100px;">',
            '         <div class="x-panel miniMap {[this.getStatusClasses(values)]}" title="{[this.getMiniMapLinkTitle(values)]}"',
            '            style="height:{[this.MINIMAP_HEIGHT]}px;width:{[this.MINIMAP_WIDTH]}px;margin:{[this.MINIMAP_PADDING]}px! important"',
            '            id="{[this.mapElementId(values.uuid)]}">',
            '        </div>',
            '        <div class="x-panel resultsTextBody {[this.getStatusClasses(values)]}">',
            '            <span class="floatRight x-hyperlink small">{[this.getMetadataRecordPointOfTruthLinkAsHtml(values)]}',
            '            </span><span id="{[this.parametersElementId(values.uuid)]}">',
            '            {[this.getParametersAsHtml(values)]}</span>',
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
                getParametersAsHtml: function(values) {
                    this.setParametersAsHtml.defer(1, this, [values]);
                    return "";
                },
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
                    return Ext.ux.Ajax.constructProxyUrl(this.getGeonetworkImageUrl(values.iconSourceUuid, values.iconSourceCategory));
                },
                getHtmlTitle: function(values) {
                    var title = values.title;
                    return String.format("<h3 title=\"Click to display the abstract for this collection\">{1}</h3>", title, Ext.util.Format.ellipsis(title, 180, true));
                }
            }
        );

        Portal.search.FacetedSearchResultsDataView.superclass.initComponent.apply(this, arguments);
    },

    activateParametersLink: function() {

        var selector = '.facetSearchHyperLink';
        var that = this;
        jQuery(selector).off();
        jQuery(selector).on("click",
            function() {
                that.searcher.addFilter("facet.q", jQuery(this).attr("data"));
                that.searcher.search();
                trackFacetUsage(OpenLayers.i18n("keyword"), jQuery(this).text());
            });
    },

    getTrackingFunction: function(values) {
        var url = this.getGeonetworkImageUrl(values.iconSourceUuid, values.iconSourceCategory);
        return String.format("trackNavigationUsage('navigationTrackingIconAction', '{0}');return true;", url);
    },

    getGeonetworkImageUrl: function(iconSourceUuid, iconSourceCategory) {
        // If there is a category definition of the icon source then get icon from S3 bucket otherwise
        // default to use the uuid on Geonetwork store
        if(iconSourceCategory != null){
            return Portal.app.appConfig.geonetwork.imageBucket + iconSourceCategory + "_logo.gif";
        } else {
            return Portal.app.appConfig.geonetwork.url + '/images/logos/' + iconSourceUuid + ".gif";
        }
    },

    refresh: function(options) {

        if (options) {
            Portal.search.FacetedSearchResultsDataView.superclass.refresh.call(this, {add:true});
            this.store.each(function(record) {
                this.getMiniMap(record.data);
            }, this);
        }
        else {
            this.appendTpl();
        }
    },

    appendTpl: function() {

        this.clearSelections(false, true);
        var el = this.getTemplateTarget();

        var facetedSearchResultBodyCount = jQuery('.facetedSearchResultBody').length;
        var records = this.store.getRange(facetedSearchResultBodyCount);

        this.tpl.append(el, this.collectData(records, facetedSearchResultBodyCount));
        this.all.fill(Ext.query(this.itemSelector, el.dom));
        this.updateIndexes(0);

        this.store.each(function(record) {
            this.getMiniMap(record.data);
        }, this);
    },

    getMiniMap: function(values) {

        values.mapContainerId = this.mapElementId(values.uuid);

        // remove any existing content fixes #1757
        clearContents("#" + values.mapContainerId);

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
        jQuery(selector).off();
        jQuery(selector).on("click", that, function(clickEvent) {

            var multiSelect = clickEvent.ctrlKey;
            var uuid = that.uuidFromElementId(jQuery(this).attr('id'));
            that.addRecordWithUuid(uuid, multiSelect);

            jQuery(this).addClass(this.CSS_CLASS_ITEM_DISABLED);

            return false;
        });
    },

    setParametersAsHtml: function(values) {
        var html = "";
        html += this._getAbstract(values);
        html += this._getMeasuredParametersAsHtml(values);
        html += this._getTemporalExtentAsHtml({
            begin: values.temporalExtentBegin,
            end: values.temporalExtentEnd
        });
        html += this._getOrganisationAsHtml(values.organisation);
        html += this._getPlatformAsHtml(values.platform);

        var parametersElementId = this.parametersElementId(values.uuid);

        if (Ext.get(parametersElementId)) {
            new Ext.Container({
                html: html,
                scope: this,
                renderTo: parametersElementId,
                listeners: {
                    afterrender: {
                        fn: this.activateParametersLink,
                        scope: this
                    }
                }
            });
        }
    },

    _getAbstract: function(values) {
        var label = this._buildLabel("fa-info-circle", "Abstract from metadata");
        if (values.abstract) {
            return this.paramTpl.apply({
                "label": label,
                "classes": "abstractContainer hidden",
                "value": values.abstract
            });
        }
        return "";
    },

    _getMeasuredParametersAsHtml: function(values) {
        var label = this._buildLabel("fa-cog", OpenLayers.i18n('searchParametersText'));
        if (values.parameter) {
            return this.paramTpl.apply({
                "label": label,
                "value": this._getMeasuredParametersText(values)
            });
        }
        return "";
    },

    _getMeasuredParametersText: function(values) {

        var termType = 'parameterCategories'
        var params = this._getBroaderTerms(values.parameter, 2 ,termType);

        if (params.length > 0) {
            return this._getFacetSearchLinks(termType, params);
        }
        else {
            return OpenLayers.i18n('noParametersForCollection');
        }
    },

    _getBroaderTerms: function(values, depth, type) {
        var broader = [];
        Ext.each(values, function(param) {
            var broaderTerms = this.classificationStore.getBroaderTerms(param, depth, type);
            if (broaderTerms.length > 0) {
                broader = broader.concat(broaderTerms);
            }
        }, this);
        broader = broader.sort();
        return broader.filter(function(item, pos) {
            return !pos || item != broader[pos - 1];
        });
    },

    _getOrganisationAsHtml: function(organisation) {
        var label = this._buildLabel("fa-institution", OpenLayers.i18n('searchOrganisationText'));

        if (organisation) {
            return this.paramTpl.apply({
                "label": label,
                "value": this._getFacetSearchLinks('orgUnitCategories', organisation)
            });
        }
        return "";
    },

    _getPlatformAsHtml: function(platforms) {

        var label = this._buildLabel("fa-tags", OpenLayers.i18n('searchPlatformText'));
        var broaderPlatforms = this._getBroaderTerms(platforms, 1,termType);

        if (broaderPlatforms.length > 0) {
            return this.paramTpl.apply({
                "label": label,
                "value": this._getFacetSearchLinks('platformCategories', broaderPlatforms)
            });
        }
        return "";
    },

    _getFacetSearchLinks: function(category, facetItems) {

        var html = [];
        Ext.each(facetItems, function(term) {
            var searchPath = this._getFacetParentPath(category, term);
            html.push( String.format('<span class="facetSearchHyperLink" data="{0}" title="Filter on this facet: {0}">{1}</span>', searchPath, term));
        },this);
        return html.join("-");
    },

    _getFacetParentPath: function(category,  term) {

        var path = [term];
        var currentTerm = term;
        while (currentTerm) {
            currentTerm = this.classificationStore.getBroaderTerms(currentTerm, 1, category)[0];
            path.push((currentTerm) ? currentTerm : category);
        }
        return path.reverse().filter(Boolean).join("/");
    },

    _getTemporalExtentAsHtml: function(temporalExtent) {
        var label = this._buildLabel("fa-calendar", OpenLayers.i18n('searchDateText'));
        if (temporalExtent.begin || temporalExtent.end) {
            return this.paramTpl.apply({
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

    _buildLabel: function(fontAwesomeClass, hint) {
        return String.format("<span class=\"fa fa-fw {0}\" title=\"{1}\"></span> ",fontAwesomeClass, hint) ;
    },

    _formatTemporalExtentDateString: function(dateString) {
        if (dateString) {
            var dateFormat = OpenLayers.i18n('temporalExtentDateFormat');
            return this._parseTemporalExtentDateString(dateString).format(dateFormat);
        } else {
            return moment().format("YYYY");
        }
    },

    _parseTemporalExtentDateString: function(dateString) {
        return moment(dateString, this.DATE_FACET_INPUT_FORMAT);
    },

    createButton: function(uuid) {
        var cls = "";
        var tooltip = OpenLayers.i18n('collectionExistsMsg');
        var label;

        if (this.isRecActive(uuid)) {
            cls = this.CSS_CLASS_BUTTON_SELECTED;
            label = "Selected";
        }
        else {
            tooltip = OpenLayers.i18n('addDataCollectionMsg');
            label = "Select";
        }

        var buttonElementId = this.buttonElementId(uuid);

        // remove any existing content fixes #1757
        clearContents("#" + buttonElementId);

        if (Ext.get(buttonElementId)) {
            new Ext.Button({
                text: OpenLayers.i18n('navigationButtonNext', {label: label}),
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

    parametersElementId: function(uuid) {
        return this.elementIdFromUuid(this.CLICKABLE_PARAMETERS_PREFIX, uuid);
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

        // Updating the popularity counter of the metadata record at GeoNetwork
        Ext.ux.Ajax.proxyRequestXML({
            url: Portal.app.appConfig.geonetwork.url + '/srv/eng/portal.get?uuid=' + uuid
        });
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
