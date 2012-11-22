
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1334815305155-1", failOnError: true) {
        addColumn(tableName: "config") {
            column(
                name: "download_cart_confirmation_window_content",
                type: "text",
                value: "<i>-- Licence agreement text here --</i>"
            )
        }

        addNotNullConstraint(tableName: "config", columnName: "download_cart_confirmation_window_content")
    }
}
