databaseChangeLog = {

	changeSet(author: "tfotak (generated)", id: "1344911233293-1", failOnError: true) {
		dropUniqueConstraint(tableName: "search", constraintName: "search_name_key")
	}

	changeSet(author: "tfotak (generated)", id: "1344911233293-2", failOnError: true) {
		addUniqueConstraint(columnNames: "owner_id, name", constraintName: "unique-name", tableName: "search")
	}
}
