/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsColumnModel = Ext.extend(Ext.grid.ColumnModel, {

    constructor: function() {

        var mapWidth = 200;
        var mapHeight = 104;

        var config = Ext.apply({
            defaults: {
                menuDisabled: true
            },
            columns:[
                {
                    header: '',
                    width: mapWidth,
                    height: mapHeight,
                    xtype: 'minimapcolumn'
                },
                {
                    id: 'mdDesc',
                    header: OpenLayers.i18n('descHeading'),
                    dataIndex: 'title',
                    xtype: 'templatecolumn',
                    tpl: '<div style="white-space:normal !important;" title="{abstract}"><p>{title}</p></div>'
                },
                {
                    header: '',
                    xtype: 'viewrecordcolumn'
                }
            ]
        });

        Portal.search.FacetedSearchResultsColumnModel.superclass.constructor.call(this, config);
    }
});
