
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil", id: "1334124134000-1", failOnError: true) {

        update(tableName: "config") {

            column(name: "download_cart_filename", value: '"AODN Portal download(%s %s).zip"')
            where "download_cart_filename LIKE '\"aodn portal download (%s).zip\"'"
        }
    }
}
