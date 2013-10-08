
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "pmbohm (generated)", id: "1338273906268-12a") {
        sql("update config set footer_content = replace(footer_content,'inquiries','enquiries')")
    }
}
