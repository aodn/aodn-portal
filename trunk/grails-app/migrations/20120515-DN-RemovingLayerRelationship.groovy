databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1337036794221-1") {
        createTable(tableName: "layer_metadata_url") {
            column(name: "layer_metadata_urls_id", type: "int8")

            column(name: "metadata_url_id", type: "int8")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1337036794221-9") {
        addForeignKeyConstraint(baseColumnNames: "layer_metadata_urls_id", baseTableName: "layer_metadata_url", constraintName: "FKF589C08DFF9CD945", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "layer", referencesUniqueColumn: "false")
    }

    changeSet(author: "dnahodil (generated)", id: "1337036794221-10") {
        addForeignKeyConstraint(baseColumnNames: "metadata_url_id", baseTableName: "layer_metadata_url", constraintName: "FKF589C08D103E2A3B", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "metadata_url", referencesUniqueColumn: "false")
    }

    changeSet(author: "dnahodil (generated)", id: "1337036794221-11") {
        dropColumn(columnName: "meta_url", tableName: "layer")
    }

    changeSet(author: "dnahodil (generated)", id: "1337036794221-12") {
        dropColumn(columnName: "layer_id", tableName: "metadata_url")
    }
}
