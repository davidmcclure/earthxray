

import json

from invoke import task


@task
def test():
    print(cca3_to_area())


def open_mledoze():

    """
    Read the meldoze metadata.

    Returns: dict
    """

    with open('data/countries/mledoze.json', 'r') as fh:
        return json.loads(fh.read())


def open_population():

    """
    Read the OKFN population data.

    Returns: dict
    """

    with open('data/countries/population.json', 'r') as fh:
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


def cca3_to_population():

    """
    Map country code -> population.

    Returns: dict
    """

    # Filter out pre-2014 values.
    data = open_population()
    current = [d for d in data if d['Year'] == '2014']

    pops = {}
    for c in current:
        pops[c['Country Code']] = int(c['Value'])

    return pops
