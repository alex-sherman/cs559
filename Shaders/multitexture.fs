precision highp float;
varying vec3 fNormal;
varying vec2 fTexCoord;
varying vec3 fPosition;
uniform vec3 lightDir;
varying vec4 fBlendWeight;
varying float clipDistance;

uniform sampler2D texture0Texture;
uniform sampler2D texture1Texture;
uniform sampler2D texture2Texture;
uniform sampler2D texture3Texture;

void main()
{
  if(clipDistance < 0.)
    discard;

  float base = 0.4;
  gl_FragColor = vec4(
    ((texture2D(texture0Texture, vec2(fTexCoord.x, fTexCoord.y)) * fBlendWeight[0]) +
    (texture2D(texture1Texture, vec2(fTexCoord.x, fTexCoord.y)) * fBlendWeight[1]) +
    (texture2D(texture2Texture, vec2(fTexCoord.x, fTexCoord.y)) * fBlendWeight[2]) +
    (texture2D(texture3Texture, vec2(fTexCoord.x, fTexCoord.y)) * fBlendWeight[3])
    ).rgb,1);
  vec3 normal = normalize(fNormal);
  gl_FragColor.xyz *= base + clamp(dot(normal, -lightDir), 0.0, 1.0 - base);
}