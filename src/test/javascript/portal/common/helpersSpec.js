describe("Portal.common.helpers", function() {
    describe("getPortalBase", function() {
        it("returns base", function() {
            expect(getPortalBase("/")).toEqual("/");
            expect(getPortalBase("/something")).toEqual("/something");
            expect(getPortalBase("/search")).toEqual("");
        });
    });


    describe("humanFileSize", function() {
        it("size in bytes returns human understandable size", function() {

            expect(humanFileSize("1")).toEqual("1 Bytes");
            expect(humanFileSize("1024")).toEqual("1 kB");
            expect(humanFileSize(1068)).toEqual("1.04 kB");
            var gigabyte = Math.pow(2,30); //https://en.wikipedia.org/wiki/Gigabyte#Binary_definition
            expect(humanFileSize(gigabyte)).toEqual("1 GB");
            expect(humanFileSize("12312312312310683")).toEqual("10.94 Petabytes(PB)");
        });
    });


});
