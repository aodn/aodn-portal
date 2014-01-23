/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
databaseChangeLog = {
    changeSet(author: "jkburges (generated)", id: "1390450402000-1", failOnError: true) {
        createIndex(indexName: "filter_id_index", tableName: "filter_possible_values") {
            column(name: "filter_id")
            column(name: "possible_values_string")
            column(name: "possible_values_idx")
        }
    }
}
