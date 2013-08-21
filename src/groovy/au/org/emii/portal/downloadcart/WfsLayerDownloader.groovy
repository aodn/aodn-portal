
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.downloadcart

import static au.org.emii.portal.UrlUtils.*

class WfsLayerDownloader {

	def info

	def getMatchingEntries(record) {

		if (record.wfsDownloadInfo) {

			info = record.wfsDownloadInfo

			return _wfsDownloadItemFrom()
		}

		return []
	}

	def _wfsDownloadItemFrom() {

		[
			title: _wfsItemTitle(),
			preferredFname: _sanitiseFileName(info.layerName) + ".csv",
			href: _wfsUrlFrom(),
			type: "text/csv" // Will be configurable later
		]
	}

	def _wfsUrlFrom() {

		def serverWfsUrl = info.serverUri.replace("/wms", "/wfs")

		return makeUrl(serverWfsUrl, _wfsQueryArgs())
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

	def _wfsItemTitle() {

		def prefix = info.cqlFilter ? "Filtered " : ""

		return prefix + info.layerName + " data"
	}

	static def _sanitiseFileName(name) {

		return name.replace(":", "#")
	}
}
