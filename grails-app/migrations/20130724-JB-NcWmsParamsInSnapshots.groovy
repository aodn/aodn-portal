databaseChangeLog = {

    changeSet(author: "jburgess (generated)", id: "1374625818091-1") {
        addColumn(tableName: "snapshot_layer") {
            column(name: "ncwms_param_max", type: "FLOAT4(8,8)")
        }
    }

    changeSet(author: "jburgess (generated)", id: "1374625818091-2") {
        addColumn(tableName: "snapshot_layer") {
            column(name: "ncwms_param_min", type: "FLOAT4(8,8)")
        }
    }
}
