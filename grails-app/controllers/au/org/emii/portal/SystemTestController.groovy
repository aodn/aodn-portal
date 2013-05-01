package au.org.emii.portal

import org.apache.log4j.LogManager
import org.apache.log4j.Logger

class SystemTestController {

	def controls = {

		[log4jConfigSummary: _log4jConfigSummary()]
	}

	def throwException = {

		throw new Exception(messageText)
	}

	def writeTraceMessage = {

		log.trace messageText
		render messageText
	}

	def writeDebugMessage = {

		log.debug messageText
		render messageText
	}

	def writeInfoMessage = {

		log.info messageText
		render messageText
	}

	def writeWarnMessage = {

		log.warn messageText
		render messageText
	}

	def writeErrorMessage = {

		log.error messageText
		render messageText
	}

	def writeFatalMessage = {

		log.fatal messageText
		render messageText
	}

	def sendEmail = {

		sendMail {
			to User.current().emailAddress
			subject "Test email from ${grailsApplication.config.grails.serverURL}"
			body messageText
			from grailsApplication.config.portal.systemEmail.fromAddress
		}

		render messageText
	}

	def getMessageText() {

		return "(${new Date()}) System test initiated by: ${User.current()}"
	}

	def _log4jConfigSummary() {

		// Reference: https://github.com/burtbeckwith/grails-app-info/blob/master/grails-app/services/grails/plugins/appinfo/Log4jInfoService.groovy

		def allAppenders = [] as Set
		def root = Logger.rootLogger

		if (root.allAppenders) {

			allAppenders.addAll root.allAppenders.toList()
		}

		for (logger in LogManager.currentLoggers) {
			if (logger.allAppenders) {
				allAppenders.addAll logger.allAppenders.toList()
			}
		}

		def s = ""

		allAppenders.each{
			appender ->

			s += "<h4>${appender.name}</h4>"

			s += "<ul>"

			appender.properties.each {
				s += "<li>$it</li>"
			}

			s += "</ul><br />"
		}

		return s
	}
}
