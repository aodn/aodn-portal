Ext.namespace('Portal.search.filter');

Portal.search.filter.getDefaultFilters = function() {

    var filters = [];

    filters.push( Portal.search.filter._freetextFilterConfig() );

    if ( Portal.app.config.searchUsingBboxByDefault )
        filters.push( Portal.search.filter._boundingBoxFilterConfig() );

    return filters;
 };

Portal.search.filter.newDefaultActiveFilterStore = function()
{
	return new Portal.search.filter.FilterStore({
		data: this.getDefaultFilters()
	});
};

/**
 * Convenience method for instantiating a new FilterStore with all the default optional parameters.
 * 
 * @returns {Portal.search.filter.FilterStore}
 */
Portal.search.filter.newDefaultInactiveFilterStore = function()
{
    var filters = [];

    filters.push( this._mapLayersFilterConfig() );
    filters.push( this._dateRangeFilterConfig() );

    if ( !Portal.app.config.searchUsingBboxByDefault )
        filters.push( this._boundingBoxFilterConfig() );

    filters.push( this._keywordFilterConfig() );
    filters.push( this._parameterFilterConfig() );
    filters.push( this._organisationFilterConfig() );
    filters.push( this._downloadsFilterConfig() );
    filters.push( this._exactMatchFilterConfig() );

	return new Portal.search.filter.FilterStore({ data: filters });
};

Portal.search.filter.FilterStore = Ext.extend(Ext.data.ArrayStore, {

	constructor : function(cfg) 
	{
		cfg = cfg || {};

        var config = Ext.apply(
		{
			id : 0,
			
			fields : [ 'sortOrder', 'type', 'displayText', 'componentConfig', 'fixed', 'defaultFilter', 'asJson', 'filterValue' ]
		}, cfg);

        Portal.search.filter.FilterStore.superclass.constructor.call(this, config);
	}
});

Portal.search.filter._freetextFilterConfig = function () {

    return [
        1,
        'portal.search.field.freetext',
        null,
        {
            xtype : 'portal.search.field.freetext',
            anchor: '100%'
        },
        true
    ];
};

Portal.search.filter._mapLayersFilterConfig = function () {

    return [
        2,
        'combo',
        OpenLayers.i18n("mapLayersOnly"),
        {
            xtype: 'portal.search.field.maplayers'
        },
        false
    ];
};

Portal.search.filter._dateRangeFilterConfig = function () {

    return [
        3,
        'portal.search.field.daterange',
        OpenLayers.i18n("dateRange"),
        {
            xtype : 'portal.search.field.daterange'
        },
        false
    ];
};

Portal.search.filter._boundingBoxFilterConfig = function () {

    return [
        4,
        'portal.search.field.boundingbox',
        OpenLayers.i18n("boundingBox"),
        {
            xtype : 'portal.search.field.boundingbox'
        },
        false
    ];
};

Portal.search.filter._keywordFilterConfig = function () {

    return [
        5,
        'portal.search.field.multiselect-keyword',
        OpenLayers.i18n("keyword"),
        {
            fieldLabel : OpenLayers.i18n("keyword"),
            labelSeparator : '',
            name : 'themekey',
            field : 'keyword',
            xtype : 'portal.search.field.multiselect',
            anchor: '100%',
            proxyUrl : proxyURL,
            url : Portal.app.config.catalogUrl + '/srv/eng/portal.summary.keywords'
        },
        false
    ];
};

Portal.search.filter._parameterFilterConfig = function () {

    return [
        6,
        'portal.search.field.multiselect-parameter',
        OpenLayers.i18n("parameter"),
        {
            fieldLabel : OpenLayers.i18n("parameter"),
            labelSeparator : '',
            name : 'longParamName',
            field : 'longParamName',
            xtype : 'portal.search.field.multiselect',
            anchor: '100%',
            proxyUrl : proxyURL,
            url : Portal.app.config.catalogUrl + '/srv/eng/portal.summary.longParamNames'
        },
        false
    ];
};

Portal.search.filter._organisationFilterConfig = function () {

    return [
        7,
        'portal.search.field.multiselect-organisation',
        OpenLayers.i18n("organisation"),
        {
            fieldLabel : OpenLayers.i18n("organisation"),
            labelSeparator : '',
            name : 'orgName',
            field : 'orgName',
            xtype : 'portal.search.field.multiselect',
            anchor: '100%',
            proxyUrl : proxyURL,
            url : Portal.app.config.catalogUrl + '/srv/eng/portal.summary.organisations'
        },
        false
    ];
};

Portal.search.filter._downloadsFilterConfig = function () {

    return [
        8,
        'downloads',
        OpenLayers.i18n("downloadsOnly"),
        {
            fieldLabel: OpenLayers.i18n("downloads"),
            boxLabel: OpenLayers.i18n('downloadsText'),
            labelSeparator : '',
            name : 'download',
            xtype : 'portal.search.field.checkbox',
            checked: true,
            anchor: '100%'
        },
        false
    ];
};

Portal.search.filter._exactMatchFilterConfig = function () {

    return [
        9,
        'precision',
        OpenLayers.i18n('exactMatches'),
        {
            xtype: 'portal.search.field.valuecheckbox',
            name: 'similarity',
            fieldLabel: OpenLayers.i18n('precision'),
            labelSeparator : '',
            boxLabel: OpenLayers.i18n('exactMatchesDesc'),
            checked: true,
            checkedValue: 1,
            uncheckedValue: 0.8
        },
        false,
        {
            name: 'similarity',
            value: 0.8
        }
    ];
};