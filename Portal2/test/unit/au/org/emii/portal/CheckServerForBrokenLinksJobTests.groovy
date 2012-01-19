package au.org.emii.portal

import grails.spring.BeanBuilder
import grails.test.*
import org.codehaus.groovy.grails.commons.DefaultGrailsApplication
import org.codehaus.groovy.grails.commons.ApplicationHolder
import org.springframework.context.ApplicationContext

//TODO complete these unit tests
class CheckServerForBrokenLinksJobTests extends GrailsUnitTestCase {
	
	
	def CheckServerForBrokenLinksJob testJob
	def grailsApplication
	
	protected void setUp() {
		super.setUp()
	}

	protected void tearDown() {
		super.tearDown()
	}

/*
	void testGetCapabilitiesWithoutLayers() {
		def urlString = 'http://url.com'
		def URL url = null
				
		def capabilitiesXml = """
		<WMS_Capabilities>
			<Capability>
				<Layer type="current">
					<Layer queryable="1">
						<Name>topp:soop_sst_1min_vw</Name>
						<Title>soop_sst_1min_vw</Title>
						<Abstract/>
						<KeywordList/>
						<SRS>EPSG:4326</SRS><Title>soop_sst_1min_vw</Title>
						<Abstract/>
						<KeywordList/>
						<SRS>EPSG:4326</SRS>
						<LatLonBoundingBox minx="135.609" miny="-67.17" maxx="158.972" maxy="-42.843"/>
						<BoundingBox SRS="EPSG:4326" minx="135.609" miny="-67.17" maxx="158.972" maxy="-42.843"/>
					</Layer>
				</Layer>
			</Capability>
		</WMS_Capabilities>
		"""
		
		def urlControl = mockFor(URL)
		urlControl.demand.getText(1..1) { -> capabilitiesXml }
		
		def fileControl = mockFor(File)
		fileControl.demand.append(4..4) {String text -> }

		def xmlParserControl= mockFor(XmlParser)
		xmlParserControl.demand.parse(1..1) {String getFeatureInfoUrlString -> null}  //This doesn't seem to work !!!
		
		def testJob = new CheckServerForBrokenLinksJob()
		testJob._getCapabilities(urlString)

	}
	*/
	  
	
	void testGetCapabilitiesWithLayers() {
		def testJob = new CheckServerForBrokenLinksJob()
		def urlString = 'http://url.com'
		def URL url = null
				
		def capabilitiesXml = """
		<WMS_Capabilities>
			<Capability>
				<Layer type="current">
					<Layer queryable="1">
						<Name>topp:soop_sst_1min_vw</Name>
						<Title>soop_sst_1min_vw</Title>
						<Abstract/>
						<KeywordList/>
						<SRS>EPSG:4326</SRS><Title>soop_sst_1min_vw</Title>
						<Abstract/>
						<KeywordList/>
						<SRS>EPSG:4326</SRS>
						<LatLonBoundingBox minx="135.609" miny="-67.17" maxx="158.972" maxy="-42.843"/>
						<BoundingBox SRS="EPSG:4326" minx="135.609" miny="-67.17" maxx="158.972" maxy="-42.843"/>
					</Layer>
				</Layer>
			</Capability>
		</WMS_Capabilities>
		"""
	
		
		def urlControl = mockFor(URL)
		urlControl.demand.getText(1..1) { -> capabilitiesXml }
		
		def fileControl = mockFor(File)
		fileControl.demand.append(1..7) {String text -> println text }

		def nextJob = new CheckServerForBrokenLinksJob()

		nextJob._getCapabilities(urlString)
		
		
	}

	
	
	void testConstructFeatureInfoRequest() {
		def testJob = new CheckServerForBrokenLinksJob()
		def url = 'http://url.com'

		def xml = """
			<layers type="current">
				<Layer queryable="1">
					<Name>topp:soop_sst_1min_vw</Name>
					<Title>soop_sst_1min_vw</Title>
					<Abstract/>
					<KeywordList/>
					<SRS>EPSG:4326</SRS><Title>soop_sst_1min_vw</Title>
					<Abstract/>
					<KeywordList/>
					<SRS>EPSG:4326</SRS>
					<LatLonBoundingBox minx="135.609" miny="-67.17" maxx="158.972" maxy="-42.843"/>
					<BoundingBox SRS="EPSG:4326" minx="135.609" miny="-67.17" maxx="158.972" maxy="-42.843"/>
				</Layer>
			</layers>
			"""

		def expectedResult1 = "http://url.com?version=1.1.1&request=getfeatureinfo&layers=topp:soop_sst_1min_vw&styles=&SRS=EPSG:4326EPSG:4326&bbox=135.609,-67.17,158.972,-42.843&query_layers=topp:soop_sst_1min_vw&x=0&y=0&width=1&height=1&info_format=text/html&feature_count=10000"

		def layerNodes = new XmlParser().parseText(xml)
		layerNodes.Layer.each{
			def result = testJob._constructFeatureInfoRequest(url, it)
			assertEquals result, expectedResult1
		}
	}
	
	void testGetUrlResponse() {
		def someUrl = "http://doesnt.exist/geoserver/wms?version=1.1.1&request=getcapabilities"
		def fileControl = mockFor(File)
		fileControl.demand.append(1..1) {String text -> assertEquals text, someUrl + " : Could not Connect" }
		def testJob = new CheckServerForBrokenLinksJob()
		def result = testJob._getUrlResponse(someUrl)
	}
}

