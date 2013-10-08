databaseChangeLog = {

    changeSet(author: "pmak (generated)", id: "1362461515445-3") {

        addColumn(tableName: "config") {
            column(name: "wfs_scanner_callback_password", type: "varchar(255)") {
                constraints(nullable: "true")
            }
        }

        addColumn(tableName: "filter") {
            column(defaultValue: "false", name: "enabled", type: "bool") {
                constraints(nullable: "true")
            }
        }
    }
}
