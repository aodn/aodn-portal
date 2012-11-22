
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class MenuItemTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testParseChildren() {
		mockDomain(MenuItem)

        mockDomain(Layer, [new Layer(id:26), new Layer(id: 90), new Layer(id: 3), new Layer(id: 72)])


		def menuItem = new MenuItem()
		def json = '[{"id":"1","text":"SST from ivec","grailsLayerId":"26","leaf":true},{"id":"2","text":"ACORN_raw_data_SAG/SPEED","grailsLayerId":"90","leaf":true},{"id":"3","text":"ocean_east_aus_temp/temp","grailsLayerId":"72","leaf":true}]'
		menuItem._parseChildren(json)
		assertEquals 3, menuItem.childItems.size()

		def l = new ArrayList(menuItem.childItems)

		assertEquals 0, l[0].childItems.size()
		// Assertion fails as it is dependent on Hibernate applying both sides
		// of the association which doesn't happen at unit test level
		//assertEquals menuItem, l[0].parent
    }

	void testParse() {
		mockDomain(MenuItem)
        mockDomain(Layer, [new Layer(id:26), new Layer(id: 90), new Layer(id: 3), new Layer(id: 72)])
		def menuItem = new MenuItem()
		def json = '{"id":"1","text":"NcWMS Layers","leaf":false,"children":[{"id":"2","text":"SST from ivec","grailsLayerId":"26","leaf":true},{"id":"3","text":"ACORN_raw_data_SAG/SPEED","grailsLayerId":"90","leaf":true},{"id":"4","text":"ocean_east_aus_temp/temp","grailsLayerId":"72","leaf":true}]}'
		menuItem.parseJson(json, 0)
		assertEquals 'NcWMS Layers', menuItem.text
		assertNull menuItem.layer
		assertNull menuItem.server

		def l = new ArrayList(menuItem.childItems)

		def child = l[0]
		assertEquals 26, child.layer.id
		assertTrue child.leaf
		assertEquals 'ACORN_raw_data_SAG/SPEED', l[1].text
	}

	void testFindItem() {
		mockDomain(MenuItem)
        mockDomain(Layer)
		def parent = new MenuItem()
		def item = new MenuItem()
        def layer = new Layer()
        layer.id = 3

		item.id = 99
		item.text = 'Test Text'
		item.layer = layer
		item.leaf = true
		item.parent = parent
		parent.childItems << item

		assertNull parent._findItem(0).text
		assertEquals 'Test Text', parent._findItem(99).text
	}
}
