databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1384230082842-1") {
        addColumn(tableName: "server") {
            column(name: "url_list_download_prefix_to_remove", type: "varchar(255)")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1384230082842-2") {
        addColumn(tableName: "server") {
            column(name: "url_list_download_prefix_to_substitue", type: "varchar(255)")
        }
    }
}
