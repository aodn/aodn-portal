databaseChangeLog = {

    changeSet(author: "jkburges (generated)", id: "1399439640000-1") {
        addColumn(tableName: "server") {
            column(name: "supports_csv_metadata_header_output_format", type: "bool", defaultValueDate: false) {
                constraints(nullable: "true")
            }
        }
    }
}