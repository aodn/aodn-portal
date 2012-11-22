
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */



describe("Portal.ui.UserDefinedWMSPanel", function() 
{
	describe("buildURL", function()	{

		//this is now a local variable
		//proxyWMSURL = "" // global var - not need to run test
		
		var mockController = {
			createSnapshot: jasmine.createSpy()
		};
		
		var uDef = new Portal.ui.UserDefinedWMSPanel({
			controller: mockController,
			proxyWMSURL: "proxyPath/"
		});

		it("creates component on instantiation", function()
		{
			expect(uDef.serverURLInputBox).toBeDefined();
			expect(uDef.loadedServerURLS).toBeDefined();
			expect(uDef.statusPanel).toBeDefined();
		});
		
		it('test buildURL', function () {  
			expect(uDef.buildURL("dasdasdasd")).toEqual("proxyPath/http%3A%2F%2Fdasdasdasd%3FSERVICE%3DWMS%26request%3DGetCapabilities");
			expect(uDef.buildURL("http://dasdasdasd")).toEqual("proxyPath/http%3A%2F%2Fdasdasdasd%3FSERVICE%3DWMS%26request%3DGetCapabilities");
		}); 
	});
});



