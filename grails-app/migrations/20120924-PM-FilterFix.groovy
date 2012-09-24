databaseChangeLog = {

	changeSet(author: "pmak (generated)", id: "1348452194157-1") {
		addColumn(tableName: "filter") {
			column(name: "filter_values", type: "varchar(255)")
		}
	}

	changeSet(author: "pmak (generated)", id: "1348452194157-2") {
		dropColumn(columnName: "values", tableName: "filter")
	}
}
