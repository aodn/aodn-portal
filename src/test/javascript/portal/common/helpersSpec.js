/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.common.helpers", function() {
    describe("getPortalBase", function() {
        it("returns base", function() {
            expect(getPortalBase("/aodn-portal/home")).toEqual("/aodn-portal");
            expect(getPortalBase("/aodn-portal")).toEqual("/aodn-portal");
            expect(getPortalBase("/")).toEqual("/");
            expect(getPortalBase("/something")).toEqual("/something");
            expect(getPortalBase("/home")).toEqual("");
        });
    });
});
