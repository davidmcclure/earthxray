

import math


def lon_lat_to_xyz(lon, lat, r=6371, p=2):

    """
    Convert lon/lat -> XYZ.

    Args:
        lon (float)
        lat (float)
        r (float)
        p (int)

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

    return [
        round(x, p),
        round(y, p),
        round(z, p),
    ]


def threedify(points):

    """
    Convert a set of lon/lot points -> XYZ.

    Args:
        points (list)

    Returns: list
    """

    xyzs = []
    for p in points:
        xyzs.append(lon_lat_to_xyz(p[0], p[1]))

    return xyzs
