/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pblain", id: "1349410090007-1") {

        addColumn(tableName: "config") {
            column(
                    name: "default_dateline_zoom_bbox",
                    type: "VARCHAR(50)",
                    value: "110,-50,160,-3"
                    )
        }


        addColumn(tableName: "config") {
            column(
                    name: "enable_default_dateline_zoom",
                    type: "boolean",
                    value: false
                    )
        }
        
        sql("update config set enable_default_dateline_zoom = false;")
        
        addNotNullConstraint(tableName: "config", columnName: "enable_default_dateline_zoom")
        
    }
}