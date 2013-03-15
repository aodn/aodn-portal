package au.org.emii.portal

class ScannerController {

    def wmsScannerController = new WmsScannerController()
    def wfsScannerController = new WfsScannerController()

    def index = {
        //show servers

        //callout to check status of WMS server
        def wmsList
        //callout to check the status of WFS servers
        def wfsList

        //list of discoverable servers
        def serverMap = [:]

        try{
            wmsList = wmsScannerController.getStatus()
        }
        catch(Exception e){
            flash.message = "Cannot contact WMS scanner for a list of current jobs.  Please make sure WMS server is contactable"
            return [serverMap: serverMap]
        }

        try{
            wfsList =  wfsScannerController.getStatus()
        }
        catch(Exception e){
            flash.message = "Cannot contact WFS scanner for a list of current jobs.  Please make sure WFS server is contactable"
            return [serverMap: serverMap]
        }

        def discoverables = Server.findAllByAllowDiscoveries(true)

        discoverables.each(){ discoverable ->
            def wmsJob = null
            def wfsJob = null
            wmsList.each(){ job ->
                if(job.uri == discoverable.uri){
                    wmsJob = job
                }
            }

            wfsList.each(){ job ->
                if(job.serverUrl == discoverable.uri){
                    wfsJob = job
                }
            }

            serverMap.put(discoverable, [wmsJob, wfsJob])
        }

        return [serverMap: serverMap]
    }

    def callRegisterWMS = {
        forward(controller: "wmsScanner", action: "callRegister", params: params)
    }

    def callRegisterWFS = {
        forward(controller: "wfsScanner", action: "callRegister", params: params)
    }
}
