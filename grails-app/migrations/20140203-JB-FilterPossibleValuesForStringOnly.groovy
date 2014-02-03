/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
databaseChangeLog = {
    changeSet(author: "jkburges (generated)", id: "1391390129000-1", failOnError: true) {
        sql("delete from filter_possible_values where filter_id in (select id from filter where type != 'String')")
    }
}
