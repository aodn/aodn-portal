
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pmak (generated)", id: "1348787790476-1") {
        addColumn(tableName: "snapshot_layer") {
            column(name: "cql", type: "varchar(255)")
        }
    }
}
