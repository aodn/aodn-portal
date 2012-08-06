import grails.util.Environment

databaseChangeLog = {

	changeSet(author: "pmak", id: "1337213952129-5", runAlways: true, failOnError: false) {
        grailsChange{
            change{
                def adminUsers =  [ 'pauline.mak@utas.edu.au':  'Pauline Mak',
                        'sjwilde@utas.edu.au': 'Stewart Wilde',
                        'peter.blain@utas.edu.au':  'Peter Blain',
                        'philip.bohm@utas.edu.au':  'Philip Bohm',
                        'tommy.fotak@utas.edu.au': 'Tommy Fotak',
                        'dnahodil@utas.edu.au':  'David Nahodil',
                        'jkburges@utas.edu.au':  'Jon Burgess',
                        'Craig.Jones@utas.edu.au':  'Craig Jones'
                ]
				
				def openIdHost = 'https://openid.emii.org.au/'
				if (Environment.current != Environment.PRODUCTION) {
					openIdHost = 'https://devid.emii.org.au/'
					// Update all existing users to have the devid host in case this data has come from elsewhere
					sql.execute("update portal_user set open_id_url = replace(open_id_url, 'openid', 'devid')")
				}

                def adminRoleId = (sql.firstRow("select id from user_role where name='Administrator'")).getProperty("id")

                adminUsers.each{
                    def row = sql.firstRow("select * from portal_user where lower(email_address) = lower('$it.key')")
                    def userId = -1

                    if(row == null){
                        def nextId = sql.firstRow("select nextVal('hibernate_sequence')")

                        nextId = nextId.getProperty("nextval")

                        def newRow = sql.executeInsert("""
                        INSERT INTO portal_user (id, version, email_address, full_name, open_id_url) VALUES
                        (?, ?, ?, ?, ?)""", [nextId, 0, it.key, it.value, openIdHost + it.key])

                        userId = newRow.get(0).get(0)
                    }
                    else{
                        //user already exists
                        userId = row.getProperty("id")
                        def row2 = sql.firstRow("select * from portal_user_roles where user_id = $userId and user_role_id = $adminRoleId")

                        if(row2 != null){
                            userId = -1
                        }
                    }

                    if(userId != -1){
                        //make them an admin, if they are not already
                        sql.execute("""
                            insert into portal_user_roles
                            (user_id, user_role_id) values
                            ($userId, $adminRoleId)
                        """)
                    }
                }
            }
        }
	}
}
