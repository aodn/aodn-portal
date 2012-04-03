package au.org.emii.portal.display

class Server {

	def id
	def name
	
	Server(domainServer) {
		id = domainServer.id
		name = domainServer.name
	}
}
