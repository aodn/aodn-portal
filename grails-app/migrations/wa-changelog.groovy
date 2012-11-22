
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    if (System.getProperty("INSTANCE_NAME") == 'WA') {
        // All WA-specific change sets must appear inside this if block

        changeSet(author: "dnahodil", id: "1343009068000-1", failOnError: true) {

            update(tableName: "config") {

                column name:"search_using_bbox_by_default", valueBoolean: "true"
                where "id = (select id from config limit 1)"
            }
        }
    }
}
