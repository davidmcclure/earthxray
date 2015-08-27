

import json

from invoke import task
from tasks import utils


@task
def points():

    """
    Write country label points.
    """

    labels = []

    with open('data/labels.geo.json', 'r') as fh:

        countries = json.loads(fh.read())

        # Walk countries.
        for c in countries['features']:

            # Break if no English name.
            name = c['properties'].get('name:en')
            if not name: continue

            # lon/lat -> XYZ.
            [x, y, z] = utils.lon_lat_to_xyz(
                c['geometry']['coordinates'][0],
                c['geometry']['coordinates'][1]
            )

            labels.append({
                'name': name,
                'x': x,
                'y': y,
                'z': z,
            })

    with open('src/javascripts/data/labels.json', 'w') as fh:
        json.dump(labels, fh, indent=2, sort_keys=True)
