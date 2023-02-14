precision mediump float;
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform vec2 uMouseVelocity;
uniform float time;

varying vec2 vUv;

void main() {
    vec2 newUv = vUv;

    // Based on http://adrianboeing.blogspot.com/2011/02/ripple-effect-in-webgl.html
    vec2 cPos = -1.0 + 2.0 * gl_FragCoord.xy / uResolution.xy;
    float cLength = length(cPos);

    newUv = gl_FragCoord.xy / uResolution.xy + (cPos / cLength) * cos(cLength * 12.0 - time - uMouseVelocity.x * 4.0) * 0.03;

    gl_FragColor = texture2D( tDiffuse, newUv );
}