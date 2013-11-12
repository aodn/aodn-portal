
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class OperationTests extends GrailsUnitTestCase {

    protected void setUp() {
        super.setUp()

        mockDomain(Operation)
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testValidOperation() {
        Operation operation = new Operation(name: "opName", formats: "opFormats", getUrl: "opGetUrl")

        operation.save()

        assertFalse(operation.hasErrors())
    }

    void testNotNullableConstraints() {
        Operation operation = new Operation()

        operation.save()

        assertTrue(operation.hasErrors())

        assertEquals("nullable", operation.errors.getFieldError("name").getCode())
        assertEquals("nullable", operation.errors.getFieldError("formats").getCode())
        assertEquals("nullable", operation.errors.getFieldError("getUrl").getCode())
    }
}
