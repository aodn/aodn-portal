
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1340249843164-2") {
        addColumn(tableName: "aodaac_job") {
            column(name: "notification_email_address", type: "varchar(255)")
        }
    }
}
