databaseChangeLog = {

	changeSet(author: "tfotak (generated)", id: "1325653962795-1") {
		addColumn(tableName: "layer") {
			column(name: "last_updated", type: "TIMESTAMP WITH TIME ZONE", defaultValueDate: "now()") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "tfotak (generated)", id: "1325653962795-2") {
		addColumn(tableName: "layer") {
			column(name: "parent_id", type: "int8")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1325653962795-3") {
		addColumn(tableName: "layer") {
			column(name: "title", type: "varchar(255)")
		}
		
		sql('update layer set title = name')
		addNotNullConstraint(columnDataType: "VARCHAR(255)", columnName: "title", tableName: "layer")
	}

	changeSet(author: "tfotak (generated)", id: "1325653962795-4") {
		dropNotNullConstraint(columnDataType: "varchar(255)", columnName: "name", tableName: "config")
	}

	changeSet(author: "tfotak (generated)", id: "1325653962795-5") {
		addForeignKeyConstraint(baseColumnNames: "parent_id", baseTableName: "layer", constraintName: "FK61FD551D8611FA1", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "layer", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1325653962795-6") {
		dropColumn(columnName: "keywords", tableName: "layer")
	}

	changeSet(author: "tfotak (generated)", id: "1325653962795-7") {
		dropColumn(columnName: "layers", tableName: "layer")
	}
}
