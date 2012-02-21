databaseChangeLog = {

	changeSet(author: "craigj (generated)", id: "1329713617374-1") {
		addColumn(tableName: "snapshot_layer") {
			column(defaultValueBoolean: "false", name: "animated", type: "bool") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "craigj (generated)", id: "1329713617374-2") {
		addColumn(tableName: "snapshot_layer") {
			column(name: "chosen_times", type: "VARCHAR(255)")
		}
	}
    
    changeSet(author: "craigj (generated)", id: "1329786589575-6") {
        addDefaultValue(tableName: "snapshot_layer", columnName: "styles", defaultValue: "")
        update(tableName: "snapshot_layer") {
            column(name: "styles", value: "")
            where: "styles is null"
        }
        addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "styles", tableName: "snapshot_layer")
    }

}
