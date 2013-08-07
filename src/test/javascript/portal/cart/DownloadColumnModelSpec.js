/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.cart.DownloadColumnModel', function() {

    var columnModel;

    beforeEach(function() {
        columnModel = new Portal.cart.DownloadColumnModel();
    });

    describe('initialisation', function() {
        it('description', function() {
            expect(columnModel.getColumnById('description')).toBeTruthy();
        });

        it('remove', function() {
            expect(columnModel.getColumnById('remove')).toBeTruthy();
        });
    });
});
