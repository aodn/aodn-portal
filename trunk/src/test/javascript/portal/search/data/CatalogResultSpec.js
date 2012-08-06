describe("Portal.search.data.CatalogResult", function() {

  var ResultRecord = Ext.data.Record.create([
    { name: 'title' }, 
    { name: 'abstract'},
    { name: 'uuid' }, 
    { name: 'links' }, 
    { name: 'source' },
    { name: 'canDownload' }, 
    { name: 'bbox' }
  ]);

  it('binds properties to record fields', function() {
	  
	  var resultRecord = new ResultRecord({
          title: 'title value',
          'abstract': 'abstract value',
          uuid: 'uuid value',
          links: [{
        	href: 'href value',
  			name: 'name value',
			protocol: 'protocol value',
			title: 'title value',
			type: 'type value'
          }],
          source: 'source value',
          canDownload: true,
          bbox: 'bbox value'
	  });

	  var result = new Portal.search.data.CatalogResult({record: resultRecord});
	  
	  expect(result.title).toEqual('title value');
	  expect(result['abstract']).toEqual('abstract value');
	  expect(result.uuid).toEqual('uuid value');
	  expect(result.source).toEqual('source value');
	  expect(result.canDownload).toEqual(true);
	  expect(result.bbox).toEqual('bbox value');
	  
	  var link = result.links[0];
	  
	  expect(link.href).toEqual('href value');
	  expect(link.name).toEqual('name value');
	  expect(link.protocol).toEqual('protocol value');
	  expect(link.title).toEqual('title value');
	  expect(link.type).toEqual('type value');
	  
  });

  it('gets downloadable links', function() {
	  
	  var resultRecord = new ResultRecord({
          title: 'title value',
          'abstract': 'abstract value',
          uuid: 'uuid value',
          links: [{
        	href: 'http://opendap-ivec.arcs.org.au/thredds/fileServer/IMOS/ANFOG/slocum_glider/Fremantle20090327/IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc.html',
  			name: 'IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc',
			protocol: 'WWW:LINK-1.0-http--link',
			title: 'Data available via the IMOS OPeNDAP server',
			type: 'type value'
          },{
        	href: 'http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=6783&fname=ANFOG_SL106_Fremantle-5_TEMP.jpg&access=private',
        	name: 'ANFOG_SL106_Fremantle-5_TEMP.jpg',
			protocol: 'WWW:DOWNLOAD-1.0-http--download',
			title: 'Temperature measured during the deployment (JPEG file)',
			type: 'type value'
          },{
        	href: 'http://opendap-ivec.arcs.org.au/thredds/fileServer/IMOS/ANFOG/slocum_glider/Fremantle20090327/IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc',
  			name: 'IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc',
			protocol: 'WWW:LINK-1.0-http--downloaddata',
			title: 'Download data from the IMOS THREDDS server',
			type: 'type value'
          }],
          source: 'source value',
          canDownload: true,
          bbox: 'bbox value'
	  });

	  var result = new Portal.search.data.CatalogResult({record: resultRecord});
	  var downloads = result.getDownloadLinks(['WWW:DOWNLOAD-1.0-http--download', 'WWW:LINK-1.0-http--downloaddata'])

	  expect(downloads.length).toEqual(2);
	  expect(downloads[0].link.name).toEqual('ANFOG_SL106_Fremantle-5_TEMP.jpg');
	  expect(downloads[1].link.name).toEqual('IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc');
  });

  it('checks geonetwork download privileges', function() {
	  
	  var resultRecord = new ResultRecord({
          title: 'title value',
          'abstract': 'abstract value',
          uuid: 'uuid value',
          links: [{
        	href: 'http://opendap-ivec.arcs.org.au/thredds/fileServer/IMOS/ANFOG/slocum_glider/Fremantle20090327/IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc.html',
  			name: 'IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc',
			protocol: 'WWW:LINK-1.0-http--link',
			title: 'Data available via the IMOS OPeNDAP server',
			type: 'type value'
          },{
        	href: 'http://imosmest.aodn.org.au:80/geonetwork/srv/en/file.disclaimer?id=6783&fname=ANFOG_SL106_Fremantle-5_TEMP.jpg&access=private',
        	name: 'ANFOG_SL106_Fremantle-5_TEMP.jpg',
			protocol: 'WWW:DOWNLOAD-1.0-http--download',
			title: 'Temperature measured during the deployment (JPEG file)',
			type: 'type value'
          },{
        	href: 'http://opendap-ivec.arcs.org.au/thredds/fileServer/IMOS/ANFOG/slocum_glider/Fremantle20090327/IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc',
  			name: 'IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc',
			protocol: 'WWW:LINK-1.0-http--downloaddata',
			title: 'Download data from the IMOS THREDDS server',
			type: 'type value'
          }],
          source: 'source value',
          canDownload: false,
          bbox: 'bbox value'
	  });

	  var result = new Portal.search.data.CatalogResult({record: resultRecord});
	  var downloads = result.getDownloadLinks(['WWW:DOWNLOAD-1.0-http--download', 'WWW:LINK-1.0-http--downloaddata'])

	  expect(downloads.length).toEqual(1);
	  expect(downloads[0].link.name).toEqual('IMOS_ANFOG_BCEOSTUV_20090327T034938Z_SL106_FV01_timeseries_END-20090402T034658Z.nc');
  });

  
});