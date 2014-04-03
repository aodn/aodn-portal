databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1396501014267-1") {
        addColumn(tableName: "aodaac_job") {
            column(name: "files", type: "text")
        }
    }
}