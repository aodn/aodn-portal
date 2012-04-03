databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1327875834545-1") {
		addColumn(tableName: "config") {
			column(name: "wms_scanner_callback_password", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "dnahodil (generated)", id: "1327875834545-2") {
		addColumn(tableName: "config") {
			column(name: "wms_scanner_callback_username", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "dnahodil (generated)", id: "1327875834545-5") {
		dropNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "wms_scanner_base_url", tableName: "config")
	}
}
