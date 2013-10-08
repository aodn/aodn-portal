
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pmak (generated)", id: "1349157824959-1") {
        createTable(tableName: "filter_possible_values") {
            column(name: "filter_id", type: "int8")

            column(name: "possible_values_string", type: "varchar(255)")
        }
    }

    changeSet(author: "pmak (generated)", id: "1349157824959-2") {
        addNotNullConstraint(columnDataType: "varchar(255)", columnName: "units", tableName: "wmsdimension")
    }

    changeSet(author: "pmak (generated)", id: "1349157824959-8") {
        addForeignKeyConstraint(baseColumnNames: "filter_id", baseTableName: "filter_possible_values", constraintName: "FK439C10E93F8B53A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "filter", referencesUniqueColumn: "false")
    }

    changeSet(author: "pmak (generated)", id: "1349157824959-9") {
        dropColumn(columnName: "filter_values", tableName: "filter")
    }
}
