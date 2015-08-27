
uniform float size;
uniform float scale;

attribute float index;
varying float vIndex;

void main() {

    vIndex = index;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = size * ( scale / length( mvPosition.xyz ) );
    gl_Position = projectionMatrix * mvPosition;

}
