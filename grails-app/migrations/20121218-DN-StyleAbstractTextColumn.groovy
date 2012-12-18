databaseChangeLog = {

	changeSet(author: "dnahodil (generated)", id: "1355789250123-1") {

		sql "ALTER TABLE style ALTER COLUMN abstract_text TYPE text;"
	}
}