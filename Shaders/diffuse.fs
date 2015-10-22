precision highp float;
varying vec3 fNormal;
varying vec2 fTexCoord;
uniform vec3 lightDir;

void main()
{
  float base = 0.4;
  gl_FragColor = vec4(0.1,0.8,0.1,1);
  vec3 normal = normalize(fNormal);
  gl_FragColor.xyz *= base + clamp(dot(normal, lightDir), 0.0, 1.0 - base);
}