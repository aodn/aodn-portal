databaseChangeLog = {

    changeSet(author: "pmak (generated)", id: "1354155837136-2") {
        addColumn(tableName: "layer") {
            column(defaultValue: "true", name: "available", type: "bool") {
                constraints(nullable: "false")
            }
        }
    }
}
