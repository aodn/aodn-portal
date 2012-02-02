package au.org.emii.portal

import org.apache.shiro.SecurityUtils;
import org.springframework.jdbc.core.JdbcTemplate;

import grails.converters.JSON
    
class ConfigController {

	def dataSource
    
    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "edit")
    }
    
    def list = {
        
        // expect only one Config instance to exist
        def configInstance = Config.activeInstance();
        
        if(params.type == 'JSON') {
            // get instance now with all 'deep' details as a JSON string
            def x = (configInstance as JSON).toString()
			configInstance = massageConfigInstance(configInstance);
            // convert back to an generic object so we can add what we want
            def instanceAsGenericObj = JSON.parse(x)
            // add the fully expanded baselayer menu as layers
            instanceAsGenericObj['baselayerList'] = JSON.use("deep") {
				configInstance.baselayerMenu.getBaseLayers() as JSON
            }
			
			instanceAsGenericObj['defaultMenu'] = JSON.use('deep') {
				_getDisplayableMenu(configInstance.defaultMenu) as JSON
			}
			
			// add current user details
            def currentUser = SecurityUtils.getSubject()
            def principal = currentUser.getPrincipal()
            
            if (principal) {
                def userInstance = User.findByEmailAddress(principal)
                instanceAsGenericObj['currentUser'] = JSON.parse((userInstance as JSON).toString())
            }
			
            render(contentType: "application/json", text:  instanceAsGenericObj)
        }
        else {
            render(view: "show", model: [configInstance: configInstance])
        }
    }

    def create = {
        // only one instance allowed
        def configInstance;        
        if (Config.list().size() > 0) {
           configInstance = Config.activeInstance()
           flash.message = "ERROR: New Config cannot be created. There can only be one instance of the configuration"
           redirect(action: "edit")     
        }
        else {
            configInstance = new Config()
        }        
        configInstance.properties = params
        return [configInstance: configInstance]
    }

    def save = {
        def configInstance = new Config(params)
        // test that this is the first 
        if (Config.list().size() != 0) {
            flash.message = "ERROR: New Config not created. There can only be one instance of the configuration"
        }
        // test motd dates
        if (configInstance.enableMOTD) {
            if (configInstance.motdStart.after(configInstance.motdEnd)) {
                flash.message = "ERROR: The Message of the day Start Time is after the End Time"
            }
        }
        
        if (flash.message == "") {
            if (configInstance.save(flush: true)) {
                flash.message = message(code: 'default.created.message', args: [message(code: 'config.label', default: 'Config'), configInstance.id])
                redirect(action: "show", id: configInstance.id)
            }
            else {
                render(view: "create", model: [configInstance: configInstance])
            }
        }
        else{
            redirect(action: "list")
        }
    }

    def show = {
        def configInstance = Config.get(params.id)
        if (!configInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'config.label', default: 'Config'), params.id])
            redirect(action: "list")
        }
        else {
            [configInstance: configInstance]
        }
    }

    def edit = {
        // dont get params get the only instance
        def configInstance = Config.activeInstance()
        //def configInstance = Config.get(params.id)
        if (!configInstance) {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'config.label', default: 'Config'), 'existing config'])
            redirect(action: "list")
        }
        else {
            [configInstance: configInstance]
        }
    }

    def update = {
        def configInstance = Config.get(params.id)
        if (configInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (configInstance.version > version) {
                    
                    configInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'config.label', default: 'Config')] as Object[], "Another user has updated this Config while you were editing")
                    render(view: "edit", model: [configInstance: configInstance])
                    return
                }
            }
            configInstance.properties = params
            
            // test motd dates if enabled
            if (configInstance.enableMOTD) {
                // insist that end is after the start
                if (configInstance.motdStart.after(configInstance.motdEnd)) {
                    flash.message = "ERROR: The Message of the day Start Time is after the End Time"
                }
            }

            if (!configInstance.hasErrors() && configInstance.save(flush: true) && (flash.message == null)) {
                flash.message = message(code: 'default.updated.message', args: [message(code: 'config.label', default: 'Config'), configInstance.id])
                
            }
            render(view: "edit", model: [configInstance: configInstance])
           
         
            
        }
        else {
            flash.message = message(code: 'default.not.found.message', args: [message(code: 'config.label', default: 'Config'), params.id])
            redirect(action: "list")
        }
    }

    def delete = {
        // why should this happen. only one config should exist
        // well if there is more than one let it happen
        if (Config.list().size() > 1) {
            def configInstance = Config.get(params.id)
            if (configInstance) {
                try {
                    configInstance.delete(flush: true)
                    flash.message = message(code: 'default.deleted.message', args: [message(code: 'config.label', default: 'Config'), params.id])
                    redirect(action: "list")
                }
                catch (org.springframework.dao.DataIntegrityViolationException e) {
                    flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'config.label', default: 'Config'), params.id])
                    redirect(action: "show", id: params.id)
                }
            }
            else {
                flash.message = message(code: 'default.not.found.message', args: [message(code: 'config.label', default: 'Config'), params.id])
                redirect(action: "list")
            }
        }
    }
    
    // Proccess the Motd 
    // Process the defaultMenu - TODO
    private Config massageConfigInstance(configInstance) {
        
        def now = new Date()

        // test motd dates if enabled
        if (configInstance.enableMOTD) {
            // it is so check the dates
            if (configInstance.motdStart.after(now) || configInstance.motdEnd.before(now)) {
                configInstance.enableMOTD = false // value not for persisting
            }
        }
        return configInstance
    }
	
	def _getDisplayableMenu(menu) {
		def ids = _getServerIdsWithAvailableLayers()
		
		for (def iterator = menu.menuItems.iterator(); iterator.hasNext();) {
			def item = iterator.next()
			if ((item.layer && !_isLayerViewable(item.layer)) || (item.server && !ids.contains(item.server.id))) {
				iterator.remove()
			}
		}
		return menu
	}
	
	def _isLayerViewable(layer) {
		return layer.activeInLastScan && !layer.blacklisted
	}
	
	def _getServerIdsWithAvailableLayers() {
		// We don't explicitly map layers to servers so dropping to JDBC
		def template = new JdbcTemplate(dataSource)
		def query = 
"""\
select server.id
from server
join layer on layer.server_id = server.id
where not layer.blacklisted and layer.active_in_last_scan
group by server.id\
"""
		
		def ids = []
		template.queryForList(query).each { row ->
			ids << row.id
		}
		return ids
	}
}
