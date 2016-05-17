describe("Portal.common.helpers", function() {
    describe("getPortalBase", function() {
        it("returns base", function() {
            expect(getPortalBase("/aodn-portal/search")).toEqual("/aodn-portal");
            expect(getPortalBase("/aodn-portal")).toEqual("/aodn-portal");
            expect(getPortalBase("/")).toEqual("/");
            expect(getPortalBase("/something")).toEqual("/something");
            expect(getPortalBase("/search")).toEqual("");
        });
    });
});
