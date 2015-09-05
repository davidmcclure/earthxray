

import json

from invoke import task
from tasks import utils


@task
def borders():

    """
    Write state borders.
    """

    # TODO|dev
    borders = open_states()
    write_states(borders)


def open_states():

    """
    Open the borders GeoJSON.

    Returns: dict
    """

    with open('data/states.geo.json', 'r') as fh:
        return json.loads(fh.read())


def write_states(data):

    """
    Write the states GeoJSON.

    Args:
        data (dict)
    """

    with open('src/javascripts/data/states.json', 'w') as fh:
        json.dump(data, fh, sort_keys=True)
