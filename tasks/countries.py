

import json

from invoke import task


@task
def merge_labels():

    """
    Merge label names.
    """

    countries = open_countries()

    labels = cca3_to_label()
    for c in countries['features']:
        c['properties']['label'] = labels.get(c['id'])

    write_countries(countries)


@task
def merge_areas():

    """
    Merge country areas.
    """

    countries = open_countries()

    areas = cca3_to_area()
    for c in countries['features']:
        c['properties']['area'] = areas.get(c['id'])

    write_countries(countries)


@task
def merge_anchors():

    """
    Merge label anchor points.
    """

    countries = open_countries()

    anchors = cca3_to_anchor()
    for c in countries['features']:
        c['properties']['anchor'] = anchors.get(c['id'])

    write_countries(countries)


@task(merge_labels, merge_anchors, merge_areas)
def merge():
    pass


def open_countries():

    """
    Read the borders GeoJSON.

    Returns: dict
    """

    with open('src/javascripts/data/countries.json', 'r') as fh:
        return json.loads(fh.read())


def write_countries(countries):

    """
    Write updated GeoJSON.

    Args:
        countries (dict)
    """

    with open('src/javascripts/data/countries.json', 'w') as fh:
        json.dump(countries, fh, sort_keys=True)


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
