databaseChangeLog = {

    if (System.getProperty("INSTANCE_NAME") == 'SOOS') {
        changeSet(author: "pmbohm (generated)", id: "20121217-PB-SOOSFooterText") {

            sql("update config set footer_content=''")

            sql("update config set NAME='SOUTHERN OCEAN OBSERVING SYSTEM PORTAL'")
            sql("update config set header_height=100")
            sql("update config set initial_bbox='-180,-90,180,90'")



        }
    }
}
