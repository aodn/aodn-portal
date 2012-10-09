databaseChangeLog = {
    changeSet(author: "pmak (generated)", id: "1349410090006-1") {
        grailsChange{
            change{
                def nextId = sql.firstRow("select nextVal('hibernate_sequence')")
                nextId = nextId.getProperty("nextval")

                sql.execute("""
                    insert into user_role
                    (id, version, name) values
                    ($nextId, 0, 'ServerOwner')
                """)
            }
        }
    }
}