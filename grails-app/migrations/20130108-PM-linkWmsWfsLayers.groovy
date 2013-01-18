databaseChangeLog = {

	changeSet(author: "pmak (generated)", id: "1357622553620-1") {
		addColumn(tableName: "layer") {
			column(name: "wfs_layer_id", type: "int8")
		}
	}


	changeSet(author: "pmak (generated)", id: "1357622553620-11") {
		dropColumn(columnName: "wfs_layer_id", tableName: "filter")
	}
}
