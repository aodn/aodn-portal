package au.org.emii.portal

import grails.test.*
import groovy.xml.MarkupBuilder
import org.joda.time.DateTime

class WpsControllerTests extends ControllerUnitTestCase {
    void testGetExecutionStatusUrl() {
        assertEquals(
            "the url?service=WPS&version=1.0.0&request=GetExecutionStatus&executionId=1234",
            controller._getExecutionStatusUrl(server: 'the url', uuid: '1234')
        )
    }

    void testRenderExecutionStatus() {
        controller.params.uuid = '1234'
        controller.metaClass.createLink = { 'http://the_link' }

        def (execResponse, expectedModel) = _getMockExecutionStatusResponseAndModel()

        controller._renderExecutionStatus(execResponse)

        assertEquals 'show', controller.renderArgs.view
        assertEquals expectedModel, controller.renderArgs.model
    }

    def _getMockExecutionStatusResponseAndModel() {
        def writer = new StringWriter()
        def execResponse = new MarkupBuilder(writer)
        execResponse.ExecuteResponse() {
            Status(creationTime: '1979-06-01T04:00+10:00') {
                SomeStatus('Process succeeded.')
            }
            ProcessOutputs {
                Output {
                    Title('Amazing download')
                    Reference(href: 'such wow')
                }
            }
        }

        def expectedModel = [
            job: [
                uuid: '1234',
                reportUrl: 'http://the_link',
                createdTimestamp: new DateTime('1979-06-01T04:00+10:00'),
                status: 'SomeStatus',
                downloadTitle: 'Amazing download',
                downloadUrl: 'such wow'
            ]
        ]

        return [new XmlSlurper().parseText(writer.toString()), expectedModel]
    }

    void testJobComplete() {
        controller.params.with {
            uuid = '1234'
            server = 'http://wps.ftw'
            email = [ to: 'user@example.com' ]
        }

        def notifyViaEmailCalled = false
        def notifyViaEmailParams

        controller.wpsService = [
            notifyViaEmail: { params ->
                notifyViaEmailCalled = true
                notifyViaEmailParams = params
            }
        ]

        controller.jobComplete()

        assertTrue notifyViaEmailCalled
        assertEquals([
            uuid: '1234',
            server: 'http://wps.ftw',
            email: [
                to: 'user@example.com',
                subject: 'IMOS subsetting complete - 1234',
                template: 'jobComplete'
            ]
        ], notifyViaEmailParams)
    }
}
