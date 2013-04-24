
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.util.Environment

class HomeController {

	def grailsApplication
	def portalInstance

    def index = { // This is the main portal entry

        // Intercept OpenID verification calls
        if ( params["openid.return_to"] ) {

            forward controller: "auth", action: "verifyResponse"
        }

        [
	        configInstance: Config.activeInstance(),
	        buildInfo: _appBuildInfo(),
	        jsVerNum: grailsApplication.metadata.'app.version'
        ]
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
				[ name: 'spatialsearch.url', value: grailsApplication.config.spatialsearch.url ],
				[ name: 'facetedSearch.enabled', value: grailsApplication.config.facetedSearch.enabled ]
				// To add another config add a column after the entry above and follow the same map format
			]
		}
	}

    def _appBuildInfo = {

        def cfg = grailsApplication.config
        def md = grailsApplication.metadata

        if ( Environment.current == Environment.PRODUCTION ) {

            return "<!-- ${ portalInstance.name() } Portal v${ md.'app.version' }, build date: ${ md.'app.build.date' ?: "not recorded" } -->"
        }

        return """\
<!--
    [Portal Build Info]
    Base URL:      ${ cfg.grails.serverURL }
    Build date:    ${ md.'app.build.date' ?: "Unk." }
    Version:       ${ md.'app.version' }
    Instance name: ${ portalInstance.name() }
    Environment:   ${ Environment.current.name }
    Build:         #${ md.'app.build.number' ?: "Unk." }
    SVN revision:  #${ md.'app.svn.revision' ?: "Unk." }
    SVN URL:       ${ md.'app.svn.url' ?: "Unk." }
-->"""
    }
}
