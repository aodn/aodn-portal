import au.org.emii.portal.config.JsonMarshallingRegistrar

class BootStrap {

    def init = { servletContext ->
		JsonMarshallingRegistrar.registerJsonMarshallers()
    }
	
    def destroy = {
    }
}
