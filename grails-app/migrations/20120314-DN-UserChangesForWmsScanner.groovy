databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1331702785154-2", failOnError: true) {
        dropColumn(columnName: "wms_scanner_callback_username", tableName: "config")
		
		// Remove LayerApiUser role and the pre-configured User
		delete(tableName: "user_role_permissions") {
			
			where "user_role_id = 94"
		}
		
		delete(tableName: "portal_user_roles") {
			
			where "user_role_id = 94"
		}
		
		delete(tableName: "user_role") {
			
			where "id = 94"
		}
		
		delete(tableName: "portal_user") {
		
			where "id = 95"
		}
    }
}