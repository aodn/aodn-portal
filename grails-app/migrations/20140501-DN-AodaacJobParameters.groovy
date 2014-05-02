databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1398928137987-1") {
        addColumn(tableName: "aodaac_job") {
            column(name: "date_range_end", type: "timestamp", defaultValueDate: "1900-01-01T00:00:00") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1398928137987-2") {
        addColumn(tableName: "aodaac_job") {
            column(name: "date_range_start", type: "timestamp", defaultValueDate: "1900-01-01T00:00:00") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1398928137987-3") {
        addColumn(tableName: "aodaac_job") {
            column(name: "latitude_range_end", type: "float8(19)", defaultValueNumeric: "0.0") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1398928137987-4") {
        addColumn(tableName: "aodaac_job") {
            column(name: "latitude_range_start", type: "float8(19)", defaultValueNumeric: "0.0") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1398928137987-5") {
        addColumn(tableName: "aodaac_job") {
            column(name: "longitude_range_end", type: "float8(19)", defaultValueNumeric: "0.0") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1398928137987-6") {
        addColumn(tableName: "aodaac_job") {
            column(name: "longitude_range_start", type: "float8(19)", defaultValueNumeric: "0.0") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1398928137987-7") {
        addColumn(tableName: "aodaac_job") {
            column(name: "product_id", type: "varchar(255)", defaultValue: "") {
                constraints(nullable: "false")
            }
        }
    }

    changeSet(author: "dnahodil", id: "1398928137987-8") {
        dropDefaultValue(tableName: "aodaac_job", columnName: "date_range_end")
        dropDefaultValue(tableName: "aodaac_job", columnName: "date_range_start")
        dropDefaultValue(tableName: "aodaac_job", columnName: "latitude_range_end")
        dropDefaultValue(tableName: "aodaac_job", columnName: "latitude_range_start")
        dropDefaultValue(tableName: "aodaac_job", columnName: "longitude_range_end")
        dropDefaultValue(tableName: "aodaac_job", columnName: "longitude_range_start")
        dropDefaultValue(tableName: "aodaac_job", columnName: "product_id")
    }
}
