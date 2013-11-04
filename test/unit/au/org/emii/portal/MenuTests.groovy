/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class MenuTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testConstraints() {

        def menu1 = new Menu(title: "menu1")
        mockForConstraintsTests(Menu, [menu1])

        def testMenu = new Menu()
        assertFalse testMenu.validate()
        assertEquals "nullable", testMenu.errors["title"]
        assertEquals "nullable", testMenu.errors["active"]
        assertEquals "nullable", testMenu.errors["editDate"]

        testMenu = new Menu(title: "menu1")
        assertFalse testMenu.validate()
        assertEquals "unique", testMenu.errors["title"]

        testMenu = new Menu(title: "")
        assertFalse testMenu.validate()
        assertEquals "blank", testMenu.errors["title"]

        testMenu = new Menu(title: "01234567890123456789012345678901234567890")
        assertFalse testMenu.validate()
        assertEquals "maxSize", testMenu.errors["title"]
    }

    void testToString() {
        def testMenu = new Menu(title: "menu1")
        assertEquals "menu1", testMenu.toString()
    }

    void testJsonParsing() {
        mockDomain(Menu)
        mockDomain(MenuItem)

        def layers = []
        def servers = []

        for (i in (0..200).toArray()) {
            def l = new Layer()
            l.id = i
            layers.add(l)
        }

        for (i in (0..200).toArray()) {
            def s = new Server()
            s.id = i
            servers.add(s)
        }

        mockDomain(Layer, layers)
        mockDomain(Server, servers)

        def json = '{"id":"1","text":"Main","children":[{"id":"1","text":"IVEC ncWMS Server","grailsServerId":"4","leaf":false,"children":[]},{"id":"2","text":"Argo - CQL","grailsLayerId":"35","leaf":true},{"id":"3","text":"argo_aggregation","grailsLayerId":"110","leaf":true},{"id":"4","text":"anfog_glider","grailsLayerId":"109","leaf":true},{"id":"5","text":"ABOS Tracks","grailsLayerId":"12","leaf":true},{"id":"6","text":"soop_xbt","grailsLayerId":"108","leaf":true},{"id":"7","text":"SOTS Locations","grailsLayerId":"13","leaf":true},{"id":"8","text":"Zooview ","grailsLayerId":"7","leaf":true},{"id":"9","text":"INFORMD_STORM/w","grailsLayerId":"75","leaf":true},{"id":"10","text":"NcWMS Layers","leaf":false,"children":[{"id":"11","text":"SST from ivec","grailsLayerId":"26","leaf":true},{"id":"12","text":"ACORN_raw_data_SAG/SPEED","grailsLayerId":"90","leaf":true},{"id":"13","text":"ocean_east_aus_temp/temp","grailsLayerId":"72","leaf":true}]},{"id":"14","text":"eMII development WMS server","grailsServerId":"2","leaf":false,"children":[]},{"id":"15","text":"Tommy CMAR","leaf":false,"grailsServerId":"200","children":[]}]}'
        def menu = new Menu()
        menu.parseJson(json)

        assertEquals 'Main', menu.title

        def l = new ArrayList(menu.menuItems)
        assertEquals 12, menu.menuItems.size()

        assertEquals 3, l[9].childItems.size()
        assertEquals 35, l[1].layer.id
    }

    void testFindItem() {
        mockDomain(Menu)
        mockDomain(MenuItem)
        mockDomain(Layer)

        def layer = new Layer()
        layer.id = 3

        def menu = new Menu()
        def item = new MenuItem()
        item.id = 99
        item.text = 'Test Text'
        item.layer = layer
        item.leaf = true
        item.menu = menu
        menu.addToMenuItems(item)

        assertNull menu._findItem(0).text
        assertEquals 'Test Text', menu._findItem(99).text
    }
}
