databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1328219865643-1") {
		addColumn(tableName: "layer") {
			column(name: "namespace", type: "VARCHAR(255)")
		}
	}
}
