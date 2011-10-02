package au.org.emii.portal

class AdminController {

    def index = { 
        redirect(action: "edit", controller: "config", params: params)
    }
}
