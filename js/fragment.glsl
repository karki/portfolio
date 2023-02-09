uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float time;

varying vec2 vUv;

void main() {
    vec2 newUv = vUv;
    newUv.x += sin(newUv.y * 10.0 + time) / 10.0;

    gl_FragColor = texture( tDiffuse, newUv );
}