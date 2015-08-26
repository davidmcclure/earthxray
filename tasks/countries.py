

import json

from invoke import task
from pgmagick import TypeMetric, DrawableText
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
        json.dump(labels, fh, indent=2)


@task(points)
def sprites():

    """
    Render a label sprite for each country.
    """

    utils.reset_dir('_site/images')

    with open('src/javascripts/data/labels.json') as fh:

        points = json.load(fh)
        img = utils.make_png(100, 100)

        # Measure the labels.
        ws, hs = [], []
        for p in points:

            # Draw the country name.
            tm = TypeMetric()
            img.fontTypeMetrics(p['name'], tm)

            # Register the dimensions.
            ws.append(tm.textWidth())
            hs.append(tm.textHeight())

        w = int(max(ws))

        # Draw the labels.
        for i, p in enumerate(points):

            # Render the text.
            img = utils.make_png(w, w)
            x = w/2 - ws[i]/2
            y = w/2 - hs[i]/2
            text = DrawableText(x, y, p['name'])
            img.draw(text)

            # Write the file.
            name = utils.hash_label(p['name'])
            img.write('_site/images/{0}.png'.format(name))


@task(points)
def data_uris():

    """
    Write data URI strings into the point JSON.
    """

    pass
