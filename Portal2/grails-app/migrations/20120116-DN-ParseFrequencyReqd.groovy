databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1326666289740-6") {

		addNotNullConstraint(columnDataType: "int4", columnName: "parse_frequency", tableName: "server", defaultNullValue: "0")
	}
}
