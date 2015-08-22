
attribute vec2 offset;
varying vec2 vOffset;

void main() {
    vOffset = offset;
    gl_PointSize = 25.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
