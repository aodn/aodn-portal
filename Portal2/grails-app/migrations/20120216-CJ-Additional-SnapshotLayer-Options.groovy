databaseChangeLog = {

	changeSet(author: "craigj (generated)", id: "1329363967678-1") {
		addColumn(tableName: "snapshot_layer") {
			column(name: "opacity", type: "FLOAT4(8,8)")
		}
	}

	changeSet(author: "craigj (generated)", id: "1329363967678-2") {
		addColumn(tableName: "snapshot_layer") {
			column(name: "styles", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "craigj (generated)", id: "1329363967678-3") {
		addColumn(tableName: "snapshot_layer") {
			column(name: "title", type: "VARCHAR(255)")
		}
	}

}
