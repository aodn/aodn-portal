databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1429763829000") {

        if (System.getProperty("INSTANCE_NAME") == 'AODN') {
            update(tableName: "config") {
                column(name: "footer_content", value: """<p><a href="http://help.aodn.org.au/help/?q=node/81" target="_blank" class="external">Acknowledgement</a> | <a href="http://help.aodn.org.au/help/?q=node/80" target="_blank" class="external">Disclaimer</a></p>""")
            }
        }
    }
}
