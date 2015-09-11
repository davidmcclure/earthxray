

import json

from invoke import task


@task
def build():

    """
    Merge borders with area, anchor points, and populations.
    """

    borders = open_borders()
    anchors = cca3_to_anchor()
    areas = cca3_to_area()
    labels = cca3_to_label()

    for b in borders['features']:
        b['properties']['anchor'] = anchors.get(b['id'])
        b['properties']['area'] = areas.get(b['id'])
        b['properties']['label'] = labels.get(b['id'])

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

        # Swap to (lon, lat).
        a = c['latlng']
        if a: anchors[c['cca3']] = [a[1], a[0]]

    return anchors


def cca3_to_label():

    """
    Map country code -> common name.

    Returns: dict
    """

    labels = {}
    for c in open_mledoze():
        labels[c['cca3']] = c['name']['common']

    return labels
