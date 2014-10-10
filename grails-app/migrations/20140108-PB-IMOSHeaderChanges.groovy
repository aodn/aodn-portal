databaseChangeLog = {

	changeSet(author: "pmbohm (generated)", id: "1389151962237-1") {

        update(tableName: "config") {
            column(name: "header_height", value: "140")
        }

        update(tableName: "config") {
            column(name: "name", value: "Open Access to Ocean Data")
        }
    }
}
