describe("Portal.data.ServerNodeLayerDescriptorStore", function() {

	var node = new Ext.tree.TreeNode({
		text: 'My Root Node',
		grailsServerId: '1'
	});
	
	function clearChildren() {
		node.childNodes = [];
	}
	
	function countEnumerableProperties(o) {
		var i = 0;
		for (var item in o) {
			i++;
		}
		return i;
	}
	
	describe('instantiation', function() {
		it("throws an error when no config is passed", function () {
			var noCfg = function () {  
				var serverLayerDescriptorStore = new Portal.data.ServerNodeLayerDescriptorStore();
		    }  
		    expect(noCfg).toThrow('ServerNodeLayerDescriptorStore requires a Ext.tree.TreeNode');
		});
	    
		it("throws an error when no node is passed in the config", function () {
		    var noNode = function () {  
				var serverLayerDescriptorStore = new Portal.data.ServerNodeLayerDescriptorStore({});
		    }  
		    expect(noNode).toThrow('ServerNodeLayerDescriptorStore requires a Ext.tree.TreeNode');
		});
		
		it("instantiates when no TreePanel (treePanel) is passed in the config", function () {
		    var noTreePanel = function () { 
				var serverLayerDescriptorStore = new Portal.data.ServerNodeLayerDescriptorStore({node: node});
		    }
		    expect(noTreePanel).toBeTruthy();
		});
	});
	
	describe('sort', function() {
		it('does not attempt to sort when no treePanel is passed in config', function() {
			var store = new Portal.data.ServerNodeLayerDescriptorStore({node: node});
			expect(store.sort(node)).toBeFalsy();
		});
	});
	
	describe('toNode', function() {
		it('creates an Ext.tree.TreeNode', function() {
			var store = new Portal.data.ServerNodeLayerDescriptorStore({node: node});
			var newNode = store.toNode('New Node Title');
			expect(newNode.text).toMatch('New Node Title');
		});
	});
	
	describe('loading', function() {
		it('calls to update methods related to the load of data', function() {
			var layerData = {"layerDescriptors":[{"class":"au.org.emii.portal.Layer","id":200,"bbox":null,"cache":false,"cql":null,"currentlyActive":true,"description":"GeoServer Web Map Service","disabled":false,"isBaseLayer":false,"lastUpdated":"2012-01-05T03:22:33Z","layers":[],"name":"GeoServer Web Map Service","parent":null,"queryable":false,"server":{"class":"au.org.emii.portal.Server","id":1,"allowDiscoveries":true,"comments":null,"disable":false,"imageFormat":"image/png","name":"Tommy CMAR","opacity":100,"parseDate":"2012-01-04T06:06:15Z","parseFrequency":"always","shortAcron":"TFCMAR","type":"WMS-1.1.1","uri":"http://www.cmar.csiro.au/geoserver/wms?service=wms&version=1.1.1&request=getCapabilities&namespace=mnf"},"source":"TFCMAR","style":null,"title":"GeoServer Web Map Service"}]};
			var store = new Portal.data.ServerNodeLayerDescriptorStore({node: node});
			spyOn(store, 'beginNodeUpdate');
			spyOn(store, 'updateNode');
			spyOn(store, 'endNodeUpdate');
			store.loadData(layerData);
			expect(store.beginNodeUpdate).toHaveBeenCalled();
			expect(store.updateNode).toHaveBeenCalled();
			expect(store.endNodeUpdate).toHaveBeenCalled();
		});
		
		it('adds a child node to a parent', function() {
			clearChildren();
			var store = new Portal.data.ServerNodeLayerDescriptorStore({node: node});
			store.createChild(store.node, '1', 'My First Child Node', null, '1');
			expect(store.node.hasChildNodes()).toBeTruthy();
			expect(store.node.childNodes.length).toEqual(1);
		});
		
		it('adds many child nodes to a parent', function() {
			clearChildren();
			var store = new Portal.data.ServerNodeLayerDescriptorStore({node: node});
			var layers = [
			    {id: '100', title: 'Child 100', server: '1'},
			    {id: '99', title: 'Child 99', server: '1'},
			    {id: '98', title: 'Child 98', server: '1'},
			    {id: '97', title: 'Child 97', server: '1'},
			    {id: '96', title: 'Child 96', server: '1'}
			];
			store.addChildren(store.node, layers);
			expect(store.node.hasChildNodes()).toBeTruthy();
			expect(store.node.childNodes.length).toEqual(5);
		});
		
		it('adds many child nodes to a parent via addChildren checking for a call to createChild', function() {
			clearChildren();
			var store = new Portal.data.ServerNodeLayerDescriptorStore({node: node});
			var layers = [
			    {id: '100', title: 'Child 100', server: '1'},
			    {id: '99', title: 'Child 99', server: '1'},
			    {id: '98', title: 'Child 98', server: '1'},
			    {id: '97', title: 'Child 97', server: '1'},
			    {id: '96', title: 'Child 96', server: '1'}
			];
			spyOn(store, 'createChild');
			store.addChildren(store.node, layers);
			expect(store.createChild).toHaveBeenCalled();
		});
		
		it('adds a child node to a child via createChild checking for a call to addChildren', function() {
			clearChildren();
			var store = new Portal.data.ServerNodeLayerDescriptorStore({node: node});
			var layers = [
			    {id: '100', title: 'Child 100', server: '1'},
			    {id: '99', title: 'Child 99', server: '1'},
			    {id: '98', title: 'Child 98', server: '1'},
			    {id: '97', title: 'Child 97', server: '1'},
			    {id: '96', title: 'Child 96', server: '1'}
			];
			spyOn(store, 'addChildren');
			store.createChild(store.node, '1', 'First Child', layers, '1');
			expect(store.addChildren).toHaveBeenCalled();
		});
		
		it('adds a child node to a child via createChild checking for size of childNodes', function() {
			clearChildren();
			var store = new Portal.data.ServerNodeLayerDescriptorStore({node: node});
			var layers = [
			    {id: '100', title: 'Child 100', server: '1'},
			    {id: '99', title: 'Child 99', server: '1'},
			    {id: '98', title: 'Child 98', server: '1'},
			    {id: '97', title: 'Child 97', server: '1'},
			    {id: '96', title: 'Child 96', server: '1'}
			];
			store.createChild(store.node, '1', 'First Child', layers, '1');
			expect(store.node.childNodes.length).toEqual(1);
			expect(store.node.childNodes[0].childNodes.length).toEqual(5);
		});
		
		it('checks that only one store is made for a particular node', function() {
			clearChildren();
			var store1 = Portal.data.ServerNodeLayerDescriptorStore.GetServerLayerDescriptorStore(node);
			var items1 = countEnumerableProperties(Portal.data.ServerNodeLayerDescriptorStore.ServerLayerDescriptorStores);
			var store2 = Portal.data.ServerNodeLayerDescriptorStore.GetServerLayerDescriptorStore(node);
			var items2 = countEnumerableProperties(Portal.data.ServerNodeLayerDescriptorStore.ServerLayerDescriptorStores);
			expect(items2).toEqual(items1);
		});
	});
});