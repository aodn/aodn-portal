databaseChangeLog = {

	changeSet(author: "pmak (generated)", id: "1357619478600-1") {
		addColumn(tableName: "filter") {
			column(name: "wfs_layer_id", type: "int8")
		}
	}
}
