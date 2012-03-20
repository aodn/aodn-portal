
databaseChangeLog = {
	
	if (System.getProperty("INSTANCE_NAME") == 'IMOS') {
		// All IMOS specific change sets must appear inside this if block
		
		changeSet(author: "tfotak (generated)", id: "1332134693000-1", failOnError: true) {
			
			update(tableName: "config")
			{
				column(name:"name", value: "Integrated Marine Observing System")
				where "id = 1"
			}
		}
		
		changeSet(author: "tfotak (generated)", id: "1332201909000-1", failOnError: true) {
			
			update(tableName: "config")
			{
				column(name: "footer_content", value: '''<p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make inquiries via <a href="mailto:info@imos.org.au">info@imos.org.au</a> to be directed to the data custodian.</p>''')
				where "id = 1"
			}
		}
	}

}
