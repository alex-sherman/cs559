precision highp float;
varying vec3 fNormal;
varying vec2 fTexCoord;
varying vec3 fPosition;
uniform vec3 lightDir;
varying vec4 fBlendWeight;
varying float clipDistance;
varying float fLodW;

uniform sampler2D texture0Texture;
uniform sampler2D texture1Texture;
uniform sampler2D texture2Texture;
uniform sampler2D texture3Texture;
void sampleAtLod(inout vec3 color, vec2 coord, vec4 blendWeights, float w) {
    color += ((texture2D(texture0Texture, vec2(coord.x, coord.y)) * blendWeights[0]) +
        (texture2D(texture1Texture, vec2(coord.x, coord.y)) * blendWeights[1]) +
        (texture2D(texture2Texture, vec2(coord.x, coord.y)) * blendWeights[2]) +
        (texture2D(texture3Texture, vec2(coord.x, coord.y)) * blendWeights[3])).rgb * w;
}
void main()
{
    if(clipDistance < 0.)
        discard;

    float base = 0.4;
    gl_FragColor = vec4(vec3(0.), 1.);
    sampleAtLod(gl_FragColor.rgb, fTexCoord, fBlendWeight, 1. - fLodW);
    sampleAtLod(gl_FragColor.rgb, fTexCoord / 4., fBlendWeight, fLodW);
    vec3 normal = normalize(fNormal);
    gl_FragColor.xyz *= base + clamp(dot(normal, -lightDir), 0.0, 1.0 - base);
}