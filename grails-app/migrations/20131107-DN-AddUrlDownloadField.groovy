databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1383785551697-1"){
        addColumn(tableName: "layer"){
            column(name: "url_download_field_name", type: "varchar(255)")
        }
    }
}
