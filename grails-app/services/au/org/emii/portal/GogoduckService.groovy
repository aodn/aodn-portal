package au.org.emii.portal

import grails.converters.JSON
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseException
import org.apache.http.util.EntityUtils

class GogoduckService extends AsyncDownloadService {

    static transactional = true

    def grailsApplication

    String registerJob(params) throws HttpResponseException {

        def jobParameters = params.jobParameters

        if (!jobParameters) {
            throw new Exception("No parameters passed to gogoduckService")
        }

        def responseText

        _gogoduckConnection().post([
            body: _roundUpEndTime(jobParameters),
            requestContentType: groovyx.net.http.ContentType.JSON
            ]) { response ->
                responseText = EntityUtils.toString(response.getEntity());
            }

        return responseText
    }

    def _gogoduckConnection() {

        def registerJobUrl = "${grailsApplication.config.gogoduck.url}/job/"

        return new HTTPBuilder(registerJobUrl)
    }

    // This is to compensate for a lack of precision in the timestamps that NcWMS publishes
    // (millisecond, whereas the NetCDF files can contain more precise timestamps).
    def _roundUpEndTime(jobParametersAsString) {

        def jobParameters = JSON.parse(jobParametersAsString)

        if (jobParameters?.subsetDescriptor?.temporalExtent?.end) {
            def endTime =
                jobParameters.subsetDescriptor.temporalExtent.end.replace('Z', '999Z')
            jobParameters.subsetDescriptor.temporalExtent.end = endTime

            return (jobParameters as JSON).toString()
        }

        return jobParametersAsString
    }
}
