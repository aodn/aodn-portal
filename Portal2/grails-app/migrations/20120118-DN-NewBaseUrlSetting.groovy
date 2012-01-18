databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1326858684567-1") {
		addColumn(tableName: "config") {
			column(name: "application_base_url", type: "VARCHAR(255)")
		}
		
		addNotNullConstraint(tableName: "config", columnName: "application_base_url", defaultNullValue: "http://localhost:8080/Portal2/")
	}
}
