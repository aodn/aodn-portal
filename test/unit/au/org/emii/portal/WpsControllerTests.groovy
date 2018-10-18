package au.org.emii.portal

import groovy.xml.MarkupBuilder
import org.joda.time.DateTime
import grails.test.mixin.TestFor

@TestFor(WpsController)
class WpsControllerTests {

    void setUp() {

        controller.hostVerifier = [
            allowedHost: { it =~ '.*allowedhost.*' }
        ]
    }

    void testRenderExecutionStatus() {
        controller.params.uuid = '1234'
        controller.params.status = 'great'
        controller.metaClass.createLink = { 'http://the_link' }
        controller.metaClass._getProxiedDownloadUrl = { 'proxied url' }

        def (execResponse, expectedModel) = _getMockExecutionStatusResponseAndModel()

        controller._renderExecutionStatus(execResponse)

        assertEquals '/wps/show', view.toString()
        assertEquals expectedModel.toString(), model.toString()
    }

    def _getMockExecutionStatusResponseAndModel() {
        def writer = new StringWriter()
        def execResponse = new MarkupBuilder(writer)
        execResponse.ExecuteResponse() {
            Status(creationTime: new DateTime('1979-06-01T04:00+10:00')) {
                SomeStatus('Process succeeded.')
            }
            ProcessOutputs {
                Output {
                    Title('Amazing download')
                    Reference(href: 'such wow')
                }
            }
        }

        def uuid = '1234'

        def expectedModel = [
            job: [
                uuid            : uuid,
                reportUrl       : 'http://localhost:8080/wps/jobReport?uuid=1234&status=Download+ready',
                createdTimestamp: new DateTime('1979-06-01T04:00+10:00'),
                status          : 'Download ready',
                downloadTitle   : 'IMOS download - ' + uuid,
                downloadUrl     : 'proxied url'
            ]
        ]

        return [new XmlSlurper().parseText(writer.toString()), expectedModel]
    }

    void testJobComplete() {

        controller.metaClass._getExecutionStatusResponse = { [name: {-> "notAnException" }]}

        def notifyViaEmailCalled = false
        def url = "http://allowedhost.com/aproxyurl"

        controller.wpsService = [
            _notifyDownloadViaEmail: {
                notifyViaEmailCalled = true
            },
            _getExecutionStatusUrl: {return url}
        ]

        params.successful = "true"
        controller.jobComplete(params)

        assertTrue notifyViaEmailCalled
    }
}
