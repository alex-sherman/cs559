precision highp float;
varying vec3 fNormal;
varying vec2 fTexCoord;
uniform vec3 lightDir;
uniform sampler2D diffuseTexture;
uniform vec3 cameraPosition;
varying float clipDistance;

void main()
{
  if(clipDistance < 0.)
    discard;
  vec4 color = texture2D(diffuseTexture, vec2(fTexCoord.x, fTexCoord.y));
  if(color.a < 0.9)
    discard;
  gl_FragColor = color;
}