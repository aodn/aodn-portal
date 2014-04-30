databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1398822467434-1") {
        addColumn(tableName: "aodaac_job") {
            column(name: "parameters", type: "text") {
                constraints(nullable: "true")
            }
        }
    }
}
