databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1392864904315-1") {
        delete(tableName: "filter") {
            where "type like ''"
        }
    }
}
