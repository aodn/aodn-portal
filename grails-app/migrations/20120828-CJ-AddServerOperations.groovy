
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "craigj (generated)", id: "1346082646462-1") {
        createTable(tableName: "operation") {
            column(name: "id", type: "int8") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "operation_pkey")
            }

            column(name: "version", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "formats", type: "TEXT") {
                constraints(nullable: "false")
            }

            column(name: "get_url", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "VARCHAR(255)") {
                constraints(nullable: "false")
            }

            column(name: "post_url", type: "VARCHAR(255)")
        }
    }

    changeSet(author: "craigj (generated)", id: "1346097586450-1") {
        createTable(tableName: "server_operation") {
            column(name: "server_operations_id", type: "int8")

            column(name: "operation_id", type: "int8")
        }
    }

    changeSet(author: "craigj (generated)", id: "1346097586450-25") {
        addForeignKeyConstraint(baseColumnNames: "operation_id", baseTableName: "server_operation", baseTableSchemaName: "public", constraintName: "fkae8a076b1fb5fdda", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "operation", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
    }

    changeSet(author: "craigj (generated)", id: "1346097586450-26") {
        addForeignKeyConstraint(baseColumnNames: "server_operations_id", baseTableName: "server_operation", baseTableSchemaName: "public", constraintName: "fkae8a076b10c2d815", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "server", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
    }

}
