databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1396498493600-1") {
        addColumn(tableName: "aodaac_job") {
            column(name: "status", type: "varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1396498493600-13") {
        dropColumn(columnName: "has_ended", tableName: "aodaac_job")
    }

    changeSet(author: "dnahodil (generated)", id: "1396498493600-14") {
        dropColumn(columnName: "has_expired", tableName: "aodaac_job")
    }
}
