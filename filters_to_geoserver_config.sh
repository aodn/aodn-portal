#!/bin/bash

get_dir_for_layer() {
    local geoserver_dir=$1; shift
    local layer_name=$1; shift
    local layer_xml=`(cd $geoserver_dir && grep -r $layer_name */*/*/*/layer.xml | cut -d: -f1)`

    if [ x"$layer_xml" != x ]; then
        local layer_dir=`dirname $layer_xml`
        layer_dir=`dirname $layer_dir`
        echo "$layer_dir/$layer_name"
    else
        return 1
    fi
}

# returns 0 if filter is empty, 1 if not
# $1 - filter xml file
filter_empty() {
    local filter_file=$1; shift
    local -i filter_lines=`cat $filter_file | wc -l`
    if [ $filter_lines -le 2 ]; then
        return 0
    else
        return 1
    fi
}

main() {
    local geoserver_dir="../../shared_src/geoserver"
    local filters_dir="filters"

    #./get_filters.rb -u https://catalogue-123.aodn.org.au/geonetwork -g http://geoserver-123.aodn.org.au/geoserver/wms -p https://imos.aodn.org.au/imos123 -d filters

    local filters_dir
    for filters_dir in `find $filters_dir -type d`; do
        if [ -f "$filters_dir/filters.xml" ]; then
            local layer=`basename $filters_dir`
            if ! filter_empty $filters_dir/filters.xml; then
                local layer_dir=`get_dir_for_layer $geoserver_dir $layer`
                if [ x"$layer_dir" != x ]; then
                    echo "Directory for '$layer' is '$layer_dir'"
                    local full_layer_dir="$geoserver_dir/$layer_dir"
                    mkdir -p $full_layer_dir
                    echo "Copying '$filters_dir/filters.xml' -> '$full_layer_dir'"
                    perl -pe 'chomp if eof' $filters_dir/filters.xml > $full_layer_dir/filters.xml
                else
                    echo "Could not find directory for layer '$layer'"
                fi
            fi
        fi
    done
}

main "$@"
