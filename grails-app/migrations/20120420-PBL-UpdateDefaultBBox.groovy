
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

	changeSet(author: "pblain", id: "1334894066271-1") {
		
		update(tableName: "config") {
			
						column(name: "initial_bbox", value: "110,-50,160,-3")
					}
				}
}
