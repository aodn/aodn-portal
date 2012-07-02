package au.org.emii.portal

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;

import au.org.emii.portal.display.JavaScriptSourceCollator;
import grails.test.*

class JavaScriptSourceCollatorTests extends GrailsUnitTestCase {
    
	def collator
	def stagingDir
	
	protected void setUp() {
        super.setUp()
		stagingDir = _mockStagingDir()
		collator = new JavaScriptSourceCollator(stagingDir)
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testInitViewDir() {
		assertEquals "${stagingDir}${File.separator}WEB-INF${File.separator}grails-app${File.separator}views", collator.getViewDir().absolutePath
    }
	
	void testGetPortalJsFiles() {
		assertTrue collator.getPortalJsFiles().size() > 0
	}
	
	void testCollate() {
		collator.collate()
	}
	
	def _mockStagingDir() {
		def stagingDir = new File(System.properties["java.io.tmpdir"] + File.separator + "stage")
		
		if (!_upToDate(stagingDir)) {
			FileUtils.copyDirectory(new File(".${File.separator}web-app${File.separator}js${File.separator}portal"), new File("${stagingDir.absolutePath}${File.separator}js${File.separator}portal"))
			FileUtils.copyDirectory(new File(".${File.separator}grails-app${File.separator}views${File.separator}home"), 
				new File("${stagingDir.absolutePath}${File.separator}WEB-INF${File.separator}grails-app${File.separator}views${File.separator}home")
			)
		}
		
		return stagingDir
	}
	
	def _upToDate(dir) {
		if (!dir.exists()) {
			return false
		}
		return System.currentTimeMillis() > (dir.lastModified() + 86400000)
	}
}
