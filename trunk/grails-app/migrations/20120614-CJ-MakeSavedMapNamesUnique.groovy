import grails.util.Environment

databaseChangeLog = {

	changeSet(author: "craigj", id: "1339720918714-1") {
		grailsChange{
			change{
				// make duplicate names for a particular owner unique before adding unique constraint
				 sql.eachRow('select owner_id, name from snapshot group by owner_id, name having count(*)>1') { ownerName ->
					 def instance = 1
					 sql.eachRow("select id from snapshot where owner_id = $ownerName.owner_id and name = $ownerName.name") { row ->
						 if (instance > 1) {
							 sql.executeUpdate("update snapshot set name = name||' ('||$instance||')' where id = $row.id")
						 } 
						 instance++
					 }
				 }
 			}
		}
	}
	
	changeSet(author: "craigj (generated)", id: "1339720918714-12") {
		addUniqueConstraint(columnNames: "owner_id, name", constraintName: "snapshot_owner_id_key", deferrable: "false", disabled: "false", initiallyDeferred: "false", tableName: "snapshot")
	}

}
