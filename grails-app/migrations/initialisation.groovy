
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

	changeSet(author: "tfotak (generated)", id: "1331787865301-48", failOnError: true) {
		createSequence(schemaName: "public", sequenceName: "hibernate_sequence")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-1", failOnError: true) {
		createTable(tableName: "config") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "config_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "default_menu_id", type: "int8")

			column(name: "enablemotd", type: "bool")

			column(name: "initial_bbox", type: "VARCHAR(50)") {
				constraints(nullable: "false")
			}

			column(name: "name", type: "VARCHAR(255)")

			column(name: "proxy", type: "VARCHAR(255)")

			column(name: "proxy_port", type: "int4")

			column(name: "contributor_menu_id", type: "int8")

			column(name: "region_menu_id", type: "int8")

			column(name: "motd_id", type: "int8")

			column(name: "motd_end", type: "TIMESTAMP WITH TIME ZONE")

			column(name: "motd_start", type: "TIMESTAMP WITH TIME ZONE")

			column(name: "catalog_url", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "footer_height", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "header_height", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "west_width", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "download_cart_max_file_size", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "download_cart_max_num_files", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "download_cart_filename", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "active_layers_height", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "download_cart_mime_type_to_extension_mapping", type: "VARCHAR(2000)") {
				constraints(nullable: "false")
			}

			column(name: "download_cart_downloadable_protocols", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "metadata_layer_protocols", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "metadata_link_protocols", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "map_get_feature_info_buffer", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "baselayer_menu_id", type: "int8")

			column(name: "popup_height", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "popup_width", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "auto_zoom", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "wms_scanner_base_url", type: "VARCHAR(255)")

			column(name: "depth_password", type: "VARCHAR(255)")

			column(name: "depth_url", type: "VARCHAR(255)")

			column(name: "depth_user", type: "VARCHAR(255)")

			column(name: "depth_schema", type: "VARCHAR(255)")

			column(name: "depth_table", type: "VARCHAR(255)")

			column(name: "use_depth_service", type: "bool")

			column(name: "footer_content", type: "TEXT")

			column(name: "footer_content_width", type: "int4")

			column(name: "application_base_url", type: "VARCHAR(255)")

			column(name: "wms_scanner_callback_password", type: "VARCHAR(255)")

			column(name: "wms_scanner_callback_username", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-2", failOnError: true) {
		createTable(tableName: "config_layer") {
			column(name: "config_default_layers_id", type: "int8")

			column(name: "layer_id", type: "int8")

			column(name: "default_layers_idx", type: "int4")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-3", failOnError: true) {
		createTable(tableName: "layer") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "layer_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "cache", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "cql", type: "VARCHAR(255)")

			column(name: "is_base_layer", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "meta_url", type: "VARCHAR(255)")

			column(name: "name", type: "VARCHAR(225)")

			column(name: "queryable", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "server_id", type: "int8") {
				constraints(nullable: "false")
			}

			column(defaultValueComputed: "now()", name: "last_updated", type: "TIMESTAMP WITH TIME ZONE")

			column(name: "parent_id", type: "int8")

			column(name: "title", type: "VARCHAR(255)")

			column(name: "abstract_trimmed", type: "VARCHAR(455)")

			column(name: "active_in_last_scan", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "blacklisted", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "projection", type: "VARCHAR(255)")

			column(name: "data_source", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "namespace", type: "VARCHAR(255)")

			column(name: "styles", type: "TEXT")

			column(name: "bbox_maxx", type: "varchar(255)")
			
            column(name: "bbox_maxy", type: "varchar(255)")
			
            column(name: "bbox_minx", type: "varchar(255)")
			
            column(name: "bbox_miny", type: "varchar(255)")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-4", failOnError: true) {
		createTable(tableName: "menu") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "menu_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "active", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "edit_date", type: "TIMESTAMP WITH TIME ZONE") {
				constraints(nullable: "false")
			}

			column(name: "title", type: "VARCHAR(40)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-5", failOnError: true) {
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

			column(name: "text", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "menu_position", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "parent_position", type: "int4")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-6", failOnError: true) {
		createTable(tableName: "motd") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "motd_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "motd", type: "TEXT") {
				constraints(nullable: "false")
			}

			column(name: "motd_title", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-7", failOnError: true) {
		createTable(tableName: "organisation_type") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "organisation_type_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-8", failOnError: true) {
		createTable(tableName: "portal_user") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "portal_user_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "address", type: "VARCHAR(255)")

			column(name: "country", type: "VARCHAR(255)")

			column(name: "email_address", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "first_name", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "last_name", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "organisation", type: "VARCHAR(255)")
			
			column(name: "password_salt", type: "char(44)") {
				constraints(nullable: "false")
			}

			column(name: "password_hash", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "postcode", type: "VARCHAR(255)")

			column(name: "state", type: "VARCHAR(255)")

			column(name: "org_type_id", type: "int8")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-9", failOnError: true) {
		createTable(tableName: "portal_user_permissions") {
			column(name: "user_id", type: "int8")

			column(name: "permissions_string", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-10", failOnError: true) {
		createTable(tableName: "portal_user_roles") {
			column(name: "user_id", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "user_role_id", type: "int8") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-11", failOnError: true) {
		createTable(tableName: "server") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "server_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "comments", type: "VARCHAR(255)")

			column(name: "disable", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "name", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "short_acron", type: "VARCHAR(16)") {
				constraints(nullable: "false")
			}

			column(name: "type", type: "VARCHAR(11)") {
				constraints(nullable: "false")
			}

			column(name: "uri", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(defaultValueBoolean: "true", name: "allow_discoveries", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "image_format", type: "VARCHAR(9)") {
				constraints(nullable: "false")
			}

			column(name: "opacity", type: "int4") {
				constraints(nullable: "false")
			}

			column(name: "last_scan_date", type: "TIMESTAMP WITH TIME ZONE")

			column(name: "scan_frequency", type: "int4") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-12", failOnError: true) {
		createTable(tableName: "snapshot") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "snapshot_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "TEXT")

			column(name: "name", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "owner_id", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "maxx", type: "FLOAT4(8,8)") {
				constraints(nullable: "false")
			}

			column(name: "maxy", type: "FLOAT4(8,8)") {
				constraints(nullable: "false")
			}

			column(name: "minx", type: "FLOAT4(8,8)") {
				constraints(nullable: "false")
			}

			column(name: "miny", type: "FLOAT4(8,8)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-13", failOnError: true) {
		createTable(tableName: "snapshot_layer") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "snapshot_layer_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "layer_id", type: "int8")

			column(name: "name", type: "VARCHAR(255)")

			column(name: "service_url", type: "VARCHAR(255)")

			column(name: "is_base_layer", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "hidden", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "snapshot_id", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "layers_idx", type: "int4")

			column(name: "opacity", type: "FLOAT4(8,8)")

			column(defaultValue: "", name: "styles", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "title", type: "VARCHAR(255)")

			column(defaultValueBoolean: "false", name: "animated", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "chosen_times", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-14", failOnError: true) {
		createTable(tableName: "user_role") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "user_role_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "name", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-15", failOnError: true) {
		createTable(tableName: "user_role_permissions") {
			column(name: "user_role_id", type: "int8")

			column(name: "permissions_string", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-16", failOnError: true) {
		addPrimaryKey(columnNames: "user_id, user_role_id", constraintName: "portal_user_roles_pkey", tableName: "portal_user_roles")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-17", failOnError: true) {
		insert(tableName: "config") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "default_menu_id")

			column(name: "enablemotd", valueBoolean: "false")

			column(name: "initial_bbox", value: "99,-50,140,-10")

			column(name: "name", value: "Australian Ocean Data Network Portal")

			column(name: "proxy")

			column(name: "proxy_port")

			column(name: "contributor_menu_id")

			column(name: "region_menu_id")

			column(name: "motd_id")

			column(name: "motd_end")

			column(name: "motd_start")

			column(name: "catalog_url", value: "http://catalogue.aodn.org.au/geonetwork")

			column(name: "footer_height", valueNumeric: "88")

			column(name: "header_height", valueNumeric: "95")

			column(name: "west_width", valueNumeric: "290")

			column(name: "download_cart_max_file_size", valueNumeric: "10485760")

			column(name: "download_cart_max_num_files", valueNumeric: "100")

			column(name: "download_cart_filename", value: '"aodn portal download (%s).zip"')

			column(name: "active_layers_height", valueNumeric: "260")

			column(name: "download_cart_mime_type_to_extension_mapping", value: '''{
"text/html":"html",
"text/xhtml":"html",
"text/plain":"txt",
"application/msword":"doc",
"image/bmp":"bmp",
"image/x-windows-bmp":"bmp",
"image/gif":"gif",
"image/jpeg":"jpg",
"image/png":"png",
"image/tiff":"tif",
"image/x-tiff":"tif",
"image/bmp":"bmp",
"application/vnd.google-earth.kml+xml":"kml",
"application/vnd.google-earth.kmz":"kmz",
"application/pdf":"pdf"
}''')

			column(name: "download_cart_downloadable_protocols", value: """WWW:DOWNLOAD-1.0-http--download
WWW:DOWNLOAD-1.0-http--downloaddata
WWW:DOWNLOAD-1.0-http--downloadother
WWW:LINK-1.0-http--downloaddata""")

			column(name: "metadata_layer_protocols", value: """OGC:WMS-1.1.1-http-get-map
OGC:WMS-1.3.0-http-get-map""")

			column(name: "metadata_link_protocols", value: "WWW:LINK-1.0-http--link")

			column(name: "map_get_feature_info_buffer", valueNumeric: "10")

			column(name: "baselayer_menu_id")

			column(name: "popup_height", valueNumeric: "325")

			column(name: "popup_width", valueNumeric: "435")

			column(name: "auto_zoom", valueBoolean: "false")

			column(name: "use_depth_service", valueBoolean: "true")

			column(name: "footer_content", value: '''<p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make inquiries via <a href="mailto:info@aodn.org.au">info@aodn.org.au</a> to be directed to the data custodian.</p>''')

			column(name: "footer_content_width", valueNumeric: "550")

		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-18", failOnError: true) {
		insert(tableName: "organisation_type") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "Government")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "International organisation")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "NGO")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "University/research centre")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "Private company")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "Independant consultant")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "Other")
		}
	}
	
	changeSet(author: "tfotak (generated)", id: "1331787865301-20", failOnError: true) {
		insert(tableName: "user_role") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "name", value: "Administrator")
		}

		insert(tableName: "user_role") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "name", value: "SelfRegisteredUser")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-19", failOnError: true) {
		insert(tableName: "user_role_permissions") {
			column(name: "user_role_id", valueComputed: "(select id from user_role where name = 'Administrator')")

			column(name: "permissions_string", value: "*")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-22", failOnError: true) {
		insert(tableName: "server") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "IMOS Tile Cache")

			column(name: "short_acron", value: "IMOS_Tile_Cache")

			column(name: "type", value: "WMS-1.1.1")

			column(name: "uri", value: "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi")

			column(name: "allow_discoveries", valueBoolean: "false")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "100")

			column(name: "last_scan_date")

			column(name: "scan_frequency", valueNumeric: "120")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-24", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "baselayer_menu_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f83426893a7bb", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-25", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "contributor_menu_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f8342cb47b476", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-26", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "default_menu_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f8342b75263dc", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-27", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "motd_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f8342c8e226fa", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "motd", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-28", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "region_menu_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f8342be10518f", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-29", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "layer_id", baseTableName: "config_layer", baseTableSchemaName: "public", constraintName: "fk1fe8c214f74bd9a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "layer", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-30", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "parent_id", baseTableName: "layer", baseTableSchemaName: "public", constraintName: "fk61fd551d8611fa1", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "layer", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-31", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "server_id", baseTableName: "layer", baseTableSchemaName: "public", constraintName: "fk61fd55142b61d5a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "server", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-32", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "layer_id", baseTableName: "menu_item", baseTableSchemaName: "public", constraintName: "fka4faa1f3f74bd9a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "layer", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-33", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "menu_id", baseTableName: "menu_item", baseTableSchemaName: "public", constraintName: "fka4faa1f3b784b7da", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-34", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "parent_id", baseTableName: "menu_item", baseTableSchemaName: "public", constraintName: "fka4faa1f3a011e462", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu_item", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-35", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "server_id", baseTableName: "menu_item", baseTableSchemaName: "public", constraintName: "fka4faa1f342b61d5a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "server", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-36", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "org_type_id", baseTableName: "portal_user", baseTableSchemaName: "public", constraintName: "fkf1617fbeffa68f99", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "organisation_type", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-37", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "portal_user_permissions", baseTableSchemaName: "public", constraintName: "fkbd92583761e105a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "portal_user", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-38", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "portal_user_roles", baseTableSchemaName: "public", constraintName: "fkc77d2afc761e105a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "portal_user", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-39", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "user_role_id", baseTableName: "portal_user_roles", baseTableSchemaName: "public", constraintName: "fkc77d2afce5cb2671", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "user_role", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-40", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "owner_id", baseTableName: "snapshot", baseTableSchemaName: "public", constraintName: "fk10fad5c4e204c072", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "portal_user", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-41", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "layer_id", baseTableName: "snapshot_layer", baseTableSchemaName: "public", constraintName: "fka548ab16f74bd9a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "layer", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-42", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "snapshot_id", baseTableName: "snapshot_layer", baseTableSchemaName: "public", constraintName: "fka548ab164f9b61ba", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "snapshot", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-43", failOnError: true) {
		addForeignKeyConstraint(baseColumnNames: "user_role_id", baseTableName: "user_role_permissions", baseTableSchemaName: "public", constraintName: "fk56adf82fe5cb2671", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "user_role", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}
	
	changeSet(author: "tfotak (generated)", id: "1331787865301-44", failOnError: true) {
		insert(tableName: "layer") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "cache", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "true")

			column(name: "name", value: "HiRes_aus-group")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueComputed: "(select id from server where uri = 'http://tilecache.emii.org.au/cgi-bin/tilecache.cgi')")

			column(name: "title", value: "Default Baselayer")

			column(name: "active_in_last_scan", valueBoolean: "true")

			column(name: "blacklisted", valueBoolean: "false")

			column(name: "data_source", value: "Unknown")
		}

		insert(tableName: "layer") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "cache", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "true")

			column(name: "name", value: "default_basemap_simple")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueComputed: "(select id from server where uri = 'http://tilecache.emii.org.au/cgi-bin/tilecache.cgi')")

			column(name: "title", value: "Simple Baselayer")

			column(name: "active_in_last_scan", valueBoolean: "true")

			column(name: "blacklisted", valueBoolean: "false")

			column(name: "data_source", value: "Unknown")
		}

		insert(tableName: "layer") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "cache", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "true")

			column(name: "name", value: "marine_geo")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueComputed: "(select id from server where uri = 'http://tilecache.emii.org.au/cgi-bin/tilecache.cgi')")

			column(name: "title", value: "Marine GEO")

			column(name: "active_in_last_scan", valueBoolean: "true")

			column(name: "blacklisted", valueBoolean: "false")

			column(name: "data_source", value: "Unknown")
		}

		insert(tableName: "layer") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "cache", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "true")

			column(name: "name", value: "satellite")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueComputed: "(select id from server where uri = 'http://tilecache.emii.org.au/cgi-bin/tilecache.cgi')")

			column(name: "title", value: "satellite")

			column(name: "active_in_last_scan", valueBoolean: "true")

			column(name: "blacklisted", valueBoolean: "false")

			column(name: "data_source", value: "Unknown")
		}
	}
	
	changeSet(author: "tfotak (generated)", id: "1331787865301-45", failOnError: true) {
		insert(tableName: "menu") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "title", value: "Default Base Layers")

			column(name: "active", valueBoolean: "true")

			column(name: "edit_date", valueComputed: "now()")
		}
	}
	
	changeSet(author: "tfotak (generated)", id: "1331787865301-46", failOnError: true) {
		insert(tableName: "menu_item") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")
			
			column(name: "text", value: "Default Baselayer")

			column(name: "menu_id", valueComputed: "(select id from menu where title = 'Default Base Layers')")

			column(name: "layer_id", valueComputed: "(select id from layer where name = 'HiRes_aus-group')")

			column(name: "leaf", valueBoolean: "true")
			
			column(name: "menu_position", valueNumeric: "1")
		}
		
		insert(tableName: "menu_item") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")
			
			column(name: "text", value: "Simple Baselayer")

			column(name: "menu_id", valueComputed: "(select id from menu where title = 'Default Base Layers')")

			column(name: "layer_id", valueComputed: "(select id from layer where name = 'default_basemap_simple')")

			column(name: "leaf", valueBoolean: "true")
			
			column(name: "menu_position", valueNumeric: "2")
		}
		
		insert(tableName: "menu_item") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")
			
			column(name: "text", value: "Marine GEO")

			column(name: "menu_id", valueComputed: "(select id from menu where title = 'Default Base Layers')")

			column(name: "layer_id", valueComputed: "(select id from layer where name = 'marine_geo')")

			column(name: "leaf", valueBoolean: "true")
			
			column(name: "menu_position", valueNumeric: "3")
		}
		
		insert(tableName: "menu_item") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")
			
			column(name: "text", value: "Satellite")

			column(name: "menu_id", valueComputed: "(select id from menu where title = 'Default Base Layers')")

			column(name: "layer_id", valueComputed: "(select id from layer where name = 'satellite')")

			column(name: "leaf", valueBoolean: "true")
			
			column(name: "menu_position", valueNumeric: "4")
		}
	}
	
	changeSet(author: "tfotak (generated)", id: "1331787865301-47", failOnError: true) {
		update(tableName: "config") {
			column(name: "baselayer_menu_id", valueComputed: "(select id from menu where title = 'Default Base Layers')")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-49", failOnError: true) {
		insert(tableName: "menu") {
			column(name: "id", valueComputed: "nextval('hibernate_sequence')")

			column(name: "version", valueNumeric: "0")

			column(name: "title", value: "Default Layers Menu")

			column(name: "active", valueBoolean: "true")

			column(name: "edit_date", valueComputed: "now()")
		}
	}

	changeSet(author: "tfotak (generated)", id: "1331787865301-50", failOnError: true) {
		update(tableName: "config") {
			column(name: "default_menu_id", valueComputed: "(select id from menu where title = 'Default Layers Menu')")
		}
	}
}
