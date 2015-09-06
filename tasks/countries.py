

import json

from invoke import task


@task
def build():

    """
    Merge borders with area, anchor points, and populations.
    """

    borders = open_borders()

    # TODO: Merge metadata.

    with open('src/javascripts/data/countries.json', 'w') as fh:
        json.dump(borders, fh, sort_keys=True)


def open_borders():

    """
    Read the borders GeoJSON.

    Returns: dict
    """

    with open('data/countries/borders.json', 'r') as fh:
        return json.loads(fh.read())


def open_mledoze():

    """
    Read the meldoze metadata.

    Returns: dict
    """

    with open('data/countries/mledoze.json', 'r') as fh:
        return json.loads(fh.read())


def cca3_to_area():

    """
    Map country code -> area.

    Returns: dict
    """

    areas = {}
    for c in open_mledoze():
        areas[c['cca3']] = c['area']

    return areas


def cca3_to_anchor():

    """
    Map country code -> anchor point.

    Returns: dict
    """

    anchors = {}
    for c in open_mledoze():
        anchors[c['cca3']] = c['latlng']

    return anchors
