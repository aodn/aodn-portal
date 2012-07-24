

describe("Portal.ui.UserDefinedWMSPanel", function() 
{
	describe("buildURL", function()	{
		
		proxyWMSURL = "" // global var - not need to run test
		
		var mockController = {
			createSnapshot: jasmine.createSpy()
		};
		
		var uDef = new Portal.ui.UserDefinedWMSPanel({
			controller: mockController
		});

		it("creates component on instantiation", function()
		{
			expect(uDef.serverURLInputBox).toBeDefined();
			expect(uDef.loadedServerURLS).toBeDefined();
			expect(uDef.statusPanel).toBeDefined();
		});
		
		it('test buildURL', function () {  
			expect(uDef.buildURL("dasdasdasd")).toEqual("http%3A%2F%2Fdasdasdasd%3FSERVICE%3DWMS%26request%3DGetCapabilities"); 
			expect(uDef.buildURL("http://dasdasdasd")).toEqual("http%3A%2F%2Fdasdasdasd%3FSERVICE%3DWMS%26request%3DGetCapabilities");  
		}); 
	});
});



