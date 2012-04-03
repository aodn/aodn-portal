import au.org.emii.portal.migrations.helpers.MenuJsonToMenuItemMigrationHelper

databaseChangeLog = {

	changeSet(author: "tfotak (generated)", id: "1327970556000-1", failOnError: true) {
		createTable(tableName: "menu_item") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "menu_itemPK")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "layer_id", type: "int8")

			column(name: "leaf", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "menu_id", type: "int8")

			column(name: "parent_id", type: "int8")

			column(name: "server_id", type: "int8")

			column(name: "text", type: "varchar(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "tfotak (generated)", id: "1327970556000-2", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "menu_id", baseTableName: "menu_item", constraintName: "FKA4FAA1F3B784B7DA", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "menu", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1327970556000-3", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "parent_id", baseTableName: "menu_item", constraintName: "FKA4FAA1F3A011E462", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "menu_item", referencesUniqueColumn: "false")
	}
	
	changeSet(author: "tfotak (generated)", id: "1327970556000-4", failOnError: true) {
		addColumn(tableName: "menu_item") {
			column(name: "menu_position", type: "int4")
		}
		addColumn(tableName: "menu_item") {
			column(name: "parent_position", type: "int4")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1327970556000-5", failOnError: true) {
		grailsChange {
			change {
				
				def helper = new MenuJsonToMenuItemMigrationHelper()
				
				def insert = { menu, item ->
					def menuId = item.parentId ? null : menu.id
					sql.execute "insert into menu_item (id, version, menu_id, layer_id, server_id, leaf, text, parent_id, menu_position, parent_position) values ((select nextval('hibernate_sequence')), 0, $menuId, $item.layerId, $item.serverId, $item.leaf, $item.text, $item.parentId, $item.menuPosition, $item.parentPosition)"
				}
				
				// Weird but to be able to recurse a closure you need to declare
				// and define separately
				def insertItems 
				insertItems = { menu, item ->
					def parentId
					insert(menu, item)
					item.childItems.eachWithIndex { child, i ->
						if (i == 0) {
							def fr = sql.firstRow("select currval('hibernate_sequence') as id")
							parentId = fr.id
						}
						child.parentId = parentId
						insertItems(menu, child)
					}
				}
				
				sql.eachRow('select id, json from menu') { row ->
					def menu = helper.parseToMenu(row.id, row.json)
					menu.menuItems.each { 
						insertItems(menu, it)
					}
				}
			}
		}
	}
}
