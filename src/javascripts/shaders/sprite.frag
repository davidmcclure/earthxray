
uniform sampler2D texture;
uniform vec2 repeat;

varying vec2 vOffset;

void main() {
    vec2 uv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );
    vec4 tex = texture2D( texture, uv * repeat + vOffset );
    gl_FragColor = tex;
}
