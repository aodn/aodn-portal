databaseChangeLog = {

	changeSet(author: "jburgess (generated)", id: "1324527263866-1") {
		createTable(tableName: "snapshot") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "snapshot_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "TEXT")

			column(name: "name", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "owner_id", type: "int8") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "jburgess (generated)", id: "1324527263866-2") {
		modifyDataType(columnName: "motd_end", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324527263866-3") {
		modifyDataType(columnName: "motd_start", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "config")
	}

	changeSet(author: "jburgess (generated)", id: "1324527263866-4") {
		modifyDataType(columnName: "edit_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "menu")
	}

	changeSet(author: "jburgess (generated)", id: "1324527263866-5") {
		modifyDataType(columnName: "parse_date", newDataType: "TIMESTAMP WITH TIME ZONE", tableName: "server")
	}

	changeSet(author: "jburgess (generated)", id: "1324527263866-6") {
		addForeignKeyConstraint(baseColumnNames: "owner_id", baseTableName: "snapshot", baseTableSchemaName: "public", constraintName: "fk10fad5c4e204c072", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "portal_user", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}
}
