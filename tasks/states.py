

import json

from invoke import task


@task
def build():

    """
    Merge borders metadata.
    """

    borders = open_borders()

    # TODO: Merge metadata?

    with open('src/javascripts/data/states.json', 'w') as fh:
        json.dump(borders, fh, sort_keys=True)


def open_borders():

    """
    Read the borders GeoJSON.

    Returns: dict
    """

    with open('data/states/borders.json', 'r') as fh:
        return json.loads(fh.read())
