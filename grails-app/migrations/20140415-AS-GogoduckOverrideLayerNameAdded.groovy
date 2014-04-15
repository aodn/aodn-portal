/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "anguss00 (generated)", id: "1397538850000-1") {
        addColumn(tableName: "layer") {
            column(name: "gogoduck_layer_name", type: "varchar(255)")
        }
    }

    changeSet(author: "anguss00 (generated)", id: "1397538850000-2") {
        update(tableName: "layer") {
            column(name: "gogoduck_layer_name", value: "CARS") {
                where("layer.name LIKE 'CARS%'")
            }
        }
    }
}
