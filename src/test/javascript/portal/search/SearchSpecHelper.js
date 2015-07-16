/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.search.SearchSpecHelper');

Portal.search.SearchSpecHelper.mockSearchResponse = function(searcher, response) {
    var loader = new Ext.tree.TreeLoader({
        preloadChildren: true
    });

    searcher._searchResultRootNode = loader.createNode(response);
    loader.load(searcher._searchResultRootNode);
    searcher.fireEvent('searchcomplete');
}
