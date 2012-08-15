package au.org.emii.portal

class DummySetup extends GroovyTestCase{

	def setupConfig() {
		def Server s1 = new Server(uri: "http://something1.com", shortAcron: "sa1", id: 1, type:"WMS-1.1.1", scanFrequency: 100,
		name: "something1name", disable: false, opacity: 100, imageFormat: "image/gif", infoFormat: 'text/html',
		allowDiscoveries:true)
		def Server s2 = new Server(uri:  "http://something2.com", shortAcron:  "s2", id: 2, type:"WMS-1.1.1", scanFrequency: 10,
		name: "something2name", disable: false, opacity: 100, imageFormat: "image/gif", infoFormat: 'text/html',
		allowDiscoveries:true)

		def Server s3 = new Server(uri:  "http://something3.com", shortAcron:  "s3", id: 3, type:"WMS-1.1.1", scanFrequency: 10,
		name: "something3name", disable: false, opacity: 100, imageFormat: "image/gif",  infoFormat: 'text/html',
		allowDiscoveries:true)

		s1.save(failOnError: true,flush:true)
		s2.save(failOnError: true,flush:true)
		s3.save(failOnError:  true,flush:true)

		assertEquals 3, Server.count()


		def Layer l1 = new Layer(server: s1, blacklisted:false, abstractTrimmed: "", cache:false, styles: "",
		queryable:true, isBaseLayer:false, dataSource: "Unknown",activeInLastScan: false, name: "l1")
		def Layer l2 = new Layer(server: s1, blacklisted:false, abstractTrimmed: "", cache:false, styles: "",
		queryable:true, isBaseLayer:false, dataSource: "Unknown",activeInLastScan: false, name: "l2")
		def Layer l3 = new Layer(server: s2, blacklisted:false, abstractTrimmed: "", cache:false, styles: "",
		queryable:true, isBaseLayer:false, dataSource: "Unknown",activeInLastScan: false, name: "l3")

		l1.save(failOnError: true,flush:true)
		l2.save(failOnError: true,flush:true)
		l3.save(failOnError: true,flush:true)

		assertEquals 3, Layer.count()

		def MenuItem mi1 = new MenuItem(leaf:true, text: "menuitem1", menuPosition: 1, layer: l1, childItems: [])  //linked to s1   (delete)
		def MenuItem mi2 = new MenuItem(leaf:true, text: "menuitem2", menuPosition: 2, layer: l1,  childItems: [])  //linked to s1   (delete)
		def MenuItem mi3 = new MenuItem(leaf:true,  text: "menuitem3", menuPosition: 3, layer: l2, childItems: [])  //linked to s1  (delete)
		def MenuItem mi4 = new MenuItem(leaf:false,  text: "menuitem4", menuPosition: 4, layer: l3, childItems: [])  //linked to s2
		def MenuItem mi5 = new MenuItem(leaf:false,  text: "menuitem5", menuPosition: 5, server: s3,  childItems: [])  //linked to s3 (server, delete)
		//
		mi1.save(failOnError: true,flush:true)
		mi2.save(failOnError: true,flush:true)
		mi3.save(failOnError: true,flush:true)
		mi4.save(failOnError: true,flush:true)
		mi5.save(failOnError: true,flush:true)

		assertEquals 5, MenuItem.count()

		Menu dummy = new Menu(title: "dummy", active: true, editDate: new Date(), menuItems: [mi1, mi2, mi3, mi4])
		//
		dummy.save(flush:true)

		Config conf = new Config(initialBbox: "180,10,-180,10", autoZoom: false,
		searchUsingBboxByDefault: true,
		baselayerMenu:dummy, defaultMenu: dummy, contributorMenu: dummy, regionMenu: dummy,
		headerHeight: 100, footerHeight: 100, activeLayersHeight: 100, popupWidth: 1,
		poopupMenuHeight: 1, westWidth: 1, downloadCartFilename: "dl", popupHeight: 1,
		downloadCartMaxNumFiles: 1, downloadCartMaxFileSize: 1,
		downloadCartMimeTypeToExtensionMapping: "asdf",
		downloadCartConfirmationWindowContent: "Content",
		mapGetFeatureInfoBuffer: 1,
		metadataLinkProtocols: "asdf", metadataLayerProtocols: "adsf",
		catalogUrl: "http://www.google.com", downloadCartDownloadableProtocols: "asdf",
		defaultLayers: [l1,l2]) //<-- most important part, l1  and l2
		//is set as default layer

		conf.save(failOnError:  true,flush:true)
	}
}
