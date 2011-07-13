class UrlMappings {

	static mappings = {
		"/$controller/$action?/$id?"{
			constraints {
				// apply constraints here
			}
		}

		"/"{  controller="/home"  }
        
		"500"(view:'/error')
	}
}
