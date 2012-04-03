databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1329372554118-1") {
		addColumn(tableName: "layer") {
			column(name: "styles", type: "text", value: "")
		}
		
		addNotNullConstraint( tableName: "layer", columnName: "styles" )
	}

	changeSet(author: "dnahodil (generated)", id: "1329372554118-2") {
		dropColumn(columnName: "style", tableName: "layer")
	}
}