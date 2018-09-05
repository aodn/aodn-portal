#!/usr/bin/env python
import codecs
import csv

try:
    # Python 3
    from urllib.request import urlopen
except ImportError:
    # Python 2
    from urllib2 import urlopen

# The URL to the collection (as comma-separated values).
collection_url = "${collectionUrl}"

# Fetch data...
response = urlopen(collection_url)

# Iterate on data...
csvfile = csv.reader(codecs.iterdecode(response, 'utf-8'))
for row in csvfile:
    print(row)
