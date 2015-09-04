describe("OpenLayers.Format.WKTNormalised", function() {
    describe("normalised polygon", function() {
        var wkt;

        beforeEach(function() {
            wkt = new OpenLayers.Format.WKTNormalised();
        });

        it("simple polygon", function() {
            var wktString = "POLYGON((-40 -30.37,40 -30.37,40 -18.06,-40 -18.06,-40 -30.37))";
            var features = wkt.read(wktString);
            expect(wkt.write(features)).toEqual(wktString);
        });

        it("whole world polygon", function() {
            var wktString = "POLYGON((-180 -90,180 -90,180 90,-180 90,-180 -90))";
            var features = wkt.read(wktString);
            expect(wkt.write(features)).toEqual(wktString);
        });
    });
});
