databaseChangeLog = {

    changeSet(author: "dnahodil", id: "1383087986000-1") {

        sql "UPDATE config SET popup_width=490;"
        update(tableName: "config") {
            column(name: "popup_width", value: "550")
        }
    }
}
