
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.deep.JSON

class ServerController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def checkLinksService
    def wmsScannerService
    def wfsScannerService

	def index = {
		redirect(action: "list", params: params)
	}

	def refreshList = {

		flash.message = ""

		redirect actionName: 'list'
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 20, 100)

        [serverInstanceList: Server.list(params), serverInstanceTotal: Server.count(), jobProperties: scannerStatus]
	}

    def listAllowDiscoveriesAsJson = {
        def layerInstanceList = Server.findAllByAllowDiscoveriesNotEqual(false)
        render layerInstanceList as JSON
    }

	def create = {
		def serverInstance = new Server()
		serverInstance.properties = params

        def allOwners = User.withCriteria{
            roles{
                eq('name', UserRole.SERVEROWNER)
            }
        }

		return [serverInstance: serverInstance, allOwners: allOwners]
	}

	def save = {
		def serverInstance = new Server(params)

		if (serverInstance.save(flush: true)) {
			flash.message = "${message(code: 'default.created.message', args: [message(code: 'server.label', default: 'Server'), serverInstance.id])}"
			redirect(action: "edit", id: serverInstance.id)
		}
		else {
			render(view: "create", model: [serverInstance: serverInstance])
		}
	}

	def edit = {
		def serverInstance = Server.get(params.id)
		if (!serverInstance) {
			flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'server.label', default: 'Server'), params.id])}"
			redirect(action: "list")
		}
		else {
			def serverOwnerRole = UserRole.findByName(UserRole.SERVEROWNER)
			def allOwners = serverOwnerRole.users

			return [serverInstance: serverInstance, allOwners: allOwners]
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
				redirect(action: "edit", id: serverInstance.id)
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
				redirect(action: "edit", id: params.id)
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

	def checkForBrokenLinks = {
		log.debug "Preparing to scan server with id=${params.server} and user email: ${params.userEmailAddress}"
		def result = checkLinksService.check(params.server, params.userEmailAddress)
		render result
	}

    def listByOwner = {

        def userInstance = User.current()
        if(userInstance) {
            def serverList = Server.withCriteria{
                owners{
                    eq('id', userInstance.id)
                }
            }

            def maps = [:]
            serverList.each(){
                def layerList = Layer.findAllByServer(it)
                maps[it] = layerList
            }

            if(serverList){
                render(view: "listByOwner", model: [maps: maps])
            }
        }
    }

    def getScannerStatus(){

        //list of discoverable, with a list of w[m,f]s jobs
        def serverMap = [:]

        //list of discoverable servers
        def discoverables = Server.findAllByAllowDiscoveries(true)
        def scannersContactable = new Boolean[2]

        [wmsScannerService, wfsScannerService].eachWithIndex {
            scannerService, index ->

            try{
                def jobList = scannerService.status
                discoverables.each(){ discoverable ->

                    if (serverMap[discoverable] == null){
                        serverMap.put(discoverable, [null, null])
                    }

                    jobList.each(){ job ->

                        def checkURL

                        //TODO: Change WFS scanner to use the same variable name for uri...
                        if(index == 0){
                            checkURL = job.uri
                        }
                        else{
                            checkURL = job.serverUrl
                        }

                        if(discoverable.uri == checkURL){
                            serverMap[discoverable][index] = job
                        }
                    }
                }

                scannersContactable[index] = true
            }
            catch(Exception e){
                log.debug(e.message)

				if (flash.message) {
					flash.message += "<hr>"
				}
				else {
					flash.message = ""
				}

                flash.message += "Cannot contact scanner ${scannerService.scannerBaseUrl} for a list of current jobs.  Please make sure server is contactable."
                scannersContactable[index]  = false
            }
        }

        return [serverMap: serverMap, wmsScannerContactable: scannersContactable[0], wfsScannerContactable: scannersContactable[1]]
    }
}
