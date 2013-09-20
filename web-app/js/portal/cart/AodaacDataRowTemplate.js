/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.AodaacDataRowTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function(downloadPanelTemplate) {

        this.downloadPanelTemplate = downloadPanelTemplate;

        var templateLines = [
            '  <div class="row">',
            '    <div class="subheading">Data</div>',
            '    {[this._getDataFilterEntry(values)]}',
            '    {[this._getDataDownloadEntry(values)]}',
            '  </div>'
        ];

        Portal.cart.AodaacDataRowTemplate.superclass.constructor.call(this, templateLines);
    },

    applyWithControls: function(values) {

        return this._replacePlaceholdersWithControls(this.apply(values), values);
    },

    _getDataFilterEntry: function(values) {

        var aodaacParameters = values.aodaac;

        if (aodaacParameters) {

            var html = this._aodaacParamatersMarkup(aodaacParameters);

            return this.downloadPanelTemplate._makeEntryMarkup(html);
        }

        return "";
    },

    _getDataDownloadEntry: function(values) {

        var aodaacParameters = values.aodaac;
        var html;

        if (aodaacParameters) {

            html = '<div id="aodaac-download-button-' + values.uuid + '"></div>'; // Download button placeholder
        }
        else {

            html = this.downloadPanelTemplate._makeSecondaryTextMarkup('No direct access to data available currently.');
        }

        return this.downloadPanelTemplate._makeEntryMarkup(html);
    },

    _aodaacParamatersMarkup: function(params) {

        return "" + // Todo - DN: Dictionarise
            "<b>Parameters:</b><br>" +
            this._parameterString('Area', params.southBL + ' N, ' + params.westBL + ' E', params.northBL + ' N, ' + params.eastBL + ' E') +
            this._parameterString('Date range', params.dateRangeStart, params.dateRangeEnd) +
            this._parameterString('Time-of-day range', params.timeOfDayRangeStart, params.timeOfDayRangeEnd);
    },

    _parameterString: function(label, value1, value2) {

        return '' +
            label + ': ' +
            '<code>' +
            value1 + ' – ' + value2 +
            '</code>' +
            '<br>';
    },

    _replacePlaceholdersWithControls: function(html, collection) {

        var elementId = 'aodaac-download-button-' + collection.uuid;

        // Don't create button if no placeholder exists
        if (html.indexOf(elementId) >= 0) {

            this._createDownloadButton.defer(1, this, [html, 'Download as...', elementId, collection]);
        }

        return html;
    },

    _createDownloadButton: function(html, value, id, collection) {

        var downloadMenu = new Ext.menu.Menu({
            items: this._createMenuItems(collection)
        });

        new Ext.Button({
            text: value,
            icon: 'images/down.png',
            scope: this,
            menu: downloadMenu
        }).render(html, id);
    },

    _createMenuItems: function(collection) {

        return [
            {text: 'Download as NetCDF', handler: this._downloadHandlerFor(collection, 'nc'), scope: this},
            {text: 'Download as HDF', handler: this._downloadHandlerFor(collection, 'hdf'), scope: this},
            {text: 'Download as ASCII text', handler: this._downloadHandlerFor(collection, 'txt'), scope: this},
            {text: 'Download as List of OpenDAP URLs', handler: this._downloadHandlerFor(collection, 'urls'), scope: this}
        ];
    },

    _downloadHandlerFor: function(collection, format) {

        var downloadUrl = this._wfsUrlForGeoNetworkRecord(collection, format);

        return function() {

            this.downloadPanelTemplate.downloadPanel.confirmationWindow.showIfNeeded(downloadUrl); // Todo - DN: Tidy this up
        };
    },

    _wfsUrlForGeoNetworkRecord: function(record, format) {

        return record.wmsLayer.getFeatureRequestUrl(format);
    }
});
