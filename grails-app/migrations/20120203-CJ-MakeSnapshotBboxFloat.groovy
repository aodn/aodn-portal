databaseChangeLog = {

	changeSet(author: "craigj (generated)", id: "1328235761929-7") {
		modifyDataType(columnName: "maxx", newDataType: "FLOAT4(8,8)", tableName: "snapshot")
	}

	changeSet(author: "craigj (generated)", id: "1328235761929-8") {
		modifyDataType(columnName: "maxy", newDataType: "FLOAT4(8,8)", tableName: "snapshot")
	}

	changeSet(author: "craigj (generated)", id: "1328235761929-9") {
		modifyDataType(columnName: "minx", newDataType: "FLOAT4(8,8)", tableName: "snapshot")
	}

	changeSet(author: "craigj (generated)", id: "1328235761929-10") {
		modifyDataType(columnName: "miny", newDataType: "FLOAT4(8,8)", tableName: "snapshot")
	}

}
