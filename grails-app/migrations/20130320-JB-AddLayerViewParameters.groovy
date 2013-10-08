databaseChangeLog = {

    changeSet(author: "jburgess (generated)", id: "1363743811428-1") {
        createTable(tableName: "layer_view_parameters") {
            column(name: "id", type: "int8") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "layer_view_parameters_pkey")
            }

            column(name: "version", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "centre_lat", type: "FLOAT4(8,8)") {
                constraints(nullable: "false")
            }

            column(name: "centre_lon", type: "FLOAT4(8,8)") {
                constraints(nullable: "false")
            }

            column(name: "layer_id", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "open_layers_zoom_level", type: "int4") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "jburgess (generated)", id: "1363743811428-2") {
        addForeignKeyConstraint(baseColumnNames: "layer_id", baseTableName: "layer_view_parameters", baseTableSchemaName: "public", constraintName: "fk914c9cd6f74bd9a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "layer", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
    }
}
