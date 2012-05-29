package shiro

import org.apache.shiro.SecurityUtils

/**
 * Generated by the Shiro plugin. This filters class protects all URLs
 * via access control by convention.
 */
class SecurityFilters {
    def filters = {

        catchRememberMeCookie(url:"/**") {

            before = {

                // Remove the rememberMe cookie
                request.cookies.find( { it.name == "rememberMe" } ).each {

                    getSession() // Ensure a Session exists before we start the response

                    log.info "Removing rememberMe cookie: ${it.value}"

                    it.maxAge = 0
                    response.addCookie it

                    def subject = SecurityUtils.subject

                    log.info "Logging user '${subject.principal}' out"
                    subject.logout()
                }
            }
        }

		homeAccess(controller: "home", action: "index|config") {
            before = {
            
                logRequest("homeAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }

        splashAccess(controller: "splash", action: "index|links|community") {
            before = {
            
                logRequest("splashAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
               
        configAccess(controller: "config", action: "viewport") {
            before = {
                
                logRequest("configAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }

        depthAccess(controller: "depth", action: "index") {
            before = {
                
                logRequest("depthAccess", controllerName, actionName)

                // Allow all access
                request.accessAllowed = true
            }
        }

        serverAccess(controller: "server", action: "listAllowDiscoveriesAsJson") {
            before = {
                
                logRequest("serverAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
        
        layerAccess(controller: "layer", action: "listBaseLayersAsJson|showLayerByItsId|findLayerAsJson|getFormattedMetadata|saveOrUpdate|server|configuredbaselayers|defaultlayers") {
            before = {
                
                logRequest("layerAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }
        
        menuAccess(controller: "menu", action: "json") {
            before = {

                logRequest("menuAccess", controllerName, actionName)

                // Allow all access
                request.accessAllowed = true
            }
        }
        
        proxyAccess(controller: "proxy", action: "index|cache|wmsOnly") {
            before = {
                
                logRequest("proxyAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }

        downloadCartAccess(controller: "downloadCart", action: "add|clear|getSize|download") {
            before = {
                
                logRequest("downloadCartAccess", controllerName, actionName)
                
                // Allow all access
                request.accessAllowed = true
            }
        }

        authAccess(controller: "auth", action: "*") { // The plugin makes all actions on this controller public anyway, this is just for completeness
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
                if (!accessControl(auth: false)) { // "auth: false" means it will accept remembered users as well as those who logged-in in this session

                    session.deniedUrl = request.forwardURI
                    return false
                }

                return true
            }
        }
    }
    
    private void logRequest(String filterName, String controllerName, String actionName) {
        
        log.debug "Request matches ${filterName} filter. Request: controllerName = '${controllerName}', actionName = '${actionName}'."
    }
}