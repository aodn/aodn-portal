/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.cart.AodaacDataRowTemplate', function() {

    var tpl;
    var geoNetworkRecord;

    beforeEach(function() {
        tpl = new Portal.cart.AodaacDataRowTemplate();
        geoNetworkRecord = {
            uuid: 7,
            aodaac: {}
        };
        geoNetworkRecord.aodaac.latitudeRangeStart = '-10';
    });

    describe('getDataFilterEntry', function() {

        it('still returns date range stuff without bbox stuff', function() {
            geoNetworkRecord.aodaac.latitudeRangeStart = undefined;
            expect(tpl.getDataFilterEntry(geoNetworkRecord).length).toBeGreaterThan(10);
        });

        it('indicates a northerly bound', function() {
            var entry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('N')).toBeGreaterThan(-1);
            expect(entry.indexOf('-10')).toBeGreaterThan(-1);
            expect(entry.indexOf('N')).toBeGreaterThan(entry.indexOf('-10'));
        });

        it('indicates an easterly bound', function() {
            geoNetworkRecord.aodaac.longitudeRangeEnd = '170';
            var entry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('E')).toBeGreaterThan(-1);
            expect(entry.indexOf('170')).toBeGreaterThan(-1);
            expect(entry.indexOf('E')).toBeGreaterThan(entry.indexOf('170'));
        });

        it('indicates a southerly bound', function() {
            geoNetworkRecord.aodaac.latitudeRangeEnd = '-40';
            var entry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('S')).toBeGreaterThan(-1);
            expect(entry.indexOf('-40')).toBeGreaterThan(-1);
            expect(entry.indexOf('S')).toBeGreaterThan(entry.indexOf('-40'));
        });

        it('indicates an westerly bound', function() {
            geoNetworkRecord.aodaac.longitudeRangeStart = '150';
            var entry = tpl.getDataFilterEntry(geoNetworkRecord);
            expect(entry.indexOf('W')).toBeGreaterThan(-1);
            expect(entry.indexOf('150')).toBeGreaterThan(-1);
            expect(entry.indexOf('W')).toBeGreaterThan(entry.indexOf('150'));
        });
    });

    describe('createMenuItems', function() {
        var items;

        beforeEach(function() {
            items = tpl.createMenuItems(geoNetworkRecord);
        });

        it('creates menu items', function() {
            expect(items.length).toBeGreaterThan(0);
        });

        it('allows nc download', function() {
            expect(itemsContains('downloadAsNetCdfLabel')).toBe(true);
        });

        it('allows hdf download', function() {
            expect(itemsContains('downloadAsHdfLabel')).toBe(true);
        });

        it('allows ascii download', function() {
            expect(itemsContains('downloadAsAsciiLabel')).toBe(true);
        });

        it('allows urls download', function() {
            expect(itemsContains('downloadAsOpenDapUrlsLabel')).toBe(true);
        });

        function itemsContains(type) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].text == OpenLayers.i18n(type)) {
                    return true;
                }
            }
            return false;
        }
    });

    describe('getDataSpecificMarkup', function() {
        var markup;

        beforeEach(function() {
            markup = tpl.getDataSpecificMarkup(geoNetworkRecord);
        });

        it('provides markup', function() {
            expect(markup).not.toEqual('');
        });

        it('contains the blurb', function() {
            expect(markup.indexOf(OpenLayers.i18n('notificationBlurbMessage'))).toBeGreaterThan(-1);
        });

        it('contains an input for an email address', function() {
            expect(markup.indexOf(tpl.AODAAC_EMAIL_ADDRESS_ATTRIBUTE)).toBeGreaterThan(-1);
        });

        it('contains the email address place holder when there is no email address', function() {
            expect(markup.indexOf(OpenLayers.i18n('emailAddressPlaceholder'))).toBeGreaterThan(-1);
        });

        it('contains the user specified email address', function() {
            spyOn(tpl, '_getEmailAddress').andReturn('aodaac@aodaac.org');
            var _markup = tpl.getDataSpecificMarkup(geoNetworkRecord);

            expect(tpl._getEmailAddress).toHaveBeenCalled();
            expect(_markup.indexOf('aodaac@aodaac.org')).toBeGreaterThan(-1);
        });
    });

    describe('_downloadAodaacHandler', function() {
        it('provides a function', function() {
            expect(typeof(tpl._downloadAodaacHandler(geoNetworkRecord, 'nc'))).toEqual('function');
        });
    });

    describe('_aodaacUrl', function() {

        var url;
        var params = {
            dateRangeStart: new Date(0),
            dateRangeEnd: new Date(),
            latitudeRangeStart: -42,
            latitudeRangeEnd: -20,
            longitudeRangeStart: 160,
            longitudeRangeEnd: 170,
            productId: 1
        };

        beforeEach(function() {
            url = tpl._aodaacUrl(params, 'nc', 'aodaac@imos.org.au');
        });

        it('includes the aodaac endpoint', function() {
            expect(url.indexOf('aodaac/createJob?')).toBeGreaterThan(-1);
        });

        it('includes the output format', function() {
            expect(url).toHaveParameterWithValue('outputFormat', 'nc');
        });

        it('includes the product id', function() {
            expect(url).toHaveParameterWithValue('productId', '1');
        });

        it('includes the date range start', function() {
            expect(url).toHaveParameterWithValue('dateRangeStart', params.dateRangeStart);
        });

        it('includes the date range end', function() {
            expect(url).toHaveParameterWithValue('dateRangeEnd', params.dateRangeEnd);
        });

        it('includes the latitude range start', function() {
            expect(url).toHaveParameterWithValue('latitudeRangeStart','-42');
        });

        it('includes the latitude range end', function() {
            expect(url).toHaveParameterWithValue('latitudeRangeEnd', '-20');
        });

        it('includes the longitude range start', function() {
            expect(url).toHaveParameterWithValue('longitudeRangeStart', '160');
        });

        it('includes the longitude range end', function() {
            expect(url).toHaveParameterWithValue('longitudeRangeEnd', '170');
        });
    });

    describe('email address', function() {

        it('saves an email address', function() {
            var emailInput = new Ext.form.TextField();
            spyOn(tpl, '_emailTextFieldElement').andReturn(emailInput);
            spyOn(tpl, '_saveEmailAddress').andReturn(emailInput);

            tpl.attachMenuEvents(geoNetworkRecord);
            emailInput.fireEvent('change');
            expect(tpl._saveEmailAddress).toHaveBeenCalledWith(geoNetworkRecord.uuid);
        });

        describe('_validateEmailAddress', function () {

            it('returns false for an empty address', function () {
                var returnVal = tpl._validateEmailAddress('');
                expect(returnVal).toBe(false);
            });

            it('returns false for an invalid address', function () {
                var returnVal = tpl._validateEmailAddress('notAnEmailAddress');
                expect(returnVal).toBe(false);
            });

            it('returns true for a valid address', function () {
                var returnVal = tpl._validateEmailAddress('user@domain.com');
                expect(returnVal).toBe(true);
            });
        });
    });

    describe('_parameterString', function () {

        beforeEach(function () {
            spyOn(OpenLayers, 'i18n').andReturn('i18n value');
            spyOn(String, 'format');
            tpl._parameterString('the_key', 'val1', 'val2', "delimiter");
        });

        it('calls OpenLayers.i18n()', function () {
            expect(OpenLayers.i18n).toHaveBeenCalledWith('the_key');
        });

        it('calls String.format()', function () {
            expect(String.format).toHaveBeenCalledWith('<b>{0}:</b> &nbsp;<code>{1}</code> {3} <code>{2}</code><br>', 'i18n value', 'val1', 'val2', "delimiter")
        });
    });
});
