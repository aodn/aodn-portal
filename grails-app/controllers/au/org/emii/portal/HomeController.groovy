package au.org.emii.portal

import grails.util.Environment

class HomeController {

	def grailsApplication

    def index = { // This is the main portal entry

        def jsFileVersionNumber = grailsApplication.metadata.'app.svn.revision' ?: System.currentTimeMillis()

        [configInstance: Config.activeInstance(), buildInfo: _appBuildInfo(), jsVerNum: jsFileVersionNumber ]
    }
	
	def config = {
		// This nearly works but there is some sort of IllegalAccessException
		// deep in the bowels of an area we don't care about, so until that is
		// somehow resolved we need to add options we want to use manually :(
		//render grailsApplication.config as JSON
		render(contentType:"text/json") {
			/*
			 * We're aiming for something like the following
			 * 
			 * { grailsConfig: [
			 *     {name: 'config.key.1', value:'setting.1'},
        	 *     {name: 'config.key.2', value:'setting.2'}
			 *   ]
			 * }
			 */
			
			grailsConfig = [
				[ name: 'spatialsearch.url', value: grailsApplication.config.spatialsearch.url ]
				// To add another config add a column after the entry above and follow the same map format
			]
		}
	}

    def _appBuildInfo = {

        def md = grailsApplication.metadata

        if ( Environment.current == Environment.PRODUCTION ) {

            return "<!-- Portal version ${md['app.version']}, built ${md['app.build.date']?:"Unk."} -->"
        }

        return """\
<!--
    [Portal Build Info]
    Build date:    ${md['app.build.date'] ?: "Unk."}
    Version:       ${md['app.version']}
    Instance name: ${grailsApplication.config.instanceName}
    Environment:   ${Environment.current.name}
    Build:         #${md['app.build.number'] ?: "Unk."}
    SVN revision:  #${md['app.svn.revision'] ?: "Unk."}
    SVN URL:       ${md['app.svn.url'] ?: "Unk."}
-->"""
    }
}