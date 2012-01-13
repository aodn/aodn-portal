
databaseChangeLog = {

	changeSet(author: "jburgess (generated)", id: "1323929544776-1") {
		createTable(tableName: "aggregation_entry") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "aggregation_entry_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "name", type: "VARCHAR(255)")

			column(name: "uri", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "user_id", type: "int8") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-2") {
		createTable(tableName: "config") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "config_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "default_menu_id", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "enablemotd", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "initial_bbox", type: "VARCHAR(50)") {
				constraints(nullable: "false")
			}

			column(name: "name", type: "VARCHAR(25)") {
				constraints(nullable: "false")
			}

			column(name: "proxy", type: "VARCHAR(255)")

			column(name: "proxy_port", type: "int4")

			column(name: "contributor_menu_id", type: "int8")

			column(name: "region_menu_id", type: "int8")

			column(name: "motd_id", type: "int8")

			column(name: "motd_end", type: "TIMESTAMP WITH TIME ZONE")

			column(name: "motd_start", type: "TIMESTAMP WITH TIME ZONE")

			column(name: "catalog_url", type: "VARCHAR(255)")

			column(name: "footer_height", type: "int4")

			column(name: "header_height", type: "int4")

			column(name: "west_width", type: "int4")

			column(name: "download_cart_max_file_size", type: "int4")

			column(name: "download_cart_max_num_files", type: "int4")

			column(name: "download_cart_filename", type: "VARCHAR(255)")

			column(name: "active_layers_height", type: "int4")

			column(name: "download_cart_mime_type_to_extension_mapping", type: "VARCHAR(2000)")

			column(name: "download_cart_downloadable_protocols", type: "VARCHAR(255)")

			column(name: "metadata_layer_protocols", type: "VARCHAR(255)")

			column(name: "metadata_link_protocols", type: "VARCHAR(255)")

			column(name: "map_get_feature_info_buffer", type: "int4")

			column(name: "baselayer_menu_id", type: "int8")

			column(name: "popup_height", type: "int4")

			column(name: "popup_width", type: "int4")

			column(name: "test_menu_id", type: "int8")

			column(name: "auto_zoom", type: "bool")

			column(name: "wms_scanner_base_url", type: "VARCHAR(255)")

			column(name: "depth_password", type: "VARCHAR(255)")

			column(name: "depth_url", type: "VARCHAR(255)")

			column(name: "depth_user", type: "VARCHAR(255)")

			column(name: "depth_schema", type: "VARCHAR(255)")

			column(name: "depth_table", type: "VARCHAR(255)")

			column(name: "use_depth_service", type: "bool")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-3") {
		createTable(tableName: "config_layer") {
			column(name: "config_default_layers_id", type: "int8")

			column(name: "layer_id", type: "int8")

			column(name: "default_layers_idx", type: "int4")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-4") {
		createTable(tableName: "layer") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "layer_pkey")
			}

			column(name: "version", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "bbox", type: "VARCHAR(255)")

			column(name: "cache", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "cql", type: "VARCHAR(255)")

			column(name: "description", type: "VARCHAR(455)") {
				constraints(nullable: "false")
			}

			column(name: "disabled", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "is_base_layer", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "keywords", type: "VARCHAR(255)")

			column(name: "layers", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "meta_url", type: "VARCHAR(255)")

			column(name: "name", type: "VARCHAR(225)") {
				constraints(nullable: "false")
			}

			column(name: "queryable", type: "bool") {
				constraints(nullable: "false")
			}

			column(name: "server_id", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "style", type: "VARCHAR(255)")

			column(name: "source", type: "VARCHAR(255)")

			column(name: "status", type: "VARCHAR(255)")

			column(name: "currently_active", type: "bool")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-5") {
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

			column(name: "json", type: "TEXT") {
				constraints(nullable: "false")
			}

			column(name: "title", type: "VARCHAR(40)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-6") {
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

	changeSet(author: "jburgess (generated)", id: "1323929544776-7") {
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

	changeSet(author: "jburgess (generated)", id: "1323929544776-8") {
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

			column(name: "password_hash", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "postcode", type: "VARCHAR(255)")

			column(name: "state", type: "VARCHAR(255)")

			column(name: "org_type_id", type: "int8")

			column(defaultValue: "portal2", name: "source", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-9") {
		createTable(tableName: "portal_user_permissions") {
			column(name: "user_id", type: "int8")

			column(name: "permissions_string", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-10") {
		createTable(tableName: "portal_user_roles") {
			column(name: "user_id", type: "int8") {
				constraints(nullable: "false")
			}

			column(name: "user_role_id", type: "int8") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-11") {
		createTable(tableName: "saved_search") {
			column(name: "id", type: "int8") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "saved_search_pkey")
			}

			column(defaultValueComputed: "(-999)", name: "east", type: "FLOAT8(17)")

			column(defaultValueComputed: "(-999)", name: "west", type: "FLOAT8(17)")

			column(defaultValueComputed: "(-999)", name: "north", type: "FLOAT8(17)")

			column(defaultValueComputed: "(-999)", name: "south", type: "FLOAT8(17)")

			column(name: "startdate", type: "DATE")

			column(name: "enddate", type: "DATE")

			column(name: "keyword", type: "VARCHAR(255)")

			column(name: "userid", type: "int8")

			column(name: "searchname", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-12") {
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

			column(name: "parse_date", type: "TIMESTAMP WITH TIME ZONE") {
				constraints(nullable: "false")
			}

			column(name: "parse_frequency", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(name: "short_acron", type: "VARCHAR(16)") {
				constraints(nullable: "false")
			}

			column(name: "type", type: "VARCHAR(12)") {
				constraints(nullable: "false")
			}

			column(name: "uri", type: "VARCHAR(255)") {
				constraints(nullable: "false")
			}

			column(defaultValueBoolean: "true", name: "allow_discoveries", type: "bool")

			column(name: "image_format", type: "VARCHAR(9)")

			column(name: "opacity", type: "int4")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-13") {
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

	changeSet(author: "jburgess (generated)", id: "1323929544776-14") {
		createTable(tableName: "user_role_permissions") {
			column(name: "user_role_id", type: "int8")

			column(name: "permissions_string", type: "VARCHAR(255)")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-15") {
		addPrimaryKey(columnNames: "user_id, user_role_id", constraintName: "portal_user_roles_pkey", tableName: "portal_user_roles")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-16") {
		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "5")

			column(name: "version", valueNumeric: "0")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "Argo Floats in Australian Waters")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "argo_float")

			column(name: "meta_url", value: "argo_float")

			column(name: "name", value: "Argo Floats")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "2")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "26")

			column(name: "version", valueNumeric: "0")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "2001_ABOM-L3P_GHRSST-SSTsubskin-AVHRR_MOSAIC_01km-AO_DA")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "2001_ABOM-L3P_GHRSST-SSTsubskin-AVHRR_MOSAIC_01km-AO_DAAC-v01-fv01_0%2Fsea_surface_temperature")

			column(name: "meta_url")

			column(name: "name", value: "SST from ivec")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "4")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "13")

			column(name: "version", valueNumeric: "1")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "Southern Ocean Time Series")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords", value: "glider")

			column(name: "layers", value: "sots")

			column(name: "meta_url")

			column(name: "name", value: "SOTS Locations")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "2")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "7")

			column(name: "version", valueNumeric: "1")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "SOOP CPR zooview")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "zooview")

			column(name: "meta_url")

			column(name: "name", value: "Zooview ")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "2")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "37")

			column(name: "version", valueNumeric: "2")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "basic")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "true")

			column(name: "keywords")

			column(name: "layers", value: "default_basemap_simple")

			column(name: "meta_url")

			column(name: "name", value: "Simple Baselayer")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "6")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "8")

			column(name: "version", valueNumeric: "1")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "Base Layer")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "true")

			column(name: "keywords", value: "Base Layer")

			column(name: "layers", value: "HiRes_aus-group")

			column(name: "meta_url")

			column(name: "name", value: "Default Baselayer")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "6")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "67")

			column(name: "version", valueNumeric: "0")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "South East Tas Surf")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "setas_surf_fcst.temp")

			column(name: "meta_url")

			column(name: "name", value: "setas_surf_fcst.temp")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "66")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "72")

			column(name: "version", valueNumeric: "0")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "ocean_east_aus_temp/temp")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "ocean_east_aus_temp/temp")

			column(name: "meta_url")

			column(name: "name", value: "ocean_east_aus_temp/temp")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "71")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "35")

			column(name: "version", valueNumeric: "2")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql", value: "platform_number like '5900182'")

			column(name: "description", value: "test of cql")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "argo_float")

			column(name: "meta_url")

			column(name: "name", value: "Argo - CQL!")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "2")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "87")

			column(name: "version", valueNumeric: "0")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "satellite Nasa whirlwind")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "true")

			column(name: "keywords")

			column(name: "layers", value: "satellite")

			column(name: "meta_url")

			column(name: "name", value: "satellite")

			column(name: "queryable", valueBoolean: "false")

			column(name: "server_id", valueNumeric: "6")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "86")

			column(name: "version", valueNumeric: "1")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "Marine Geoscience Data System (MGDS)")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "true")

			column(name: "keywords")

			column(name: "layers", value: "marine_geo")

			column(name: "meta_url")

			column(name: "name", value: "Marine GEO")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "6")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "90")

			column(name: "version", valueNumeric: "0")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "ACORN_raw_data_SAG/SPEED")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "ACORN_raw_data_SAG/SPEED")

			column(name: "meta_url")

			column(name: "name", value: "ACORN_raw_data_SAG/SPEED")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "71")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "12")

			column(name: "version", valueNumeric: "1")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "abos tracks")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "abos_tracks")

			column(name: "meta_url", value: "abos_tracks")

			column(name: "name", value: "abos_tracks")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "2")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "true")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "97")

			column(name: "version", valueNumeric: "19")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "Layer One")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "layer_won")

			column(name: "meta_url", value: "Fri Nov 25 13:34:05 EST 2011")

			column(name: "name", value: "layer_won")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "96")

			column(name: "style")

			column(name: "source", value: "WmsScanner")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "101")

			column(name: "version", valueNumeric: "2")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "Mon Nov 28 12:05:03 EST 2011")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "satellite")

			column(name: "meta_url", value: "http://www.google.com/")

			column(name: "name", value: "layer_too")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "96")

			column(name: "style")

			column(name: "source", value: "WmsScanner")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "75")

			column(name: "version", valueNumeric: "4")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "INFORMD_STORM/h1agrid")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "INFORMD_STORM/h1agrid")

			column(name: "meta_url")

			column(name: "name", value: "INFORMD_STORM/h1agrid")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "28")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "108")

			column(name: "version", valueNumeric: "0")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "SOOP XBT")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "soop_xbt")

			column(name: "meta_url")

			column(name: "name", value: "soop_xbt")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "105")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "109")

			column(name: "version", valueNumeric: "0")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "anfog_glider")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "anfog_glider")

			column(name: "meta_url")

			column(name: "name", value: "anfog_glider")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "105")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}

		insert(tableName: "layer") {
			column(name: "id", valueNumeric: "110")

			column(name: "version", valueNumeric: "0")

			column(name: "bbox")

			column(name: "cache", valueBoolean: "false")

			column(name: "cql")

			column(name: "description", value: "argo_aggregation")

			column(name: "disabled", valueBoolean: "false")

			column(name: "is_base_layer", valueBoolean: "false")

			column(name: "keywords")

			column(name: "layers", value: "argo_aggregation")

			column(name: "meta_url")

			column(name: "name", value: "argo_aggregation")

			column(name: "queryable", valueBoolean: "true")

			column(name: "server_id", valueNumeric: "2")

			column(name: "style")

			column(name: "source", value: "Manual")

			column(name: "status")

			column(name: "currently_active", valueBoolean: "false")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-17") {
		insert(tableName: "config") {
			column(name: "id", valueNumeric: "19")

			column(name: "version", valueNumeric: "109")

			column(name: "default_menu_id", valueNumeric: "9")

			column(name: "enablemotd", valueBoolean: "false")

			column(name: "initial_bbox", value: "99,-50,140,-10")

			column(name: "name", value: "The New Portal")

			column(name: "proxy")

			column(name: "proxy_port")

			column(name: "contributor_menu_id", valueNumeric: "18")

			column(name: "region_menu_id", valueNumeric: "14")

			column(name: "motd_id", valueNumeric: "21")

			column(name: "motd_end", valueDate: "2011-10-27T17:39:00.0")

			column(name: "motd_start", valueDate: "2011-08-25T16:52:00.0")

			column(name: "catalog_url", value: "http://mest-test.emii.org.au/geonetwork")

			column(name: "footer_height", valueNumeric: "50")

			column(name: "header_height", valueNumeric: "95")

			column(name: "west_width", valueNumeric: "290")

			column(name: "download_cart_max_file_size", valueNumeric: "10485760")

			column(name: "download_cart_max_num_files", valueNumeric: "100")

			column(name: "download_cart_filename", value: "\"aodn portal download (%s).zip\"")

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

			column(name: "download_cart_downloadable_protocols", value: '''WWW:DOWNLOAD-1.0-http--download
WWW:DOWNLOAD-1.0-http--downloaddata
WWW:DOWNLOAD-1.0-http--downloadother
WWW:LINK-1.0-http--downloaddata''')

			column(name: "metadata_layer_protocols", value: '''OGC:WMS-1.1.1-http-get-map
OGC:WMS-1.3.0-http-get-map''')

			column(name: "metadata_link_protocols", value: "WWW:LINK-1.0-http--link")

			column(name: "map_get_feature_info_buffer", valueNumeric: "10")

			column(name: "baselayer_menu_id", valueNumeric: "20")

			column(name: "popup_height", valueNumeric: "325")

			column(name: "popup_width", valueNumeric: "435")

			column(name: "test_menu_id")

			column(name: "auto_zoom", valueBoolean: "false")

			column(name: "wms_scanner_base_url", value: "http://localhost:3333/scanJob")

			column(name: "depth_password")

			column(name: "depth_url")

			column(name: "depth_user")

			column(name: "depth_schema")

			column(name: "depth_table")

			column(name: "use_depth_service")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-18") {
		insert(tableName: "organisation_type") {
			column(name: "id", valueNumeric: "1")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "Government")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueNumeric: "2")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "International organisation")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueNumeric: "3")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "NGO")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueNumeric: "4")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "University/research centre")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueNumeric: "5")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "Private company")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueNumeric: "6")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "Independant consultant")
		}

		insert(tableName: "organisation_type") {
			column(name: "id", valueNumeric: "7")

			column(name: "version", valueNumeric: "0")

			column(name: "description", value: "Other")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-19") {
		insert(tableName: "motd") {
			column(name: "id", valueNumeric: "21")

			column(name: "version", valueNumeric: "2")

			column(name: "motd", value: "Everything will be allright")

			column(name: "motd_title", value: "Its Fine")
		}

		insert(tableName: "motd") {
			column(name: "id", valueNumeric: "22")

			column(name: "version", valueNumeric: "0")

			column(name: "motd", value: "This popup is a new feature. <BR>Its a Ext.Panel inside a Ext.Window")

			column(name: "motd_title", value: "New features")
		}

		insert(tableName: "motd") {
			column(name: "id", valueNumeric: "25")

			column(name: "version", valueNumeric: "1")

			column(name: "motd", value: '''hich is how to not escape specific strings when global HTML escaping is turned on.
Manual escaping

Out of the box (i.e. with a vanilla Grails app with default config) you need to explicitly escape any dangerous strings with the encodeAsHTML() function that Grails makes available on all Strings: ${dangerString.encodeAsHTML()}. This is a bit verbose, but at least it's very clear, and because it's just a method on String it's available everywhere in your app, not just in GSPs.
Auto-escaping with default codec

If you modify Config.groovy to contain grails.views.default.codec = "html" (which is there by default and set to "none") then it automatically calls encodeAsHTML() for you whenever you use ${} in GSPs. This is clearly quite a handy option and a much safer way of configuring things as it lessens the likelihood of slipping up and leaving a hole in your app.
Overriding auto-escaping per item

So far this is all exactly as per the Grails docs (which go into much more detail on codecs and what's really going on, including creating your own) but the crucial bit they fail to mention is what to do if you've turned on the global html codec, but have situations where you don't want escaping. The answer is to simply use the alternative JSP style interpolation syntax <%=mySafeHTMLString%> since the code
''')

			column(name: "motd_title", value: "Lots of Text")
		}

		insert(tableName: "motd") {
			column(name: "id", valueNumeric: "29")

			column(name: "version", valueNumeric: "0")

			column(name: "motd", value: "Drain some into your wastebin today!")

			column(name: "motd_title", value: "We love tuna!")
		}

		insert(tableName: "motd") {
			column(name: "id", valueNumeric: "30")

			column(name: "version", valueNumeric: "0")

			column(name: "motd", value: "Welcome to the new Portal. Have a look around and later we will have cake.")

			column(name: "motd_title", value: "Le message du jour")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-20") {
		insert(tableName: "user_role_permissions") {
			column(name: "user_role_id", valueNumeric: "1")

			column(name: "permissions_string", value: "*")
		}

		insert(tableName: "user_role_permissions") {
			column(name: "user_role_id", valueNumeric: "2")

			column(name: "permissions_string", value: "user:updateAccount")
		}

		insert(tableName: "user_role_permissions") {
			column(name: "user_role_id", valueNumeric: "2")

			column(name: "permissions_string", value: "user:userUpdateAccount")
		}

		insert(tableName: "user_role_permissions") {
			column(name: "user_role_id", valueNumeric: "94")

			column(name: "permissions_string", value: "layer:saveOrUpdate")
		}

		insert(tableName: "user_role_permissions") {
			column(name: "user_role_id", valueNumeric: "94")

			column(name: "permissions_string", value: "layer:disableLayer")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-21") {
		insert(tableName: "menu") {
			column(name: "id", valueNumeric: "18")

			column(name: "version", valueNumeric: "3")

			column(name: "active", valueBoolean: "false")

			column(name: "edit_date", valueDate: "2011-08-12T16:17:14.138")

			column(name: "json", value: '''[{"text":"ABOS Tracks","grailsLayerId":"12","leaf":"true"}]''')

			column(name: "title", value: "ok")
		}

		insert(tableName: "menu") {
			column(name: "id", valueNumeric: "14")

			column(name: "version", valueNumeric: "37")

			column(name: "active", valueBoolean: "false")

			column(name: "edit_date", valueDate: "2011-08-11T15:31:27.435")

			column(name: "json", value: '''[{"text":"ABOS Tracks","grailsLayerId":"12","leaf":"true"},{"text":"ABOS Tracks","grailsLayerId":"12","leaf":"true"},{"text":"Zooview ","grailsLayerId":"7","children":[{"text":"SOTS Locations","grailsLayerId":"13","leaf":"true"}],"leaf":"true"},{"text":"extras","children":[{"text":"SOTS Locations","grailsLayerId":"13","leaf":"true"},{"text":"ABOS Tracks","grailsLayerId":"12","leaf":"true"},{"text":"more","children":[{"text":"stuff","leaf":"false"},{"text":"Zooview ","grailsLayerId":"7","leaf":"true"}],"leaf":"false"},{"text":"Zooview ","grailsLayerId":"7","leaf":"true"}],"leaf":"false"}]''')

			column(name: "title", value: "test")
		}

		insert(tableName: "menu") {
			column(name: "id", valueNumeric: "9")

			column(name: "version", valueNumeric: "79")

			column(name: "active", valueBoolean: "true")

			column(name: "edit_date", valueDate: "2011-12-09T09:44:53.50")

			column(name: "json", value: '''[{"text":"IVEC ncWMS Server","children":[],"grailsServerId":"4","leaf":false},{"text":"Argo - CQL","grailsLayerId":"35","leaf":true},{"text":"argo_aggregation","grailsLayerId":"110","leaf":true},{"text":"anfog_glider","grailsLayerId":"109","leaf":true},{"text":"ABOS Tracks","grailsLayerId":"12","leaf":true},{"text":"soop_xbt","grailsLayerId":"108","leaf":true},{"text":"SOTS Locations","grailsLayerId":"13","leaf":true},{"text":"Zooview ","grailsLayerId":"7","leaf":true},{"text":"INFORMD_STORM/w","grailsLayerId":"75","leaf":true},{"text":"Argo - CQL","grailsLayerId":"35","leaf":true},{"text":"NcWMS Layers","children":[{"text":"SST from ivec","grailsLayerId":"26","leaf":true},{"text":"ACORN_raw_data_SAG/SPEED","grailsLayerId":"90","leaf":true},{"text":"ocean_east_aus_temp/temp","grailsLayerId":"72","leaf":true}],"leaf":false}]''')

			column(name: "title", value: "Main")
		}

		insert(tableName: "menu") {
			column(name: "id", valueNumeric: "83")

			column(name: "version", valueNumeric: "2")

			column(name: "active", valueBoolean: "false")

			column(name: "edit_date", valueDate: "2011-11-15T16:07:13.803")

			column(name: "json", value: '''[{"text":"Argo Floats","grailsLayerId":"5","leaf":true},{"text":"Zooview ","grailsLayerId":"7","leaf":true},{"text":"test TURQ files","grailsLayerId":"76","leaf":true},{"text":"SST from ivec","grailsLayerId":"26","leaf":true},{"text":"Argo - CQL","grailsLayerId":"35","leaf":true}]''')

			column(name: "title", value: "David's Test")
		}

		insert(tableName: "menu") {
			column(name: "id", valueNumeric: "20")

			column(name: "version", valueNumeric: "5")

			column(name: "active", valueBoolean: "false")

			column(name: "edit_date", valueDate: "2011-11-17T16:40:58.36")

			column(name: "json", value: '''[{"text":"Default Baselayer","grailsLayerId":"8","leaf":true},{"text":"Simple Baselayer","grailsLayerId":"37","leaf":true},{"text":"satellite","grailsLayerId":"87","leaf":true},{"text":"marine_geo","grailsLayerId":"86","leaf":true}]''')

			column(name: "title", value: "Base Layers")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-22") {
		insert(tableName: "user_role") {
			column(name: "id", valueNumeric: "1")

			column(name: "version", valueNumeric: "3")

			column(name: "name", value: "Administrator")
		}

		insert(tableName: "user_role") {
			column(name: "id", valueNumeric: "94")

			column(name: "version", valueNumeric: "1")

			column(name: "name", value: "LayerApiUser")
		}

		insert(tableName: "user_role") {
			column(name: "id", valueNumeric: "2")

			column(name: "version", valueNumeric: "21")

			column(name: "name", value: "SelfRegisteredUser")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-23") {
		insert(tableName: "config_layer") {
			column(name: "config_default_layers_id", valueNumeric: "19")

			column(name: "layer_id", valueNumeric: "5")

			column(name: "default_layers_idx", valueNumeric: "0")
		}

		insert(tableName: "config_layer") {
			column(name: "config_default_layers_id", valueNumeric: "19")

			column(name: "layer_id", valueNumeric: "72")

			column(name: "default_layers_idx", valueNumeric: "1")
		}

		insert(tableName: "config_layer") {
			column(name: "config_default_layers_id", valueNumeric: "19")

			column(name: "layer_id", valueNumeric: "75")

			column(name: "default_layers_idx", valueNumeric: "2")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-24") {
		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "4")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "5")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "6")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "7")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "1")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "2")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "8")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "9")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "10")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "73")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "74")

			column(name: "user_role_id", valueNumeric: "2")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "77")

			column(name: "user_role_id", valueNumeric: "2")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "78")

			column(name: "user_role_id", valueNumeric: "1")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "82")

			column(name: "user_role_id", valueNumeric: "2")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "95")

			column(name: "user_role_id", valueNumeric: "94")
		}

		insert(tableName: "portal_user_roles") {
			column(name: "user_id", valueNumeric: "111")

			column(name: "user_role_id", valueNumeric: "2")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-25") {
		insert(tableName: "server") {
			column(name: "id", valueNumeric: "96")

			column(name: "version", valueNumeric: "1")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "David's test server")

			column(name: "parse_date", valueDate: "2011-11-24T14:09:29.974")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "DN1")

			column(name: "type", value: "WMS-1.3.0")

			column(name: "uri", value: "http://www.davidstestserver.com/")

			column(name: "allow_discoveries", valueBoolean: "false")

			column(name: "image_format")

			column(name: "opacity")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "103")

			column(name: "version", valueNumeric: "1")

			column(name: "comments", value: "allowed host for data.aims.gov.au")

			column(name: "disable", valueBoolean: "true")

			column(name: "name", value: "aims real end point")

			column(name: "parse_date", valueDate: "2011-12-01T14:35:34.180")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "aims-host")

			column(name: "type", value: "WMS-1.1.1")

			column(name: "uri", value: "http://maps.aims.gov.au/geoserver/wms?SERVICE=WMS")

			column(name: "allow_discoveries", valueBoolean: "false")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "100")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "27")

			column(name: "version", valueNumeric: "1")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "AIMS-Test")

			column(name: "parse_date", valueDate: "2011-12-01T15:07:03.939")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "AIMS-Test")

			column(name: "type", value: "WMS-1.1.1")

			column(name: "uri", value: "http://data.aims.gov.au/reef-page-plots/zoneplots/aims-getcapabilities.xml")

			column(name: "allow_discoveries", valueBoolean: "true")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "100")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "66")

			column(name: "version", valueNumeric: "5")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "CSIRO Tasman")

			column(name: "parse_date", valueDate: "2011-12-01T15:07:28.401")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "csiro_tasman")

			column(name: "type", value: "NCWMS-1.3.0")

			column(name: "uri", value: "http://www.csiro.au/tasman/ncWMS/wms")

			column(name: "allow_discoveries", valueBoolean: "false")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "50")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "28")

			column(name: "version", valueNumeric: "9")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "emii DEV ncWMS server")

			column(name: "parse_date", valueDate: "2011-12-01T15:08:07.25")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "emii_dev_ncwms")

			column(name: "type", value: "NCWMS-1.3.0")

			column(name: "uri", value: "http://ncwmsdev.emii.org.au/ncWMS/wms")

			column(name: "allow_discoveries", valueBoolean: "true")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "50")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "6")

			column(name: "version", valueNumeric: "4")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "IMOS Tile Cache")

			column(name: "parse_date", valueDate: "2011-12-01T15:08:23.447")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "IMOS_Tile_Cache")

			column(name: "type", value: "WMS-1.1.1")

			column(name: "uri", value: "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi")

			column(name: "allow_discoveries", valueBoolean: "false")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "100")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "71")

			column(name: "version", valueNumeric: "3")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "eMII ncWMS Server")

			column(name: "parse_date", valueDate: "2011-12-01T15:09:01.559")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "ncwms_emii")

			column(name: "type", value: "NCWMS-1.3.0")

			column(name: "uri", value: "http://ncwms.emii.org.au/ncWMS/wms")

			column(name: "allow_discoveries", valueBoolean: "true")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "50")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "104")

			column(name: "version", valueNumeric: "1")

			column(name: "comments", value: "ramadda is added elsewhere in the code")

			column(name: "disable", valueBoolean: "true")

			column(name: "name", value: "ramadda")

			column(name: "parse_date", valueDate: "2011-12-01T15:09:23.65")

			column(name: "parse_frequency", value: "never")

			column(name: "short_acron", value: "ramadda")

			column(name: "type", value: "WMS-1.1.1")

			column(name: "uri", value: "http://ramadda.aodn.org.au/repository/")

			column(name: "allow_discoveries", valueBoolean: "false")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "75")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "2")

			column(name: "version", valueNumeric: "3")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "eMII development WMS server")

			column(name: "parse_date", valueDate: "2011-12-06T15:58:23.717")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "geodev")

			column(name: "type", value: "WMS-1.1.1")

			column(name: "uri", value: "http://geoserverdev.emii.org.au/geoserver/wms")

			column(name: "allow_discoveries", valueBoolean: "true")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "100")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "105")

			column(name: "version", valueNumeric: "0")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "Geoserver")

			column(name: "parse_date", valueDate: "2011-12-06T15:59:13.391")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "eMIIgeoserver")

			column(name: "type", value: "WMS-1.1.1")

			column(name: "uri", value: "	http://geoserver.emii.org.au/geoserver/wms")

			column(name: "allow_discoveries", valueBoolean: "true")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "100")
		}

		insert(tableName: "server") {
			column(name: "id", valueNumeric: "4")

			column(name: "version", valueNumeric: "4")

			column(name: "comments")

			column(name: "disable", valueBoolean: "false")

			column(name: "name", value: "IVEC ncWMS Server")

			column(name: "parse_date", valueDate: "2011-12-12T15:52:52.219")

			column(name: "parse_frequency", value: "")

			column(name: "short_acron", value: "IVEC")

			column(name: "type", value: "NCWMS-1.3.0")

			column(name: "uri", value: "http://opendap-ivec.arcs.org.au/ncwms/wms")

			column(name: "allow_discoveries", valueBoolean: "true")

			column(name: "image_format", value: "image/png")

			column(name: "opacity", valueNumeric: "50")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-26") {
		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "73")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "pmbohm@utas.edu.au")

			column(name: "first_name", value: "Philip")

			column(name: "last_name", value: "Bohm")

			column(name: "organisation")

			column(name: "password_hash", value: "ddaf27a823db853ef803394a2b11c7325dfe16e7755d0ec5d112eb6ce142a486")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "74")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "peter.blain@utsa.edu.au")

			column(name: "first_name", value: "Peter")

			column(name: "last_name", value: "Blain")

			column(name: "organisation")

			column(name: "password_hash", value: "9dfd0dc6be0cdd79489a67e42ba10f04a1e39790a1b67b2256d0ce402f3049fe")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "77")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "marty.hidas@utas.edu.au")

			column(name: "first_name", value: "Marty")

			column(name: "last_name", value: "Hidas")

			column(name: "organisation", value: "IMOS")

			column(name: "password_hash", value: "a1a2c6750abe861c13560232282a73f33096a560ac905b8da5e08f569fb7fb6c")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "4")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "jonathan.burgess@utas.edu.au")

			column(name: "first_name", value: "Jon")

			column(name: "last_name", value: "Burgess")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "5")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "pauline.mak@utas.edu.au")

			column(name: "first_name", value: "Pauline")

			column(name: "last_name", value: "Mak")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "7")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "philip.bohm@utas.edu.au")

			column(name: "first_name", value: "Phil")

			column(name: "last_name", value: "Bohm")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "82")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "dnahodil@gmail.com")

			column(name: "first_name", value: "Awesome")

			column(name: "last_name", value: "McTavish")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "8")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "roger.proctor@utas.edu.au")

			column(name: "first_name", value: "Roger")

			column(name: "last_name", value: "Proctor")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "10")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "tommy.fotak@utas.edu.au")

			column(name: "first_name", value: "Tommy")

			column(name: "last_name", value: "Fotak")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "9")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "sebastien.mancini@utas.edu.au")

			column(name: "first_name", value: "Sebastien")

			column(name: "last_name", value: "Mancini")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "78")

			column(name: "version", valueNumeric: "7")

			column(name: "address", value: "Private Bag 21")

			column(name: "country", value: "Australia")

			column(name: "email_address", value: "kate.reid@utas.edu.au")

			column(name: "first_name", value: "Kate")

			column(name: "last_name", value: "Reid")

			column(name: "organisation", value: "eMII")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode", value: "7001")

			column(name: "state", value: "Tasmania")

			column(name: "org_type_id", valueNumeric: "4")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "95")

			column(name: "version", valueNumeric: "1")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "dnahodil+layerapitest1@gmail.com")

			column(name: "first_name", value: "Layer API User")

			column(name: "last_name", value: "IMOS eMII Team")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "1")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "craig.jones@utas.edu.au")

			column(name: "first_name", value: "Craig")

			column(name: "last_name", value: "Jones")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "2")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "david.nahodil@utas.edu.au")

			column(name: "first_name", value: "David")

			column(name: "last_name", value: "Nahodil")

			column(name: "organisation")

			column(name: "password_hash", value: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "6")

			column(name: "version", valueNumeric: "3")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "peter.blain@utas.edu.au")

			column(name: "first_name", value: "Peter")

			column(name: "last_name", value: "Blain")

			column(name: "organisation")

			column(name: "password_hash", value: "061264c9251e6c4db0f13e3fcfa4e9a67b39df237358b0151773b217238c60f7")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}

		insert(tableName: "portal_user") {
			column(name: "id", valueNumeric: "111")

			column(name: "version", valueNumeric: "0")

			column(name: "address")

			column(name: "country")

			column(name: "email_address", value: "k8_18@hotmail.com")

			column(name: "first_name", value: "Aqium")

			column(name: "last_name", value: "Gel")

			column(name: "organisation")

			column(name: "password_hash", value: "620ebda90541bae09e6881ab29f62c19bb368c151decc63550dd6b5f12e730ef")

			column(name: "postcode")

			column(name: "state")

			column(name: "org_type_id")

			column(name: "source", value: "portal2")
		}
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-27") {
		addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "aggregation_entry", baseTableSchemaName: "public", constraintName: "fk99b3e0d5761e105a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "portal_user", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-28") {
		addForeignKeyConstraint(baseColumnNames: "baselayer_menu_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f83426893a7bb", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-29") {
		addForeignKeyConstraint(baseColumnNames: "contributor_menu_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f8342cb47b476", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-30") {
		addForeignKeyConstraint(baseColumnNames: "default_menu_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f8342b75263dc", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-31") {
		addForeignKeyConstraint(baseColumnNames: "motd_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f8342c8e226fa", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "motd", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-32") {
		addForeignKeyConstraint(baseColumnNames: "region_menu_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f8342be10518f", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-33") {
		addForeignKeyConstraint(baseColumnNames: "test_menu_id", baseTableName: "config", baseTableSchemaName: "public", constraintName: "fkaf3f83426acdf12d", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "menu", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-34") {
		addForeignKeyConstraint(baseColumnNames: "layer_id", baseTableName: "config_layer", baseTableSchemaName: "public", constraintName: "fk1fe8c214f74bd9a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "layer", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-35") {
		addForeignKeyConstraint(baseColumnNames: "server_id", baseTableName: "layer", baseTableSchemaName: "public", constraintName: "fk61fd55142b61d5a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "server", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-36") {
		addForeignKeyConstraint(baseColumnNames: "org_type_id", baseTableName: "portal_user", baseTableSchemaName: "public", constraintName: "fkf1617fbeffa68f99", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "organisation_type", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-37") {
		addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "portal_user_permissions", baseTableSchemaName: "public", constraintName: "fkbd92583761e105a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "portal_user", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-38") {
		addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "portal_user_roles", baseTableSchemaName: "public", constraintName: "fkc77d2afc761e105a", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "portal_user", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-39") {
		addForeignKeyConstraint(baseColumnNames: "user_role_id", baseTableName: "portal_user_roles", baseTableSchemaName: "public", constraintName: "fkc77d2afce5cb2671", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "user_role", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-40") {
		addForeignKeyConstraint(baseColumnNames: "userid", baseTableName: "saved_search", baseTableSchemaName: "public", constraintName: "user_id_fkey", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "portal_user", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-41") {
		addForeignKeyConstraint(baseColumnNames: "user_role_id", baseTableName: "user_role_permissions", baseTableSchemaName: "public", constraintName: "fk56adf82fe5cb2671", deferrable: "false", initiallyDeferred: "false", onDelete: "NO ACTION", onUpdate: "NO ACTION", referencedColumnNames: "id", referencedTableName: "user_role", referencedTableSchemaName: "public", referencesUniqueColumn: "false")
	}

	changeSet(author: "jburgess (generated)", id: "1323929544776-42") {
		createSequence(schemaName: "public", sequenceName: "hibernate_sequence")
	}

	include file: 'depth_service_and_gorm_sync.groovy'

	include file: '20111221 - DN - Adding footer content to config.groovy'
	
	include file: 'footerContentPhil.groovy'

	include file: 'footerContentWidth.groovy'        
    
	include file: '20111222-JB-snapshot.groovy'

	include file: 'config_increasedLengthOfName.groovy'
	
	include file: '1325653962795.groovy'
	
	include file: '1325732622000.groovy'
	
	include file: '1326408271000.groovy'

	include file: '20120113-DN-LayerChanges.groovy'
}
