
# Sprites:
FONT_FACE = '/path/to/font.ttf'
FONT_SIZE = 40

# Merge overrides.
try:
    from .local import *
except ImportError:
    pass
