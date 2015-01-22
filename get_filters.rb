#!/usr/bin/ruby

require 'nokogiri'
require 'open-uri'
require 'trollop'
require 'net/http'
require 'net/https'
require 'open-uri'
require 'logger'
require 'json'
require 'fileutils'

$logger = Logger.new(STDOUT)
$logger.level = Logger::INFO

class GeonetworkConnector

  GEONETWORK_SEARCH_REQUEST = "srv/eng/xml.search.summary?sortBy=popularity&from=1&to=999&fast=index"

  def initialize(geonetwork_url, geoserver_url)
    @geonetwork_url = "#{geonetwork_url}/#{GEONETWORK_SEARCH_REQUEST}"
    @geoserver_url  = geoserver_url
  end

  # Method for connecting to a given geonetwork url and extract wms layers
  #
  # Params:
  # * *Returns* :
  #   - Array of layers in geonetwork
  #
  def wms_layers
    geonetwork_search_results = URI.parse(@geonetwork_url).read
    geonetwork_search_results_xml = Nokogiri::XML(geonetwork_search_results)

    layers = []
    geonetwork_search_results_xml.at_xpath("/response").children.each do |metadata|
      next unless metadata.name == 'metadata'

      geonetwork_links = GeonetworkMetadataLinks.new(metadata)
      wms_server, wms_layer = geonetwork_links.wms_link

      if wms_server == @geoserver_url && wms_layer
        $logger.info "Probed layer from Geonetwork: '#{wms_layer}' on '#{wms_server}'"
        layers << wms_layer
      end
    end

    return layers
  end

  class GeonetworkMetadataLinks
    def initialize(metadata_xml)
      # Extract links from metadata record
      @links = []
      metadata_xml.children.each do |link|
        next unless link.name == 'link'
        @links << link.inner_text
      end
    end

    def wms_link
      wms_link = [nil, nil]
      @links.each do |link|
        link_parts = link.split("|")
        if link_parts[3] == 'OGC:WMS-1.1.1-http-get-map'
          wms_link = [ link_parts[2], link_parts[0] ]
        end
      end

      return wms_link
    end
  end # class GeonetworkConnector

end

def get_layer_id(portal, geoserver, layer)
  url = "#{portal}/layer/findLayerAsJson?serverUri=#{URI::encode(geoserver)}&name=#{URI::encode(layer)}"
  begin
    layer_info = URI.parse(url).read
    layer_info_json = JSON.parse(layer_info)
    return layer_info_json['id']
  rescue
    $logger.info "Layer '#{layer}' does not exist"
    return nil
  end
end

def get_filters(portal, layer_id)
  url = "#{portal}/layer/getFiltersAsJSON?layerId=#{layer_id}"
  filters = URI.parse(url).read
  filters_json = JSON.parse(filters)
  return filters_json
end

def filter_json_to_xml(filters)
  builder = Nokogiri::XML::Builder.new do |xml|
    xml.filters {
      filters.each do |filter|
        xml.filter {
          xml.label         filter['label']
          xml.name          filter['name']
          xml.type          filter['type']
          xml.visualised    !filter['downloadOnly']
          if filter['possibleValues']
            xml.values {
              filter['possibleValues'].each do |value|
                xml.value value
              end
            }
          end
        }
      end
    }
  end

  return builder.to_xml
end

def get_filters_main(opts)
  layers = []

  # Get layers from Geonetwork URL
  geonetwork_connector = GeonetworkConnector.new(opts[:geonetwork], opts[:geoserver])
  layers = geonetwork_connector.wms_layers

  output_dir = opts[:dir]

  layers.each do |layer|
    layer_id = get_layer_id(opts[:portal], opts[:geoserver], layer)
    if layer_id
      filters = get_filters(opts[:portal], layer_id)
      filters_xml = filter_json_to_xml(filters)

      if output_dir
        workspace = layer.split(":")[0]
        layer_name = layer.split(":")[1]
        filters_dir = File.join(output_dir, workspace, layer_name)
        FileUtils.mkdir_p filters_dir
        layer_xml_path = File.join(filters_dir, "filters.xml")
        $logger.info "Dumping XML '#{layer_xml_path}'"
        file = File.open(layer_xml_path, "w")
        file << filters_xml
        file.close
      end
    else
      $logger.error "Could not get ID of layer '#{layer}'"
    end
  end

  return 0
end

# Arguments parsing
opts = Trollop::options do
  banner <<-EOS
    Get filters for every defined Geonetwork WMS layer

    Examples:
        Get filters from catalogue-123.aodn.org.au and imos.aodn.org.au:
           get_filters.rb -u https://catalogue-123.aodn.org.au/geonetwork
             -g http://geoserver-123.aodn.org.au/geoserver/wms
             -p https://imos.aodn.org.au/imos123
             -d filters

    Options:
EOS
  opt :geonetwork, "Geonetwork URL",
    :type  => :string,
    :short => '-u'
  opt :geoserver, "Geoserver URL",
    :type  => :string,
    :short => '-g'
  opt :portal, "Portal URL",
    :type  => :string,
    :short => '-p'
  opt :dir, "Directory to write filters to",
    :type  => :string,
    :short => '-d'
end

if __FILE__ == $0
  Trollop::die :geonetwork, "Must specify Geonetwork url or layers" if ! opts[:geonetwork]
  Trollop::die :geoserver,  "Must specify Geoserver url or layers"  if ! opts[:geoserver]
  Trollop::die :portal,     "Must specify Portal url"               if ! opts[:portal]
  exit(get_filters_main(opts))
end
