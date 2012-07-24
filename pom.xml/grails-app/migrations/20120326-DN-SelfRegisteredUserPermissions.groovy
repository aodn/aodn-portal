databaseChangeLog = {

	changeSet(author: "dnahodil", id: "1332722929000-1", failOnError: true) {
		
		// Ensure SelfRegisteredUser has correct permissions
		
		delete(tableName: "user_role_permissions") {
			
			where "user_role_id = 13"
		}
		
		insert(tableName: "user_role_permissions") {
		
			column(name: "user_role_id", valueNumeric: "13")
			column(name: "permissions_string", value: "user:updateAccount")
		}
		
		insert(tableName: "user_role_permissions") {
		
			column(name: "user_role_id", valueNumeric: "13")
			column(name: "permissions_string", value: "user:userUpdateAccount")
		}
	}
}