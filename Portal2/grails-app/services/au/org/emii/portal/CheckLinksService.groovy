package au.org.emii.portal

class CheckLinksService {

    static transactional = true

    def serviceMethod() {

    }
	
	String check(String id) {
		
		CheckServerForBrokenLinksJob.triggerNow([serverId:id])
		

		return "Job submitted for server id=${id}"
		}
}
