databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1324426555592-1") {
		addColumn(tableName: "config") {
			column(name: "footer_content", type: "TEXT")
		}
	}
}