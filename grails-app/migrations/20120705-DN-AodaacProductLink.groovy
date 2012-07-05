databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1341452327914-1") {
        createTable(tableName: "aodaac_product_link") {
            column(name: "id", type: "int8") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "aodaac_producPK")
            }

            column(name: "version", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "layer_name", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "product_id", type: "int4") {
                constraints(nullable: "false")
            }

            column(name: "server_id", type: "int8") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1341452327914-9") {
        addForeignKeyConstraint(baseColumnNames: "server_id", baseTableName: "aodaac_product_link", constraintName: "FK476CDDBC42B61D5A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "server", referencesUniqueColumn: "false")
    }
}
