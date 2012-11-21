databaseChangeLog = {
    changeSet(author: "pmak (generated)", id: "1349410090006-1") {
        sql("insert into user_role (id, version, name) values (nextval('hibernate_sequence'), 0, 'ServerOwner')")
    }
}