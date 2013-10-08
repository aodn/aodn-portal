
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pmak (generated)", id: "1339723767663-1") {
        addColumn(tableName: "layer") {
            column(name: "override_metadata_url", type: "varchar(255)")
        }
    }
}
