precision highp float;
varying vec3 fNormal;
varying vec2 fTexCoord;
varying vec3 fPosition;
uniform vec3 lightDir;

void main()
{
  float base = 0.4;
  gl_FragColor = vec4(fPosition.y/10.0,0,fPosition.y/10.0,1);
  vec3 normal = normalize(fNormal);
  gl_FragColor.xyz *= base + clamp(dot(normal, -lightDir), 0.0, 1.0 - base);
}