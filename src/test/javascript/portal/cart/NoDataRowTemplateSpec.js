
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.NoDataRowTemplate', function() {

    var tpl;

    beforeEach(function() {
        tpl = new Portal.cart.NoDataRowTemplate();
    });

    describe('constructor', function() {
        it('assigns values from passed in config', function() {
            var callback = noOp;
            var _tpl = new Portal.cart.WfsDataRowTemplate({ downloadConfirmation: callback, downloadConfirmationScope: this });
            expect(_tpl.downloadConfirmation).toBe(callback);
            expect(_tpl.downloadConfirmationScope).toBe(this);
        });
    });

    describe('getDataFilterEntry', function() {
        it('it returns text that contains a no filter message', function() {
            expect(tpl.getDataFilterEntry({}).indexOf(OpenLayers.i18n('noDataMessage'))).toBeGreaterThan(-1);
        });
    });

    describe('createMenuItems', function() {
        it('returns no menu items', function() {
            expect(tpl.createMenuItems({})).toEqual([]);
        });
    });

    describe('getDataSpecificMarkup', function() {
        it('returns no specific markup', function() {
            expect(tpl.getDataSpecificMarkup()).toEqual('');
        });
    });

    describe('downloadWithConfirmation', function() {
        it('it returns a function', function() {
            expect(typeof(tpl.downloadWithConfirmation('', '', {}))).toEqual('function');
        });
    });
});
