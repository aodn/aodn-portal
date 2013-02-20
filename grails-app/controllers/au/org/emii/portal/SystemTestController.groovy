package au.org.emii.portal

import org.apache.shiro.SecurityUtils

class SystemTestController {

	def controls = {}

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

	def getMessageText() {

		def principal = SecurityUtils.subject?.principal
		def user = User.get( principal as Integer )

		return "System test initiated by: $user"
	}
}
