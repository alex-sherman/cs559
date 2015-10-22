precision highp float;
uniform float time;
uniform vec3 lightDir;
uniform vec3 cameraPosition;
varying vec3 fNormal;
varying vec2 fTexCoord;
uniform sampler2D diffuse;
varying vec3 worldPos;
uniform float shininess;
uniform vec3 specularColor;

void main()
{
  float base = 0.4;
  float rotSpeed = 5.0;
  float tripScale = 0.5;
  vec3 normal = normalize(fNormal);
  float specular = 0.0;
  vec3 H = normalize((normalize(-lightDir) + normalize(cameraPosition - worldPos)));
  specular = max(0.0, (pow(max(0.0, dot(H, normal)), shininess) - 0.5) * 2.0);
  vec3 diffuse = texture2D(diffuse, vec2(fTexCoord.x, fTexCoord.y)).rgb * (base + clamp(dot(normal, -lightDir), 0.0, 1.0 - base));
  gl_FragColor.a = 1.0;
  gl_FragColor.rgb = diffuse;
  gl_FragColor.rgb += specular * specularColor;
}