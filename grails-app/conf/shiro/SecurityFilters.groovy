package shiro

/**
 * Generated by the Shiro plugin. This filters class protects all URLs
 * via access control by convention.
 */
class SecurityFilters {
    def filters = {
        
        homeAccess(controller: "home", action: "*") {
            before = {
            
                logRequest("homeAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
               
        configAccess(controller: "config", action: "list") {
            before = {
                
                logRequest("configAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
        
        depthAccess(controller: "depth", action: "*") {
            before = {
                
                logRequest("depthAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
        
        serverAccess(controller: "server", action: "list|listAllowDiscoveriesAsJson") {
            before = {
                
                logRequest("serverAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
        
        layerAccess(controller: "layer", action: "list|listBaseLayersAsJson|listNonBaseLayerAsJson|showLayerByItsId") {
            before = {
                
                logRequest("layerAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
        
        proxyAccess(controller: "proxy", action: "index") {
            before = {
                
                logRequest("proxyAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
        
        downloadAccess(controller: "download", action: "downloadFromCart") {
            before = {
                
                logRequest("downloadAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
        
        authAccess(controller: "auth", action: "login|register|createUser|forgotPassword") {
            before = {
                
                logRequest("authAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
      
        all(uri: "/**") {
            before = {
                
                // Check if request has been allowed by another filter
                if (request.accessAllowed) return true            
                
                logRequest("all", controllerName, actionName)
                
                // Ignore direct views (e.g. the default main index page).
                if (!controllerName) return true
                                
                // Access control by convention.
                accessControl(auth: false) // "auth: false" means it will accept remembered users as well as those who logged-in in this session
            }
        }
    }
    
    private void logRequest(String filterName, String controllerName, String actionName) {
        
        log.debug "Request matches ${filterName} filter. Request: controllerName = '${controllerName}', actionName = '${actionName}'."
    }
}