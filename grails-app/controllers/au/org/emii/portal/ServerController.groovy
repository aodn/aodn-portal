
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.converters.deep.JSON
import org.apache.shiro.SecurityUtils
import au.org.emii.portal.scanner.*

class ServerController {

	static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

	def checkLinksService
    def wmsScannerService
    def wfsScannerService

	def index = {
		redirect(action: "list", params: params)
	}

	def list = {
		params.max = Math.min(params.max ? params.int('max') : 20, 100)

        def jobProperties = getScannerStatus()

		[serverInstanceList: Server.list(params), serverInstanceTotal: Server.count(), jobProperties:  jobProperties]
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
            def allOwners = User.withCriteria{
                roles{
                    eq('name', UserRole.SERVEROWNER)
                }
            }

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
        //show servers

        //callout to check status of WMS server
        def wmsList
        //callout to check the status of WFS servers
        def wfsList

        //list of discoverable servers
        def serverMap = [:]

        def wmsScannerContactable = true
        def wfsScannerContactable = true

        try{
            wmsList = wmsScannerService.getStatus()

        }
        catch(Exception e){
            flash.message = "Cannot contact WMS scanner for a list of current jobs.  Please make sure WMS server is contactable"
            wmsScannerContactable = false
        }

        try{
            wfsList =  wfsScannerService.getStatus()
        }
        catch(Exception e){
            flash.message = "Cannot contact WFS scanner for a list of current jobs.  Please make sure WFS server is contactable"
            wfsScannerContactable = false
        }

        def discoverables = Server.findAllByAllowDiscoveries(true)

        discoverables.each(){ discoverable ->
            def wmsJob = null
            def wfsJob = null
            wmsList.each(){ job ->
                if(job.uri == discoverable.uri){
                    wmsJob = job
                }
            }

            wfsList.each(){ job ->
                if(job.serverUrl == discoverable.uri){
                    wfsJob = job
                }
            }

            serverMap.put(discoverable, [wmsJob, wfsJob])
        }

        return [serverMap: serverMap, wmsScannerContactable: wmsScannerContactable, wfsScannerContactable: wfsScannerContactable]
    }
}
