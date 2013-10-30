/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal.display

import org.springframework.jdbc.core.JdbcTemplate

class MenuPresenter {

    def id
    def title
    def menuItems
    def serverIds

    MenuPresenter() {}

    MenuPresenter(domainMenu) {
        if (domainMenu) {
            id = domainMenu.id
            title = domainMenu.title

            serverIds = getServerIdsWithAvailableLayers(domainMenu.dataSource)
            _initItems(domainMenu.menuItems)
        }
    }

    def _initItems(domainMenuItems) {
        menuItems = []
        domainMenuItems.each { domainMenuItem ->
            def item = new MenuItemPresenter(domainMenuItem, itemFilter)
            if (item.isViewable(itemFilter)) {
                menuItems << item
            }
        }
    }

    def itemFilter = { item ->
        if ((item.layer && !item.layer.isViewable()) || (item.server && !serverIds.contains(item.server.id))) {
            return false
        }
        return true
    }

    def getServerIdsWithAvailableLayers(dataSource) {
        // We don't explicitly map layers to servers so dropping to JDBC
        def template = new JdbcTemplate(dataSource)
        def query =
            """\
select server.id
from server
join layer on layer.server_id = server.id
where not layer.blacklisted and layer.active_in_last_scan
group by server.id\
"""

        return template.queryForList(query, Long.class)
    }
}
