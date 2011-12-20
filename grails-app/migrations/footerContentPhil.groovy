databaseChangeLog = {

	changeSet(author: "pmbohm (generated)", id: "1324354836761-1") {
		dropNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_password", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-2") {
		dropNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_schema", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-3") {
		dropNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_table", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-4") {
		dropNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_url", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-5") {
		dropNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "depth_user", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-6") {
		dropNotNullConstraint(columnDataType: "bool", columnName: "enablemotd", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-7") {
		modifyDataType(columnName: "footer_content", newDataType: "TEXT", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-8") {
		modifyDataType(columnName: "motd_end", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-9") {
		dropNotNullConstraint(columnDataType: "TIMESTAMP WITH TIME ZONE", columnName: "motd_end", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-10") {
		dropNotNullConstraint(columnDataType: "int8", columnName: "motd_id", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-11") {
		modifyDataType(columnName: "motd_start", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-12") {
		dropNotNullConstraint(columnDataType: "TIMESTAMP WITH TIME ZONE", columnName: "motd_start", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-13") {
		dropNotNullConstraint(columnDataType: "bool", columnName: "use_depth_service", tableName: "config")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-14") {
		modifyDataType(columnName: "edit_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "menu")
	}

	changeSet(author: "pmbohm (generated)", id: "1324354836761-15") {
		modifyDataType(columnName: "parse_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "server")
	}
}
