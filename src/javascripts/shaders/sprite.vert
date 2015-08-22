
attribute vec2 offset;
uniform float size;
uniform float scale;

varying vec2 vOffset;

void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( scale / length( mvPosition.xyz ) );
    gl_Position = projectionMatrix * mvPosition;
}
