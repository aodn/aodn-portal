
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pmak (generated)", id: "1347583700313-1") {
        createTable(tableName: "filter") {
            column(name: "id", type: "int8") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "filterPK")
            }

            column(name: "version", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "label", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "layer_id", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "name", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "type", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "values", type: "varchar(255)")
        }
    }

    changeSet(author: "pmak (generated)", id: "1347583700313-8") {
        addForeignKeyConstraint(baseColumnNames: "layer_id", baseTableName: "filter", constraintName: "FKB408CB78F74BD9A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "layer", referencesUniqueColumn: "false")
    }
}
