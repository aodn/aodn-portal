/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe("Portal.search.data.GeoNetworkSearchResponseLoader", function() {

    var searchResponse = "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \
<response from=\"1\" to=\"7\" selected=\"0\"> \
  <summary count=\"22\" type=\"local\"> \
    <dimension count=\"7\" value=\"Platform\"> \
      <category count=\"7\" value=\"Ship\"> \
          <category count=\"3\" value=\"L'Astrolabe\"/> \
          <category count=\"4\" value=\"Aurora Australis\"/> \
      </category> \
    </dimension> \
    <dimension count=\"8\" value=\"Parameter\"> \
      <category count=\"3\" value=\"Biotic taxonomic identification\" /> \
      <category count=\"3\" value=\"Abundance of biota\" /> \
      <category count=\"1\" value=\"Total alkalinity per unit mass of the water body\" /> \
      <category count=\"1\" value=\"Concentration of ammonium {NH4} per unit volume of the water body\" /> \
    </dimension> \
    <dimension count=\"7\" value=\"Organisation\"> \
      <category count=\"5\" value=\"CSIRO Division of Marine and Atmospheric Research - Hobart\" /> \
      <category count=\"2\" value=\"CSIRO Division of Marine and Atmospheric Research - Dutton Park\" /> \
    </dimension> \
  </summary> \
</response> \
";

    var rootNode;
    var treeLoader;

    beforeEach(function() {
        mockAjaxXmlResponse(searchResponse);

        treeLoader = new Portal.ui.search.data.GeoNetworkSearchResponseLoader({
            dataUrl: 'http://url'
        });

        rootNode = new Ext.tree.TreeNode();
        treeLoader.load(rootNode);
    });

    it('loads XML in to tree', function() {
        var platformDimensionNode = rootNode.findChild('value', 'Platform', true);
        expect(platformDimensionNode).toBeTruthy();
        expect(platformDimensionNode.attributes.count).toBe('7');
    });

    describe('create node', function() {
        it('creates value hierarchy', function() {
            var shipCategoryNode = rootNode.findChild('value', 'Ship', true);
            expect(shipCategoryNode.toValueHierarchy()).toBe('Platform/Ship');

            var auroraCategoryNode = rootNode.findChild('value', 'Aurora Australis', true);
            expect(auroraCategoryNode.toValueHierarchy()).toBe('Platform/Ship/Aurora Australis');
        });
    });
});
