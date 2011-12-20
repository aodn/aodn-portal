databaseChangeLog = {

	changeSet(author: "pmbohm (generated)", id: "1324362496992-1") {
		addColumn(tableName: "config") {
			column(name: "footer_content_width", type: "int4")
		}
	}

	changeSet(author: "pmbohm (generated)", id: "1324362496992-2") {
		modifyDataType(columnName: "motd_end", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324362496992-3") {
		modifyDataType(columnName: "motd_start", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324362496992-4") {
		modifyDataType(columnName: "edit_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "menu")
	}

	changeSet(author: "pmbohm (generated)", id: "1324362496992-5") {
		modifyDataType(columnName: "parse_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "server")
	}
}
