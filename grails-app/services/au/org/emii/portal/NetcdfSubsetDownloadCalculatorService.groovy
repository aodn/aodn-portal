package au.org.emii.portal

import grails.converters.JSON

class NetcdfSubsetDownloadCalculatorService extends AsyncDownloadService {

    def grailsApplication

    def getConnection(params) {
        return _gogoduckConnection()
    }

    // todo remove this stub
    def stub(params) {
        return "// todo"
    }

    def _gogoduckConnection() {
        //def conn = new HTTPBuilder("${grailsApplication.config.gogoduck.url}/job/")
        //conn.contentType = groovyx.net.http.ContentType.JSON

        return conn
    }

    def getBody(params) {
        String.valueOf(_getJobParameters(params) as JSON)
    }

    def onResponseSuccess = { resp, json ->
        return json //as JSON
    }

    def _getJobParameters(params) {
        if (!params.jobParameters) {
            throw new Exception("No parameters passed to ${this.class.simpleName}")
        }

        return _roundUpEndTime(JSON.parse(params.jobParameters))
    }

    // This is to compensate for a lack of precision in the timestamps that NcWMS publishes
    // (millisecond, whereas the NetCDF files can contain more precise timestamps).
    def _roundUpEndTime(jobParams) {
        if (jobParams?.subsetDescriptor?.temporalExtent?.end) {
            def endTime =
                jobParams.subsetDescriptor.temporalExtent.end.replace('Z', '999Z')
            jobParams.subsetDescriptor.temporalExtent.end = endTime
        }

        return jobParams
    }
}



