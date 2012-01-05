databaseChangeLog = {

	changeSet(author: "tfotak", id: "1325732622000-1") {
		sql("ALTER SEQUENCE hibernate_sequence RESTART WITH 200")
	}
}
