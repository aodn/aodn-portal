databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1334706622918-1") {
        addColumn(tableName: "layer") {
            column(name: "layer_hierarchy_path", type: "text")
        }
    }
}
