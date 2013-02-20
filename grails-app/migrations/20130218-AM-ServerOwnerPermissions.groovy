databaseChangeLog = {

    changeSet(author: "amckeown (generated)", id: "20130218-AM-ServerOwnerPermissions") {
        insert(tableName: "user_role_permissions") {
            column(name: "user_role_id", valueComputed: "(select id from user_role where name = 'ServerOwner')")
            column(name: "permissions_string", value: "server:listByOwner")
        }
        insert(tableName: "user_role_permissions") {
            column(name: "user_role_id", valueComputed: "(select id from user_role where name = 'ServerOwner')")
            column(name: "permissions_string", value: "wmsScanner:controls")
        }
    }
}
