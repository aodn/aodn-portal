package au.org.emii.portal.display

class ServerPresenter {

	def id
	def name
	
	ServerPresenter(domainServer) {
		id = domainServer.id
		name = domainServer.name
	}
}
