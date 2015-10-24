precision highp float;
varying vec3 fNormal;
varying vec2 fTexCoord;
uniform vec3 lightDir;
uniform sampler2D diffuse;
uniform vec3 cameraPosition;
varying vec3 worldPos;

void main()
{
  vec4 color = texture2D(diffuse, vec2(fTexCoord.x, fTexCoord.y));
  if(color.a < 0.9)
    discard;
  gl_FragColor = color;
}