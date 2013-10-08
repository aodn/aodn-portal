databaseChangeLog = {

    changeSet(author: "pmbohm (generated)", id: "20130911-PB-SetHeightForAllPortalsVer3") {

        sql "update config set header_height=110;"

    }
}
