databaseChangeLog = {

    changeSet(author: "jkburges (generated)", id: "14014252470000-1") {
        dropColumn(tableName: "config", columnName: "download_cart_confirmation_window_content")
    }
}