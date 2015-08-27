
uniform sampler2D textures[100];
varying float vIndex;

void main() {
    gl_FragColor = texture2D(textures[1], gl_PointCoord);
}
