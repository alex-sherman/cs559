precision highp float;
varying vec3 fNormal;
varying vec2 fTexCoord;
uniform vec3 lightDir;
uniform sampler2D diffuse;
uniform vec3 cameraPosition;
varying vec3 worldPos;

void main()
{
  float base = 0.4;
  vec4 color = texture2D(diffuse, vec2(fTexCoord.x, fTexCoord.y));
  vec2 viewDir = normalize(cameraPosition.xz - worldPos.xz);
  vec2 normal = normalize(fNormal.xz);
  color.a *= clamp(abs(dot(normal, viewDir)) * 8.0 - 0.0, 1.0, 1.0);
  if(color.a < 0.5)
    discard;
  gl_FragColor = color;
}