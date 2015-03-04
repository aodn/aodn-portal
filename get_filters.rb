#!/usr/bin/env ruby

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

  # Method for connecting to a given geonetwork url and extract wfs layers
  #
  # Params:
  # * *Returns* :
  #   - Array of layers in geonetwork
  #
  def layers
    geonetwork_search_results = URI.parse(@geonetwork_url).read
    geonetwork_search_results_xml = Nokogiri::XML(geonetwork_search_results)

    layers = []
    geonetwork_search_results_xml.at_xpath("/response").children.each do |metadata|
      next unless metadata.name == 'metadata'

      geonetwork_links = GeonetworkMetadataLinks.new(metadata)
      server, wms_layer, wfs_layer = geonetwork_links.wms_wfs_links

      if server == @geoserver_url && wfs_layer && wms_layer
        $logger.info "Probed layer from Geonetwork: '#{wfs_layer}' <-> '#{wms_layer}' on '#{server}'"
        layers << [ wms_layer, wfs_layer ]
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

    def wms_wfs_links
      links = [nil, nil, nil]
      @links.each do |link|
        link_parts = link.split("|")
        if link_parts[3] == 'OGC:WMS-1.1.1-http-get-map'
          # Set WMS link + server
          links[0] = link_parts[2]
          links[1] = link_parts[0]
        elsif link_parts[3] == 'OGC:WFS-1.0.0-http-get-capabilities'
          # Set WFS link
          links[2] = link_parts[0]
        end
      end

      # If the layer lacks a WFS link, use the WMS link
      if ! links[2]
        links[2] = links[1]
      end

      return links
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

def write_filter_values(filters_dir, filter, values)
  # Skip geometry filter
  "geom" == filter && return

  builder = Nokogiri::XML::Builder.new do |xml|
    xml.uniqueValues {
      values.each do |value|
        xml.value value
      end
    }
  end

  filter_values_xml_path = File.join(filters_dir, "#{filter}.xml")
  $logger.info "Dumping filter '#{filter}' values XML to '#{filter_values_xml_path}'"
  file = File.open(filter_values_xml_path, "w")
  file << builder.to_xml
  file.close
end

def convert_filter_type(filter_type, filter_name)
  # Convert filter type to a geoserver type
  return_filter_type = filter_type

  if filter_type == "BoundingBox"
    return_filter_type = "Geometry"
  elsif filter_type == "Date"
    return_filter_type = "Timestamp"
  elsif filter_name == "DEPTH"
    return_filter_type = "Float"
  elsif filter_name == "driftnum"
    return_filter_type = "Long"
  end

  return return_filter_type
end

def write_filters(filters_dir, filters, opts)
  builder = Nokogiri::XML::Builder.new do |xml|
    xml.filters {
      filters.each do |filter|
        xml.filter {
          filter_type = convert_filter_type(filter['type'], filter['name'])

          xml.name                 filter['name']
          xml.type                 filter_type
          xml.label                filter['label']
          xml.visualised           !filter['downloadOnly']
          xml.excludedFromDownload false

          # Output values to a separate file
          write_filter_values(filters_dir, filter['name'], filter['possibleValues'])
        }
      end
    }
  end

  layer_xml_path = File.join(filters_dir, "filters.xml")
  $logger.info "Dumping filters XML to '#{layer_xml_path}'"
  $logger.info "------------------------------------------"
  file = File.open(layer_xml_path, "w")
  file << builder.to_xml
  file.close
end

def get_layer_directory(prefix, layer)
  layer_name = layer
  # Assume 'imos' workspace if unspecified
  workspace = "imos"

  if layer.match(/:/)
    workspace = layer.split(":")[0]
    layer_name = layer.split(":")[1]
  end

  return File.join(prefix, workspace, layer_name)
end

def get_filters_main(opts)
  layers = []

  # Get layers from Geonetwork URL
  geonetwork_connector = GeonetworkConnector.new(opts[:geonetwork], opts[:geoserver])
  layers = geonetwork_connector.layers

  output_dir = opts[:dir]

  layers.each do |layer_tuple|
    wms_layer = layer_tuple[0]
    wfs_layer = layer_tuple[1]

    layer_id = get_layer_id(opts[:portal], opts[:geoserver], wms_layer)
    if layer_id
      if output_dir
        filters_dir = get_layer_directory(output_dir, wfs_layer)
        FileUtils.mkdir_p filters_dir

        filters = get_filters(opts[:portal], layer_id)
        write_filters(filters_dir, filters, opts)
      end
    else
      $logger.error "Could not get ID of layer '#{wms_layer}'"
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
