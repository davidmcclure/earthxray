

import json

from invoke import task
from tasks import utils


@task
def data():

    """
    Write country borders and label points.
    """

    anchors = {}

    # Map labels -> points.

    with open('data/labels.geo.json', 'r') as fh:

        labels = json.loads(fh.read())

        for f in labels['features']:

            # Break if no English name.
            name = f['properties'].get('name:en')
            if not name: continue

            lon = f['geometry']['coordinates'][0]
            lat = f['geometry']['coordinates'][1]

            # Map name -> XYZ point.
            point = utils.lon_lat_to_xyz(lon, lat)
            anchors[name] = point

    countries = []

    # Merge labels with borders, 3D-ify points.

    with open('data/borders.geo.json', 'r') as fh:

        borders = json.loads(fh.read())

        for f in borders['features']:

            country = {
                'name': f['properties']['name'],
                'points': [],
            }

            # Set the label point.
            country['anchor'] = anchors.get(country['name'])

            # Polygons:
            if f['geometry']['type'] == 'Polygon':
                for p in f['geometry']['coordinates']:
                    country['points'].append(utils.threedify(p))

            # MultiPolygons:
            elif f['geometry']['type'] == 'MultiPolygon':
                for mp in f['geometry']['coordinates']:
                    for p in mp:
                        country['points'].append(utils.threedify(p))

            countries.append(country)

    # Write the payload.
    with open('src/javascripts/data/countries.json', 'w') as fh:
        json.dump(countries, fh, sort_keys=True)
