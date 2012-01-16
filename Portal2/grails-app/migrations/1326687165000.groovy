databaseChangeLog = {

	changeSet(author: "tfotak", id: "1326687165000-1", failOnError: true) {
		dropColumn(columnName: "parse_frequency", tableName: "server")
	}
	
	changeSet(author: "tfotak", id: "1326687165000-2", failOnError: true) {
		addColumn(tableName: "server") {
			column(name: "parse_frequency", type: "int4", defaultValueNumeric: "0")
			constraints(nullable: "false")
		}
	}
}
