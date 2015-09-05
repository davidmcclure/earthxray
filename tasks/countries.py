

import json

from invoke import task


@task
def test():
    print(cca3_to_anchor())


def open_mledoze():

    """
    Read the country metadata.

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
    Map country code -> population.

    Returns: dict
    """

    anchors = {}

    for c in open_mledoze():
        anchors[c['cca3']] = c['latlng']

    return anchors
