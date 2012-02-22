databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1329802867284-1") {
        addColumn(tableName: "layer") {
            column(name: "bbox_maxx", type: "varchar(255)")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1329802867284-2") {
        addColumn(tableName: "layer") {
            column(name: "bbox_maxy", type: "varchar(255)")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1329802867284-3") {
        addColumn(tableName: "layer") {
            column(name: "bbox_minx", type: "varchar(255)")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1329802867284-4") {
        addColumn(tableName: "layer") {
            column(name: "bbox_miny", type: "varchar(255)")
        }
    }

    changeSet(author: "dnahodil (generated)", id: "1329802867284-5") {
        dropColumn(columnName: "bbox", tableName: "layer")
    }
}