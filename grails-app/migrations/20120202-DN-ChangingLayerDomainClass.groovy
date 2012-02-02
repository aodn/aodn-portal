databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1328155814364-9") {
		dropNotNullConstraint(columnDataType: "VARCHAR(225)", columnName: "name", tableName: "layer")
	}

	changeSet(author: "dnahodil (generated)", id: "1328155814364-10") {
		dropNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "title", tableName: "layer")
	}

	changeSet(author: "dnahodil (generated)", id: "1328155814364-16") {
		dropColumn(columnName: "title_used_as_name", tableName: "layer")
	}
}
