
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.downloadcart

import static au.org.emii.portal.UrlUtils.urlWithQueryString

class WfsLayerDownloader implements Downloader {

	def info

	def getMatchingEntries(record) {

		info = record.wfsDownloadInfo

		if (info) {

			return [_wfsDownloadItem(), _downloadMetadataItem()]
		}
		else {

			return []
		}
	}

	def _wfsDownloadItem() {

		[
			title: _wfsDownloadItemTitle(),
			preferredFname: _sanitiseFilename() + ".csv",
			href: _wfsDownloadUrl(),
			type: "text/csv" // Will be configurable later
		]
	}

	def _downloadMetadataItem() {

		[
			title: _metadataItemTitle(),
			preferredFname: _sanitiseFilename() + "_metadata.xml",
			href: _metadataUrl(),
			type: "application/xml"
		]
	}

	def _wfsDownloadUrl() {

		def serverWfsUrl = info.serverUri.replace("/wms", "/wfs")

		return urlWithQueryString(serverWfsUrl, _wfsQueryArgs())
	}

	def _metadataUrl() {

		return info.metadataUrl
	}

	def _wfsQueryArgs() {

		def queryArgs = [
			typeName: info.layerName,
			SERVICE: "WFS",
			outputFormat: "csv",
			REQUEST: "GetFeature",
			VERSION: "1.0.0" //This version has BBOX the same as WMS.
		]

		if (info.cqlFilter) {

			queryArgs.CQL_FILTER = info.cqlFilter
		}

		return queryArgs
	}

	def _wfsDownloadItemTitle() {

		def prefix = info.cqlFilter ? "Filtered " : ""

		return prefix + info.layerName + " data"
	}

	def _metadataItemTitle() {

		return info.layerName + " metadata"
	}

	def _sanitiseFilename() {

		return info.layerName.replace(":", "#")
	}
}
