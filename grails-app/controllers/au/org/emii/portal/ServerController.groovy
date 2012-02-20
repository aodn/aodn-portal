package au.org.emii.portal

import grails.converters.deep.*
import groovyx.net.http.*

class ServerController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def checkLinksService

	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 10, 100)
		[serverInstanceList: Server.list(params), serverInstanceTotal: Server.count()]
	}
        
        def listAllowDiscoveriesAsJson = {
            def layerInstanceList = Server.findAllByAllowDiscoveriesNotEqual(false)
            render layerInstanceList as JSON
        }


	def create = {
		def serverInstance = new Server()
		serverInstance.properties = params
		return [serverInstance: serverInstance]
	}

	def save = {
		def serverInstance = new Server(params)

		if (serverInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'server.label', default: 'Server'), serverInstance.id])}"
			redirect(action: "show", id: serverInstance.id)
		}
		else {
			render(view: "create", model: [serverInstance: serverInstance])
		}
	}


	def show = {
		def serverInstance = Server.get(params.id)
		if (!serverInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'server.label', default: 'Server'), params.id])}"
			redirect(action: "list")
		}
		else {
			[serverInstance: serverInstance]
		}
	}

	def edit = {
		def serverInstance = Server.get(params.id)
		if (!serverInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'server.label', default: 'Server'), params.id])}"
			redirect(action: "list")
		}
		else {
			return [serverInstance: serverInstance]
		}
	}

	def update = {
		def serverInstance = Server.get(params.id)
		if (serverInstance) {
			if (params.version) {
				def version = params.version.toLong()
				if (serverInstance.version > version) {

					serverInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
						message(code: 'server.label', default: 'Server')]
					as Object[], "Another user has updated this Server while you were editing")
					render(view: "edit", model: [serverInstance: serverInstance])
					return
				}
			}
			serverInstance.properties = params

			if (!serverInstance.hasErrors() && serverInstance.save(flush: true)) {
				flash.message = "${message(code: 'default.updated.message', args: [message(code: 'server.label', default: 'Server'), serverInstance.id])}"
				redirect(action: "show", id: serverInstance.id)
			}
			else {
				render(view: "edit", model: [serverInstance: serverInstance])
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'server.label', default: 'Server'), params.id])}"
			redirect(action: "list")
		}
	}

	def delete = {
		def serverInstance = Server.get(params.id)
		if (serverInstance) {
			try {
				serverInstance.delete()
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'server.label', default: 'Server'), params.id])}"
				redirect(action: "list")
			}
			catch (org.springframework.dao.DataIntegrityViolationException e) {
				flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'server.label', default: 'Server'), params.id])}"
				redirect(action: "show", id: params.id)
			}
		}
		else {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'server.label', default: 'Server'), params.id])}"
			redirect(action: "list")
		}
	}


	def showServerByItsId = {

		def serverInstance = null
		// unencode layerId as per 'listAllLayers' to get just the id
		if (params.serverId != null) {
			def serverIdArr = params.serverId.split("_")
			serverInstance = Server.get( serverIdArr[ serverIdArr.size() - 1 ])
		}
		if (serverInstance) {
			render serverInstance as JSON
		}
		else {
			render  ""
		}
	}


	def selectServerToCheckLinks = {

	}

	def checkForBrokenLinks = {
		log.debug "Preparing to scan server with id=${params.server}"
		def result = checkLinksService.check(params.server)
		render result
	}

	def listAsJSON
}
