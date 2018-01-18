describe("Portal.filter.GeometryFilter", function() {

    var filter;

    describe('polygon drawn', function() {

        beforeEach(function() {

            filter = new Portal.filter.GeometryFilter({
                name: 'column_name',
                getValue: returns(new OpenLayers.Geometry.fromWKT('POLYGON((1 2,3 2,3 4,1 4,1 2))'))
            });
            filter.map = {
                getSpatialConstraintType: returns('polygon')
            };
        });

        describe('getCql', function() {

            it('returns CQL', function() {

                expect(filter.getCql()).toBe('INTERSECTS(column_name,POLYGON((1 2,3 2,3 4,1 4,1 2)))');
            });
        });

        describe('getHumanReadableForm', function() {

            it('returns a description', function() {

                var humanReadableForm = filter.getHumanReadableForm();

                expect(humanReadableForm).toContain(OpenLayers.i18n("spatialExtentHeading"));
                expect(humanReadableForm).toContain(OpenLayers.i18n("spatialExtentPolygonNote"));
                expect(humanReadableForm).toBe(OpenLayers.i18n("spatialExtentHeading") + ': Polygon with max extent 1W 2S 3E 4N');
            });
        });
    });

    describe('rectangle drawn', function() {

        beforeEach(function() {

            filter = new Portal.filter.GeometryFilter({
                name: 'column_name',
                getValue: returns(new OpenLayers.Geometry.fromWKT('POLYGON((1 2,3 2,3 4,1 4,1 2))'))
            });
            filter.map = {
                getSpatialConstraintType: returns('box')
            };
        });

        describe('getCql', function() {

            it('returns CQL', function() {

                expect(filter.getCql()).toBe('INTERSECTS(column_name,POLYGON((1 2,3 2,3 4,1 4,1 2)))');
            });
        });

        describe('getHumanReadableForm', function() {

            it('returns a description', function() {

                var humanReadableForm = filter.getHumanReadableForm();

                expect(humanReadableForm).toContain(OpenLayers.i18n("spatialExtentHeading"));
                expect(humanReadableForm).toBe(OpenLayers.i18n("spatialExtentHeading") + ': 1W 2S 3E 4N');
            });
        });
    });
});
