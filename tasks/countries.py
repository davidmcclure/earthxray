

import json

from pgmagick import TypeMetric, DrawableText
from invoke import task
from tasks.utils import lon_lat_to_xyz, make_png


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


@task(points)
def sprites():

    """
    Render the country label sprite sheet.
    """

    with open('src/javascripts/data/labels.json') as fh:

        points = json.load(fh)

        # Measurement image.
        img = make_png(100, 100)

        # Get widths for all labels.
        widths = []
        for p in points:
            tm = TypeMetric()
            img.fontTypeMetrics(p['name'], tm)
            widths.append(tm.textWidth())

        w = int(max(widths))
        h = int(w*len(points))

        # Sprite atlas.
        img = make_png(w, h)

        # Draw the labels.
        for i, p in enumerate(points):
            x = (w/2) - widths[i]/2
            y = w*i + (w/2)
            text = DrawableText(x, y, p['name'])
            img.draw(text)

        img.write('_site/countries.png')
