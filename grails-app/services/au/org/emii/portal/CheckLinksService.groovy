
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

class CheckLinksService {

	static transactional = true

	def serviceMethod() {
	}

	String check(String id, String email) {
		// wrapper for quartz job
		CheckServerForBrokenLinksJob.triggerNow([serverId:id, userEmail:email])
		return "Job submitted for server id=${id} with report to be emailed to ${email}"
	}
}
