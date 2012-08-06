databaseChangeLog = {

	changeSet(author: "pmak (generated)", id: "1339723767663-1") {
		addColumn(tableName: "layer") {
			column(name: "override_metadata_url", type: "varchar(255)")
		}
	}
}
