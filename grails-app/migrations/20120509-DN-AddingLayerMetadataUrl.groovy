
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1336528655449-1") {
        createTable(tableName: "metadata_url") {
            column(name: "id", type: "int8") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "metadata_urlPK")
            }

            column(name: "version", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "format", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "layer_id", type: "int8") {
                constraints(nullable: "false")
            }

            column(name: "online_resource_href", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "online_resource_type", type: "varchar(255)") {
                constraints(nullable: "false")
            }

            column(name: "type", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }
}
