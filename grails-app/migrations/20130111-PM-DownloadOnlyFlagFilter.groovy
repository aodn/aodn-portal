databaseChangeLog = {

	changeSet(author: "pmak (generated)", id: "1357873740993-1") {
		addColumn(tableName: "filter") {
			column(name: "download_only", type: "bool", defaultValue: "false") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "pmak (generated)", id: "1357873740993-7") {
		addForeignKeyConstraint(baseColumnNames: "wfs_layer_id", baseTableName: "layer", constraintName: "FK61FD551B88AD7F5", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "layer", referencesUniqueColumn: "false")

    }
}
