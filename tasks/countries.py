

import json

from invoke import task
from tasks import utils


@task
def borders():

    """
    Write country borders.
    """

    # TODO|dev
    borders = open_borders()
    write_countries(borders)


def open_borders():

    """
    Open the borders GeoJSON.

    Returns: dict
    """

    with open('data/borders.geo.json', 'r') as fh:
        return json.loads(fh.read())


def write_countries(data):

    """
    Write the countries GeoJSON.

    Args:
        data (dict)
    """

    with open('src/javascripts/data/countries.json', 'w') as fh:
        json.dump(data, fh, sort_keys=True)
