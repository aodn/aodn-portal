describe("Portal.common.helpers", function() {
    describe("getPortalBase", function() {
        it("returns base", function() {
            expect(getPortalBase("/")).toEqual("/");
            expect(getPortalBase("/something")).toEqual("/something");
            expect(getPortalBase("/search")).toEqual("");
        });
    });
});
