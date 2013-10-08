
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1342657132749-1", failOnError: true) {
        addColumn(tableName: "config") {
            column(name: "default_search_bounding_box", type: "varchar(255)")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1342657132749-3", failOnError: true) {
        createIndex(indexName: "unique_product_id", tableName: "aodaac_product_link") {
            column(name: "layer_name")

            column(name: "server_id")

            column(name: "product_id")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1342657132749-9", failOnError: true) {
        dropColumn(columnName: "depth_password", tableName: "config")
    }

    changeSet(author: "dnahodil (generated)", id: "1342657132749-10", failOnError: true) {
        dropColumn(columnName: "depth_schema", tableName: "config")
    }

    changeSet(author: "dnahodil (generated)", id: "1342657132749-11", failOnError: true) {
        dropColumn(columnName: "depth_table", tableName: "config")
    }

    changeSet(author: "dnahodil (generated)", id: "1342657132749-12", failOnError: true) {
        dropColumn(columnName: "depth_url", tableName: "config")
    }

    changeSet(author: "dnahodil (generated)", id: "1342657132749-13", failOnError: true) {
        dropColumn(columnName: "depth_user", tableName: "config")
    }

    changeSet(author: "dnahodil (generated)", id: "1342657132749-14", failOnError: true) {
        dropColumn(columnName: "use_depth_service", tableName: "config")
    }
}
