package au.org.emii.portal
import grails.converters.*

class DepthController {
    
    static mapWith = "none"
    def depthService
    
    def index = {
        
        if (params.lat == null || params.lon == null) {
            render( text: "incorrect parameters supplied" )
        }
        else {
          // Portal configuration has connection details about service
          def configInstance = Config.activeInstance()

          if (configInstance.useDepthService) {
              
            params.config = configInstance
            render (text: depthService.getNearestDepth(params), contentType: "text/xml", encoding: "UTF-8")
          }
          else {
              render( text: "This service is unavailable" )
          }
            
        }
       
    }
}
