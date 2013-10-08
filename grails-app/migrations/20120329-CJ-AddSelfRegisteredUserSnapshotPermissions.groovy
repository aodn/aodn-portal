
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil", id: "1332722929000-1", failOnError: true) {
        
        // Ensure SelfRegisteredUser has correct permissions
        
        delete(tableName: "user_role_permissions") {
            
            where "user_role_id = (select id from user_role where name = 'SelfRegisteredUser')"
        }
        
        insert(tableName: "user_role_permissions") {
        
            column(name: "user_role_id", valueComputed: "(select id from user_role where name = 'SelfRegisteredUser')")
            column(name: "permissions_string", value: "user:updateAccount")
        }
        
        insert(tableName: "user_role_permissions") {
        
            column(name: "user_role_id", valueComputed: "(select id from user_role where name = 'SelfRegisteredUser')")
            column(name: "permissions_string", value: "user:userUpdateAccount")
        }
        
        insert(tableName: "user_role_permissions") {
        
            column(name: "user_role_id", valueComputed: "(select id from user_role where name = 'SelfRegisteredUser')")
            column(name: "permissions_string", value: "snapshot:*")
        }
    }
}
