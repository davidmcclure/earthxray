

import json
import math

from paver.easy import *


@task
def state_borders():

    """
    3D-ify US state border points.
    """

    pass # TODO


@task
def country_borders():

    """
    3D-ify country border points.
    """

    pass # TODO


@task
def country_points():

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
            [x, y, z] = lon_lat_to_xyz(
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
        json.dump(labels, fh, indent=2)


@task
def country_sprites():

    """
    Render country label sprites.
    """

    pass # TODO


@task
def city_points():

    """
    Write city label points.
    """

    pass # TODO


@task
def city_sprites():

    """
    Render city label sprites.
    """

    pass # TODO


def lon_lat_to_xyz(lon, lat, r=6371):

    """
    Convert lon/lat -> XYZ.
    """

    # Degrees -> radians.
    r_lon = math.radians(lon)
    r_lat = math.radians(lat)

    # Coordinates -> XYZ.
    x = -r * math.cos(r_lat) * math.cos(r_lon)
    z =  r * math.cos(r_lat) * math.sin(r_lon)
    y =  r * math.sin(r_lat)

    return [x, y, z]
