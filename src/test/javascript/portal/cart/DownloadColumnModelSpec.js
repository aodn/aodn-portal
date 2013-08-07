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
        describe('description', function() {
            it('exists', function() {
                expect(columnModel.getColumnById('description')).toBeTruthy();
            });

            it('is a template column', function() {
                expect(columnModel.getColumnById('description')).toBeInstanceOf(Ext.grid.TemplateColumn);
            });

            it('tpl is a DownloadPanelTemplate', function() {
                expect(columnModel.getColumnById('description').tpl).toBeInstanceOf(Portal.cart.DownloadPanelTemplate);
            });
        });

        describe('remove', function() {
            it('exists', function() {
                expect(columnModel.getColumnById('remove')).toBeTruthy();
            });

            it('custom renderer', function() {
                expect(columnModel.getColumnById('remove').renderer).toBe(columnModel._removeColumnRenderer);
            });
        });
    });
});
