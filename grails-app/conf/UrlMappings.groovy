
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

		"/"{  controller="home"  }
        "/admin"{  controller="config"  }
        "/administration"{  controller="config"  }

		"500"(view:'/error')

        //This uses SystemController to allow individual controllers to
        //add in their own handlers.  In the controller, add the closure "beforeInterceptor" to
        //to handle error, instead of writing try/catch blocks.  See AuthController.groovy.
        "404"(controller:'system', action:'/error')
		
		"/robots.txt" (view: "/robots")
	}
}
