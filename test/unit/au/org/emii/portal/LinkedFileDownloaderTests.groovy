
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.downloadcart.LinkedFileDownloader
import grails.test.GrailsUnitTestCase

class LinkedFileDownloaderTests extends GrailsUnitTestCase {

	def downloader = new LinkedFileDownloader()

	void testGetMatchingEntriesReturnsDownloadableLinks() {

		def testObj = new Object()

		def record = [
		    downloadableLinks: testObj
		]

		assertEquals testObj, downloader.getMatchingEntries(record)
	}

	void testGetMatchingEntriesReturnsEmptyArray() {

		def record = [
			downloadableLinks: null
		]

		assertEquals( [], downloader.getMatchingEntries(record) )
	}
}
