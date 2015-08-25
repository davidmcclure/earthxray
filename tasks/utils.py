

import math

from pgmagick import Image, Geometry
from tasks import config


def lon_lat_to_xyz(lon, lat, r=6371):

    """
    Convert lon/lat -> XYZ.

    Args:
        lon (float)
        lat (float)
        r (float)

    Returns:
        list: [X, Y, Z]
    """

    # Degrees -> radians.
    r_lon = math.radians(lon)
    r_lat = math.radians(lat)

    # Coordinates -> XYZ.
    x = -r * math.cos(r_lat) * math.cos(r_lon)
    z =  r * math.cos(r_lat) * math.sin(r_lon)
    y =  r * math.sin(r_lat)

    return [x, y, z]


def make_png(w, h):

    """
    Create an empty, transparent PNG file.

    Args:
        w (int)
        h (int)

    Returns:
        pgmagick.Image
    """

    img = Image(Geometry(int(w), int(h)), 'transparent')
    img.font(config.font_face)
    img.fontPointsize(config.font_size)

    return img
