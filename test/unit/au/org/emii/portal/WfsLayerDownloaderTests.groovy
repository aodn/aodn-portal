
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import au.org.emii.portal.downloadcart.WfsLayerDownloader
import grails.test.GrailsUnitTestCase

class WfsLayerDownloaderTests extends GrailsUnitTestCase {

	def downloader

	void setUp() {

		super.setUp()

		downloader = new WfsLayerDownloader()
		downloader.info = [
			layerName: 'imos:argo_floats',
			metadataUrl: 'metadata_url',
			serverUri: 'something.com/wms/service'
		]
	}

	void testGetMatchingEntriesNoInfo() {

		def testRecord = [:]

		assertEquals( [], downloader.getMatchingEntries(testRecord) )
	}

	void testGetMatchingEntriesInfoExists() {

		def downloadItem = new Object()
		def metadataItem = new Object()

		downloader.metaClass._wfsDownloadItem = { -> downloadItem }
		downloader.metaClass._downloadMetadataItem = { -> metadataItem }

		def testRecord = [
		    wfsDownloadInfo: "some_info"
		]

		assertEquals( [downloadItem, metadataItem], downloader.getMatchingEntries(testRecord) )
	}

	void testWfsDownloadItem() {

		downloader.metaClass._wfsDownloadUrl = { "download_url" }

		def expectedItem = [
		    title: "imos:argo_floats data",
			preferredFname: "imos#argo_floats.csv",
			href: "download_url",
			type: "text/csv"
		]

		assertEquals expectedItem, downloader._wfsDownloadItem()
	}

	void testDownloadMetadataItem() {

		downloader.metaClass._metadataUrl = { "download_url" }

		def expectedItem = [
			title: "imos:argo_floats metadata",
			preferredFname: "imos#argo_floats_metadata.xml",
			href: "download_url",
			type: "application/xml"
		]

		assertEquals expectedItem, downloader._downloadMetadataItem()
	}

	void testWfsDownloadUrl() {

		downloader.metaClass._wfsQueryArgs = { "query_string" }

		assertEquals "something.com/wfs/service?query_string", downloader._wfsDownloadUrl()
	}

	void testMetadataUrl() {

		assertEquals "metadata_url", downloader._metadataUrl()
	}

	void testWfsQueryArgs() {

		def expectedValue = [
			typeName: 'imos:argo_floats',
			SERVICE: 'WFS',
			outputFormat: 'csv',
			REQUEST: 'GetFeature',
			VERSION: '1.0.0'
		]
		def testCql = 'red_thing = on'

		assertEquals expectedValue, downloader._wfsQueryArgs()

		downloader.info.cqlFilter = testCql
		expectedValue.CQL_FILTER = testCql

		assertEquals expectedValue, downloader._wfsQueryArgs()
	}

	void testDownloadItemTitle() {

		assertEquals "imos:argo_floats data", downloader._wfsDownloadItemTitle()

		downloader.info.cqlFilter = "oxygen_sensor = true"

		assertEquals "Filtered imos:argo_floats data", downloader._wfsDownloadItemTitle()
	}

	void testMetadataItemTitle() {

		assertEquals "imos:argo_floats metadata", downloader._metadataItemTitle()
	}

	void testSanitiseFilename() {

		assertEquals "imos#argo_floats", downloader._sanitiseFilename()

		downloader.info.layerName = ""

		assertEquals "", downloader._sanitiseFilename()
	}
}
