databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1326421465682-3") {
		modifyDataType(columnName: "last_updated", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "layer")
	}

	changeSet(author: "dnahodil (generated)", id: "1326421465682-4") {
		dropNotNullConstraint(columnDataType: "TIMESTAMP WITH TIME ZONE", columnName: "last_updated", tableName: "layer")
		
		addColumn(tableName: "layer") {
			column(name: "title_used_as_name", type: "bool") {
				constraints(nullable: "true")
			}
		}
	}
}
