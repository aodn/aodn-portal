databaseChangeLog = {

	changeSet(author: "jburgess (generated)", id: "1334552333873-1") {
		createTable(tableName: "search") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "search_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "name", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "owner_id", type: "int8") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "jburgess (generated)", id: "1334552333873-2") {
		createTable(tableName: "search_filter") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "search_filter_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "search_id", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "type", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "filters_idx", type: "int4")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1334552333873-3") {
		createTable(tableName: "search_filter_value") {
			column(name: "value", type: "int8")

			column(name: "value_idx", type: "VARCHAR(255)")

			column(name: "value_elt", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "jburgess (generated)", id: "1334552333873-12") {
		addUniqueConstraint(columnNames: "name", constraintName: "search_name_key", deferrable: "false", disabled: "false", initiallyDeferred: "false", tableName: "search")
	}

	changeSet(author: "jburgess (generated)", id: "1334552333873-17") {
		addForeignKeyConstraint(baseColumnNames: "owner_id", baseTableName: "search", baseTableSchemaName: "public", constraintName: "fkc9fa65a8e204c072", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "portal_user", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1334552333873-18") {
		addForeignKeyConstraint(baseColumnNames: "search_id", baseTableName: "search_filter", baseTableSchemaName: "public", constraintName: "fk40b835efb870473a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "search", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}
	
	changeSet(author: "jburgess (generated)", id: "1334552333873-19", failOnError: true) {
		insert(tableName: "user_role_permissions") {
			column(name: "user_role_id", valueComputed: "(select id from user_role where name = 'SelfRegisteredUser')")

			column(name: "permissions_string", value: "search:*")
		}
	}


}
