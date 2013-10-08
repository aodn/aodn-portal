
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pmak (generated)", id: "1349046687230-1") {
        createTable(tableName: "server_portal_user") {
            column(name: "server_owners_id", type: "int8")

            column(name: "user_id", type: "int8")
        }
    }

    changeSet(author: "pmak (generated)", id: "1349046687230-2") {
        addForeignKeyConstraint(baseColumnNames: "server_owners_id", baseTableName: "server_portal_user", constraintName: "FK1DCC40C29B051161", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "server", referencesUniqueColumn: "false")
    }

    changeSet(author: "pmak (generated)", id: "1349046687230-3") {
        addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "server_portal_user", constraintName: "FK1DCC40C2761E105A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "portal_user", referencesUniqueColumn: "false")
    }
}
