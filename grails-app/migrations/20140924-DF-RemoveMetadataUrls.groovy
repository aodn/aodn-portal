databaseChangeLog = {

    changeSet(author: "dan (generated)", id: "1411522430276-1") {
        dropForeignKeyConstraint(baseTableName: "layer_metadata_url", baseTableSchemaName: "public", constraintName: "fkf589c08dff9cd945")
    }

    changeSet(author: "dan (generated)", id: "1411522430276-2") {
        dropColumn(columnName: "override_metadata_url", tableName: "layer")
    }

    changeSet(author: "dan (generated)", id: "1411522430276-3") {
        dropTable(tableName: "layer_metadata_url")
    }

    changeSet(author: "dan (generated)", id: "1411522430276-4") {
		dropTable(tableName: "metadata_url")
	}

}
