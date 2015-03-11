databaseChangeLog = {

    changeSet(author: "jkburges", id: "1425952041-1") {
        [ 'url_list_download_prefix_to_remove', 'url_list_download_prefix_to_substitue' ].each {
            colName ->

            dropColumn(columnName: colName, tableName: "server")
        }
    }
}
