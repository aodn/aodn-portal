databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1326762281860-5") {
		modifyDataType(columnName: "parse_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "server")
	}

	changeSet(author: "dnahodil (generated)", id: "1326762281860-6") {
		dropNotNullConstraint(columnDataType: "TIMESTAMP WITH TIME ZONE", columnName: "parse_date", tableName: "server")
	}
}
