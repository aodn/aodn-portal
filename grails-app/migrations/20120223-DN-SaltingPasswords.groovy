databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1329972466515-1", failOnError: true) {
	
        addColumn(tableName: "portal_user") {
            column(name: "password_salt", type: "char(44)", value: "zNWFeJrrGvKbqtwdrtK5ygnaAiwdZfVjeKKiCBDhwas=")
        }
		
		addNotNullConstraint( tableName: "portal_user", columnName: "password_salt" )
    }
	
	changeSet(author: "dnahodil (generated)", id: "1329972466515-2", failOnError: true) {
	
        update(tableName: "portal_user")
		{
			column(name:"password_hash", value: "db1fe3bec813ef22318a095802627c532610fb030d7ed47db808dc748979b989")
		}
    }
}