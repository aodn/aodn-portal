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
        assertEquals "file.html", generator.generateUniqueFilename("file", ".html")
        assertEquals "index.html",   generator.generateUniqueFilename("index", ".html")
        assertEquals "index.txt", generator.generateUniqueFilename("index", ".txt")
        assertEquals "index",     generator.generateUniqueFilename("index")
    }

    protected void tearDown() {
        super.tearDown()
    }
}
