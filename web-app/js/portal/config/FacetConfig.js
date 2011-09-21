// List geonetwork facets that should be displayed
// Note: facets returned by geonetwork are defined in geonetwork WEB-INF/config-summary.xml

Portal.data.FacetStore.prototype.include = [
   'keywords',
   'organizationNames',
   'dataParameters'
];

// Map facet plural name returned by geonetwork to lucene index field name
// to be passed to geoentwork xml.search service 
// Note: fields to be indexed by lucene are defined in the geonetwork schema directory for 
// the metadata schema being used e.g. schemaPlugins/iso19139.mcp-1.4/index-fields.xsl for mcp 1.4
// Core schemas such as dublin core, fgdc and iso19139 are defined in geonetwork xml/schemas directory

Portal.search.RefineSearchPanel.prototype.parameters = {
   keywords: 'themekey',
   organizationNames: 'orgName',
   dataParameters: 'longParamName'
};

