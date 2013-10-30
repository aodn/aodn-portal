databaseChangeLog = {

    changeSet(author: "dnahodil", id: "1383087986000-1") {

        update(tableName: "config") {
            column(name: "popup_width", value: "550")
        }
    }
}
