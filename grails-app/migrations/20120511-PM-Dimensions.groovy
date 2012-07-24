databaseChangeLog = {

    changeSet(author: "pmak (generated)", id: "1335409262075-1") {
        createTable(tableName: "layer_wmsdimension") {
            column(name: "layer_dimensions_id", type: "int8")

            column(name: "wmsdimension_id", type: "int8")
        }
    }

    changeSet(author: "pmak (generated)", id: "1335409262075-2") {
        createTable(tableName: "wmsdimension") {
            column(name: "id", type: "int8") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "wmsdimensionPK")
            }

            column(name: "version", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "default_value", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "extent", type: "text") {
                constraints(nullable: "false")
            }

            column(name: "has_current", type: "bool") {
                constraints(nullable: "false")
            }

            column(name: "has_multiple_values", type: "bool") {
                constraints(nullable: "false")
            }

            column(name: "has_nearest_value", type: "bool") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "unit_symbol", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "units", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "pmak (generated)", id: "1335413200432-1") {
        dropNotNullConstraint(columnDataType: "varchar(255)", columnName: "units", tableName: "wmsdimension")
    }

    changeSet(author: "pmak (generated)", id: "1335413270885-1") {
        dropNotNullConstraint(columnDataType: "varchar(255)", columnName: "default_value", tableName: "wmsdimension")
    }

    changeSet(author: "pmak (generated)", id: "1335413270885-2") {
        dropNotNullConstraint(columnDataType: "varchar(255)", columnName: "unit_symbol", tableName: "wmsdimension")
    }

    changeSet(author: "pmak (generated)", id: "1335409262075-9") {
        addForeignKeyConstraint(baseColumnNames: "layer_dimensions_id", baseTableName: "layer_wmsdimension", constraintName: "FK1B7BB9D77F0BF730", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "layer", referencesUniqueColumn: "false")
    }

    changeSet(author: "pmak (generated)", id: "1335409262075-10") {
        addForeignKeyConstraint(baseColumnNames: "wmsdimension_id", baseTableName: "layer_wmsdimension", constraintName: "FK1B7BB9D73512FF7A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "wmsdimension", referencesUniqueColumn: "false")
    }
}
