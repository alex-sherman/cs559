precision highp float;
varying vec3 fNormal;
varying vec3 fReflCoord;
varying vec3 fRefrCoord;
varying vec3 fPosition;
varying vec2 fTexCoord;
uniform vec3 lightDir;
uniform sampler2D reflectionTexture;
uniform sampler2D refractionTexture;
uniform sampler2D bumpMapTexture;
uniform float time;

void main()
{
    float base = 0.4;
    gl_FragColor = vec4(1,0,1,1);
    vec2 perturb = texture2D(bumpMapTexture, fTexCoord + time / 100.0).rg;
    perturb = perturb - 0.5;
    vec2 reflCoord = (fReflCoord / fReflCoord.z / 2.0 + 0.5).xy + perturb * 0.05;
    vec2 refrCoord = (fRefrCoord / fRefrCoord.z / 2.0 + 0.5).xy + perturb * 0.05;
    perturb = perturb * 2.;
    gl_FragColor.a = 1.0;
    gl_FragColor.xyz = vec3(0);
    gl_FragColor.xyz += texture2D(reflectionTexture, reflCoord).xyz / 2.0;
    gl_FragColor.xyz += texture2D(refractionTexture, refrCoord).xyz / 2.0;
    gl_FragColor.b += 0.15;
}