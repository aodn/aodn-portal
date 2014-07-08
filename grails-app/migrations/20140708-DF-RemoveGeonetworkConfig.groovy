databaseChangeLog = {

	changeSet(author: "dfruehauf (generated)", id: "1404794100421-13") {
		dropColumn(columnName: "catalog_url", tableName: "config")
	}

}
