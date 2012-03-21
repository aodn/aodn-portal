databaseChangeLog = {

	changeSet(author: "dnahodil", id: "1332223306000-1", failOnError: true) {
		
		dropColumn(columnName: "application_base_url", tableName: "config")
	}
	
	changeSet(author: "dnahodil", id: "1332223306000-2", failOnError: true) {
				
		update(tableName: "config")
		{
			column(name:"wms_scanner_callback_username", value: "developers@emii.org.au")
			where "wms_scanner_callback_username like 'dnahodil+layerapitest1@gmail.com'"
		}
	}
	
	changeSet(author: "dnahodil", id: "1332223306000-3", failOnError: true) {
		
		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "10")

			column(name: "user_role_id", valueNumeric: "11")
		}
	}
	
	changeSet(author: "dnahodil", id: "1332223306000-4", failOnError: true) {
		
		update(tableName: "server") {
			column(name: "last_scan_date", valueDate: null)
			where "last_scan_date < '2012-03-17 00:00:00.000+11'"
		}
	}

    changeSet(author: "dnahodil", id: "1332223306000-5", failOnError: true) {

        dropColumn(columnName: "wms_scanner_base_url", tableName: "config")
    }
}