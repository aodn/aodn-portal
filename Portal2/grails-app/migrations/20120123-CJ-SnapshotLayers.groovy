databaseChangeLog = {

    changeSet(author: "craigj (generated)", id: "1327282372921-1") {
        createTable(tableName: "snapshot_layer") {
            column(name: "id", type: "int8") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "snapshot_layer_pkey")
            }

            column(name: "version", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "layer_id", type: "int8") 
            
            column(name: "name", type: "VARCHAR(255)")

            column(name: "service_url", type: "VARCHAR(255)")
            
            column(name: "is_base_layer", type: "bool") {
                constraints(nullable: "false")
            }
            
            column(name: "hidden", type: "bool") {
                constraints(nullable: "false")
            }

            column(name: "snapshot_id", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "layers_idx", type: "int4")
        }
    }
    
    changeSet(author: "craigj (generated)", id: "1327976497699-1") {
        addColumn(tableName: "snapshot") {
            column(name: "maxx", type: "int4") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "craigj (generated)", id: "1327976497699-2") {
        addColumn(tableName: "snapshot") {
            column(name: "maxy", type: "int4") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "craigj (generated)", id: "1327976497699-3") {
        addColumn(tableName: "snapshot") {
            column(name: "minx", type: "int4") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "craigj (generated)", id: "1327976497699-4") {
        addColumn(tableName: "snapshot") {
            column(name: "miny", type: "int4") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "craigj (generated)", id: "1327282372921-10") {
        addForeignKeyConstraint(baseColumnNames: "layer_id", baseTableName: "snapshot_layer", baseTableSchemaName: "public", constraintName: "fka548ab16f74bd9a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "layer", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
    }

    changeSet(author: "craigj (generated)", id: "1327282372921-11") {
        addForeignKeyConstraint(baseColumnNames: "snapshot_id", baseTableName: "snapshot_layer", baseTableSchemaName: "public", constraintName: "fka548ab164f9b61ba", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "snapshot", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
    }
}
