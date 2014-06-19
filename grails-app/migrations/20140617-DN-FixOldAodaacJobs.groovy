/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1402969380000-1", failOnError: true) {

        update(tableName: "aodaac_job") {
            column(name: "status", value: "ASSUMED_EXPIRED")
            where "product_id like '' and status not in ('FAIL', 'SUCCESS')"
        }
    }
}