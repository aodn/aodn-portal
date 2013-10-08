
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "tfotak (generated)", id: "1341451709000-1") {
        update(tableName: "layer") {
            column(name: "title", value: "Bathymetry Baselayer")
            where("title = 'Default Baselayer' and is_base_layer = true")
        }

        update(tableName: "layer") {
            column(name: "title", value: "Satellite")
            where("title = 'satellite' and is_base_layer = true")
        }
    }
}
