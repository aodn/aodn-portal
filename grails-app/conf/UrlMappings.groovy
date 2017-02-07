class UrlMappings {

    static mappings = {

        "/proxy"(controller: "proxy", action: "index")
        "/sitemap/**"(controller: "sitemap", action: "index")

        "/$controller/$action?/$id?"{
            constraints {
                // apply constraints here
            }
        }

        "/" { controller = "landing" }

        "500"(view:'/error')

        //This uses SystemController to allow individual controllers to
        //add in their own handlers.  In the controller, add the closure "beforeInterceptor" to
        //to handle error, instead of writing try/catch blocks.  See AuthController.groovy.
        "404"(controller:'system', action:'/error')

        "/robots.txt" (view: "/robots")
    }
}
