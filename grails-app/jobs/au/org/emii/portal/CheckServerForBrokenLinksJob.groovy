package au.org.emii.portal


class CheckServerForBrokenLinksJob {
	
		def repeatCount = 0

		def execute(context) {
			if (context.mergedJobDataMap.get('serverId') == null) {
				return
			}
			   
			println "Starting CheckServerForBrokenLinksJob with server id = " + context.mergedJobDataMap.get('serverId')
			
			def foundServer = Server.get(context.mergedJobDataMap.get('serverId'))
			
			if (!foundServer.type.contains("WMS")) {
				return
			}
			
			println "uri = " + foundServer.uri + " type = " + foundServer.type
		}
	  }
	
	
	
