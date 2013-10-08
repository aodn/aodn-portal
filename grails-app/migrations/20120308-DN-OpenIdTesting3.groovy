
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1331161120058-1", failOnError: true) {
        addColumn(tableName: "portal_user") {
            column(name: "full_name", type: "varchar(255)")
        }
    }

    changeSet(author: "tfotak", id: "1335245097000-1", failOnError: true) {
        sql("update portal_user set full_name = trim(both from first_name) ||' '|| trim(both from last_name)")
        addNotNullConstraint(tableName: "portal_user", columnName: "full_name")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-2", failOnError: true) {
        addColumn(tableName: "portal_user") {
            column(name: "open_id_url", type: "varchar(255)")
        }

        sql("update portal_user set open_id_url = 'https://openid.emii.org.au/'||email_address")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-3", failOnError: true) {
        dropForeignKeyConstraint(baseTableName: "portal_user", baseTableSchemaName: "public", constraintName: "fkf1617fbeffa68f99")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-4", failOnError: true) {
        // There may be duplicate email addresses due to MEST migration so we
        // need to deal with that now
        grailsChange {
            change {
                def idsToDelete = []
                sql.eachRow('select email_address, count(*) as count from portal_user group by email_address having count(*) > 1') { row ->
                    sql.eachRow("select * from portal_user where email_address = $row.email_address") {
                        idsToDelete << it.id
                    }
                }

                def snapShotIdsToDelete = []
                idsToDelete.each {
                    sql.eachRow("select * from snapshot where owner_id = $it") { row ->
                        snapShotIdsToDelete << row.id
                    }
                }

                snapShotIdsToDelete.each {
                    sql.execute("delete from snapshot_layer where snapshot_id = $it")
                    sql.execute("delete from snapshot where id = $it")
                }

                idsToDelete.each {
                    sql.execute("delete from portal_user_roles where user_id = $it")
                    sql.execute("delete from portal_user where id = $it")
                }
            }
        }

        addNotNullConstraint(tableName: "portal_user", columnName: "open_id_url")
        createIndex(indexName: "open_id_url_unique_1331161118519", tableName: "portal_user", unique: "true") {
            column(name: "open_id_url")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-5", failOnError: true) {
        dropColumn(columnName: "address", tableName: "portal_user")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-6", failOnError: true) {
        dropColumn(columnName: "country", tableName: "portal_user")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-7", failOnError: true) {
        dropColumn(columnName: "first_name", tableName: "portal_user")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-8", failOnError: true) {
        dropColumn(columnName: "last_name", tableName: "portal_user")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-9", failOnError: true) {
        dropColumn(columnName: "org_type_id", tableName: "portal_user")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-10", failOnError: true) {
        dropColumn(columnName: "organisation", tableName: "portal_user")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-11", failOnError: true) {
        dropColumn(columnName: "password_hash", tableName: "portal_user")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-12", failOnError: true) {
        dropColumn(columnName: "password_salt", tableName: "portal_user")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-13", failOnError: true) {
        dropColumn(columnName: "postcode", tableName: "portal_user")
    }

    changeSet(author: "dnahodil (generated)", id: "1331161120058-14", failOnError: true) {
        dropColumn(columnName: "state", tableName: "portal_user")
    }
}
