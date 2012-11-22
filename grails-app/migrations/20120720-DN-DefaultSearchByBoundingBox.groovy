
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1342738991037-1", failOnError: true) {

        addColumn(tableName: "config") {
            column(name: "search_using_bbox_by_default", type: "bool")
        }

        update(tableName: "config") {
            column(name: "search_using_bbox_by_default", valueBoolean: "false")
        }

        addNotNullConstraint(tableName: "config", columnName: "search_using_bbox_by_default")
    }

    changeSet(author: "dnahodil (generated)", id: "1342738991037-8", failOnError: true) {
        dropColumn(columnName: "default_search_bounding_box", tableName: "config")
    }
}
