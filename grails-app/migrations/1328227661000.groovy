databaseChangeLog = {

	changeSet(author: "tfotak (generated)", id: "1328227661000") {
		sql("""\
delete from menu_item where id in (
	select m.id from menu_item m
	left join layer l on l.id = m.layer_id
	where m.layer_id is not null and l.id is null
)\
	 """)
		
		sql("""\
delete from menu_item where id in (
	select m.id from menu_item m
	left join server s on s.id = m.server_id
	where m.server_id is not null and s.id is null
		)\
	 """)
	}
}
