databaseChangeLog = {

	changeSet(author: "pmbohm (generated)", id: "1324443517801-1") {
		modifyDataType(columnName: "motd_end", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324443517801-2") {
		modifyDataType(columnName: "motd_start", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324443517801-3") {
		modifyDataType(columnName: "name", newDataType: "VARCHAR(255)", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324443517801-4") {
		modifyDataType(columnName: "edit_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "menu")
	}

	changeSet(author: "pmbohm (generated)", id: "1324443517801-5") {
		modifyDataType(columnName: "parse_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "server")
	}
}
