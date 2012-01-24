databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1327365466504-1") {
		addColumn(tableName: "layer") {
			column(name: "data_source", type: "VARCHAR(255)", value: "Unknown" )
		}
		
		addNotNullConstraint( tableName: "layer", columnName: "data_source" )
	}

	changeSet(author: "dnahodil (generated)", id: "1327365466504-8") {
		dropColumn(columnName: "source", tableName: "layer")
	}
}
