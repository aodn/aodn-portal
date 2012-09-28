databaseChangeLog = {

	changeSet(author: "pmak (generated)", id: "1348787790476-1") {
		addColumn(tableName: "snapshot_layer") {
			column(name: "cql", type: "varchar(255)")
		}
	}
}
