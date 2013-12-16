/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.GrailsUnitTestCase

class UniqueFilenameGeneratorTests extends GrailsUnitTestCase {

    def generator

    @Override
    protected void setUp() {
        super.setUp()

        generator = new UniqueFilenameGenerator()
    }

    void testFindUniqueFilename() {

        assertEquals "file.txt",     generator.generateUniqueFilename("file", ".txt")
        assertEquals "file(2).txt",  generator.generateUniqueFilename("file", ".txt")
        assertEquals "file(3).html", generator.generateUniqueFilename("file", ".html")
        assertEquals "index.html",   generator.generateUniqueFilename("index", ".html")
        assertEquals "index(2).txt", generator.generateUniqueFilename("index", ".txt")
        assertEquals "index(3)",     generator.generateUniqueFilename("index")
    }
}
