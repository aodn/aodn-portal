databaseChangeLog = {

	preConditions {
		changeSetExecuted(id: "1327970556000-5", author: "tfotak (generated)", changeLogFile: "1327970556000.groovy")
	}
	
	changeSet(author: "tfotak (generated)", id: "1329200026000-1", failOnError: true) {
		addNotNullConstraint(columnDataType: "int4", columnName: "menu_position", tableName: "menu_item")
	}

	changeSet(author: "tfotak (generated)", id: "1329200026000-2", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "layer_id", baseTableName: "menu_item", constraintName: "FKA4FAA1F3F74BD9A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "layer", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1329200026000-3", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "server_id", baseTableName: "menu_item", constraintName: "FKA4FAA1F342B61D5A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "server", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1329200026000-4", failOnError: true) {
		dropColumn(columnName: "json", tableName: "menu")
	}
}
