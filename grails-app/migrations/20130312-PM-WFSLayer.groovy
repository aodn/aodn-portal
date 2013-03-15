databaseChangeLog = {

	changeSet(author: "pmak (generated)", id: "1363041563004-1") {
		addColumn(tableName: "filter") {
			column(name: "download_only", defaultValue: "false", type: "bool") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "pmak (generated)", id: "1363041563004-2") {
		addColumn(tableName: "layer") {
			column(name: "wfs_layer_id", type: "int8")
            constraints(nullable: "true")
		}
	}
}
