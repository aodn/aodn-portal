package au.org.emii.portal

class HomeController {
    //def scaffold = true

    def index = { 
      // this is the main portal entry
      // get the only instance of the config
      [configInstance: Config.activeInstance()]
    }
}
