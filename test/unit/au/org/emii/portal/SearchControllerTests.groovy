/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.JSON
import grails.test.ControllerUnitTestCase

class SearchControllerTests extends ControllerUnitTestCase {
    def joeBloggs
    def peteSmith
    def joesSearch
    def petesSearch

    protected void setUp() {
        super.setUp()

        mockDomain(Search)
        mockDomain(SearchFilter)

        joeBloggs = new User(fullName: 'Joe Bloggs')
        peteSmith = new User(fullName: 'Pete Smith')
        mockDomain(User, [joeBloggs, peteSmith])
        [joeBloggs, peteSmith].each{ it.save() }

        // Create a bit of data...
        joesSearch = Search.parseJson('''{
			owner:
			{
			   id: ''' + joeBloggs.id + '''
			},
			name: 'joes search',
			filters:
			[{
				type: 'portal.search.field.boundingbox',
				value:
				{
				   northBL: -10.12,
				   southBL: -42.35,
				   eastBL: 61.67,
				   westBL: 32.983
				}
			}]
		 }''')
        joesSearch.save()

        petesSearch = Search.parseJson('''{
			owner:
			{
			   id: ''' + peteSmith.id + '''
			},
			name: 'petes search',
			filters:
			[{
				type: 'portal.search.field.boundingbox',
				value:
				{
				   northBL: -10.12,
				   southBL: -42.35,
				   eastBL: 61.67,
				   westBL: 32.983
				}
			},
			{
				type: 'portal.search.field.freetext',
				value:
				{
					value: 'AATAMS rulz man!'
				}
			}]
		 }''')
        petesSearch.save()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testList() {
        assertList(null, ['joes search', 'petes search'])
    }

    void testListForOwner() {
        assertList(joeBloggs, ['joes search'])
    }

    void testShow() {
        controller.params.id = joesSearch.id
        controller.show()

        def json = JSON.parse(controller.response.contentAsString)
        assertEquals(joesSearch.id, json.id)
        assertEquals("portal.search.field.boundingbox", json.filters[0].type)
        assertEquals("61.67", json.filters[0].value.eastBL)
    }

    void assertList(owner, expectedNames) {
        controller.params.owner = owner
        controller.list()

        def json = JSON.parse(controller.response.contentAsString)

        assertEquals(expectedNames.size(), json.size())
        expectedNames.eachWithIndex
            {
                name, i ->

                    assertEquals(name, json[i].name)
            }
    }
}
