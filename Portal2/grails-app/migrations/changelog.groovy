
databaseChangeLog = {
	
	include file: 'initialisation.groovy'
	
	// Changes that apply to all instances must be included here above the calls
	// instance specific change logs
	
	// Example
	// include file: 'some-change-to-table-structure.groovy 
	
	include file: 'imos-changelog.groovy'
}
