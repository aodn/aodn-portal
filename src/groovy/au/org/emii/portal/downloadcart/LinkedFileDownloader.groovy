
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.downloadcart

class LinkedFileDownloader {

	def getMatchingEntries(record) {

		record.downloadableLinks ?: []
	}
}
