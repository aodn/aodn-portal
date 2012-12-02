databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1354252147741-1") {
		addColumn(tableName: "aodaac_job") {
			column(name: "expired", type: "bool")
		}

		update(tableName: "aodaac_job") {
			column(name: "expired", valueBoolean: "false")
		}

		addNotNullConstraint(tableName: "aodaac_job", columnName: "expired")
	}
}
