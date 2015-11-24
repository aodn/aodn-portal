package au.org.emii.portal

import grails.test.ControllerUnitTestCase
import groovy.xml.MarkupBuilder
import org.joda.time.DateTime

class WpsControllerTests extends ControllerUnitTestCase {

    @Override
    void setUp() {
        super.setUp()

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

        assertEquals 'show', controller.renderArgs.view
        assertEquals expectedModel.toString(), controller.renderArgs.model.toString()
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
                reportUrl       : 'http://the_link',
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

        controller.jobComplete(mockParams)

        assertTrue notifyViaEmailCalled
    }
}
