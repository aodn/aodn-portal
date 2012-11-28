
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

databaseChangeLog = {

    changeSet(author: "dnahodil (generated)", id: "1353908954037-1", failOnError: true) {

        update(tableName: "config") {
            column(name: "footer_content", value: """\
<p style="margin-left: 210px;">You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make enquiries via <a href="mailto:info@aodn.org.au">info@aodn.org.au</a> to be directed to the data custodian.</p>
<p>This site is licensed under a <a title="Creative Commons License"  href="http://creativecommons.org/licenses/by/3.0/au/" target="_blank"><span style="white-space: nowrap">Creative Commons Attribution 3.0 Australia License</span></a> <a class="external" title="Creative Commons License"  href="http://creativecommons.org/licenses/by/3.0/au/" target="_blank"><img width="80" src="images/by.png"/></a></p>""")
		}
    }

	changeSet(author: "dnahodil (generated)", id: "1353908954037-2", failOnError: true) {

		update(tableName: "config") {
			column(name: "footer_content", value: """\
<p>You accept all risks and responsibility for losses, damages, costs and other consequences resulting directly or indirectly from using this site and any information or material available from it. If you have any concerns about the veracity of the data, please make enquiries via <a href="mailto:info@aodn.org.au">info@aodn.org.au</a> to be directed to the data custodian.</p>
<p>This site is licensed under a <a title="Creative Commons License"  href="http://creativecommons.org/licenses/by/3.0/au/" target="_blank"><span style="white-space: nowrap">Creative Commons Attribution 3.0 Australia License</span></a> <a class="external" title="Creative Commons License"  href="http://creativecommons.org/licenses/by/3.0/au/" target="_blank"><img width="80" src="images/by.png"/></a></p>""")
		}
	}
}