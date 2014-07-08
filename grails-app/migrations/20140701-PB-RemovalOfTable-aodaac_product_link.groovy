/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pmbohm", id: "1404197206-1") {
        sql("DROP TABLE aodaac_product_link")
    }
}

