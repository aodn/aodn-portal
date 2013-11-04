/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class SearchTests extends GrailsUnitTestCase {
    def owner

    protected void setUp() {
        super.setUp()

        owner = new User()
        mockDomain(User, [owner])
        owner.save()

        mockDomain(SearchFilter)
        mockDomain(Search)
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testParseJsonEmpty() {
        assertIllegalArgument('''{}''', "Owner ID must be specified.")
    }

    void testParseJsonInvalidOwnerNoFilterParams() {
        assertIllegalArgument('''{
						 owner:
						 {
							id: 999
						 },
						 name: 'my search'
					  }''', "Invalid owner ID (999).")
    }

    void testParseJsonOwnerNoFilterParams() {
        def json = '''{
					     owner:
						 {
							id: ''' + owner.id + '''
						 },
						 name: 'my search'
					  }'''

        def search = Search.parseJson(json)
        assertNotNull(search)
        assertEquals(owner.id, search.owner.id)
        assertEquals('my search', search.name)
    }

    void testParseJsonOwnerNoName() {
        def json = '''{
						 owner:
						 {
							id: ''' + owner.id + '''
						 },
					  }'''

        assertIllegalArgument(json, "Name must be specified.")
    }

    void testParseJsonWithBoundingBox() {
        def json = '''{
					     owner:
						 {
							id: ''' + owner.id + '''
						 },
						 name: 'my search',
						 filters:
						 [{
							 type: 'boundingbox',
							 value:
							 {
								northBL: -10.12,
								southBL: -42.35,
								eastBL: 61.67,
								westBL: 32.983
							 }
						 }]
					  }'''

        def search = Search.parseJson(json)
        assertNotNull(search)
        assertNotNull(search.filters)

        assertEquals('boundingbox', search.filters[0].type)
        assertEquals("61.67", search.filters[0].value.eastBL)
        assertEquals("-42.35", search.filters[0].value.southBL)
        assertEquals("-10.12", search.filters[0].value.northBL)
        assertEquals("32.983", search.filters[0].value.westBL)
    }

    private void assertIllegalArgument(json, expectedMsg) {
        try {
            def search = Search.parseJson(json)
            fail()
        }
        catch (IllegalArgumentException e) {
            assertEquals(expectedMsg, e.getMessage())
        }
    }
}
