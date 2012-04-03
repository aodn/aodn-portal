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
		
		"/robots.txt" (view: "/robots")
	}
}
