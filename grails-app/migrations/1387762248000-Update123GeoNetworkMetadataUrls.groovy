/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "tfotak (generated)", id: "1319582037000-1") {
        update(tableName: "metadata_url") {
            column(name: "online_resource_href", valueComputed: "replace(online_resource_href, 'http://catalogue123.aodn.org.au', 'http://catalogue-123.aodn.org.au')")
            where("online_resource_href like 'http://catalogue123.aodn.org.au%'")
        }
    }
}
