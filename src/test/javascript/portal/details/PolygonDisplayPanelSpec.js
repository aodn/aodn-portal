/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
describe('Portal.details.PolygonDisplayPanel', function() {

    var polyDisplayPanel;

    beforeEach(function() {
        polyDisplayPanel = new Portal.details.PolygonDisplayPanel();
    });

    describe('constructor', function() {
        it('initialises', function() {
            expect(polyDisplayPanel.disableSelection).toEqual(true);
            expect(polyDisplayPanel.hideHeaders).toEqual(true);
        });

        it('initialises vertices store', function() {
            expect(polyDisplayPanel.store).toEqual(polyDisplayPanel.verticesStore);
            expect(polyDisplayPanel.verticesStore.fields.keys).toEqual(['y', 'x']);
        });
    });

    describe('setGeometry', function() {

        it('calls load data', function() {
            var vertices = ['1 1', '2 2'];
            var geometry = {
                getVertices: function() {
                    return vertices;
                }
            };

            spyOn(polyDisplayPanel.verticesStore, 'loadData');
            polyDisplayPanel.setGeometry(geometry);
            expect(polyDisplayPanel.verticesStore.loadData).toHaveBeenCalledWith(vertices);
        });
    });
});
