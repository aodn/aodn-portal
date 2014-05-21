/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pmbohm ", id: "1400652197-1") {
        dropColumn(tableName: "layer", columnName: "available")
    }
}