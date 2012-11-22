
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil", id: "1334281461166-1") {

		update(tableName: "config") {

            column(name: "download_cart_max_file_size", valueNumeric: "52428800")
            where "download_cart_max_file_size = 10485760"
        }
    }
}
