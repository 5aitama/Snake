precision lowp float;

// The time in seconds
uniform float iTime;

// The screen resolution in pixel
uniform vec2 iResolution;

#define MIN_DIST 0.001
#define MAX_DIST 1000.
#define MAX_ITER 500


float sdf_blend(float d1, float d2, float a)
{
    return a * d1 + (1. - a) * d2;
}

// polynomial smooth min (k = 0.1);
float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float Scene(vec3 position)
{
    vec4 sphere = vec4(0, 0, 0, 1);
    vec4 sphere1 = vec4(0, 3, 0, 1);

    sphere1.y += sin(iTime) * 2.;
    
    float sphereDist = length(position - sphere.xyz) - sphere.w;
    float sphereDist1= length(position - sphere1.xyz) - sphere1.w;
    float planeDist = position.y;
    return smin(smin(sphereDist, sphereDist1, .8), planeDist, .8);
}

vec3 GetNormal(vec3 p)
{
    float d = Scene(p);
    vec2 e = vec2(.01, 0);
    vec3 n = d - vec3(Scene(p - e.xyy), Scene(p - e.yxy), Scene(p - e.yyx));

    return normalize(n);
}
// https://gist.github.com/companje/29408948f1e8be54dd5733a74ca49bb9
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float RayMarch(vec3 origin, vec3 direction)
{
    float currDist = 0.;

    for(int i = 0; i < MAX_ITER; i++)
    {
        currDist += Scene(origin + currDist * direction);

        if(currDist < MIN_DIST || currDist > MAX_DIST)
            break;
    }

    return currDist;
}

float GetLight(vec3 p)
{
    vec3 lightPos = vec3(5, 5, -10);
    // lightPos.xz = vec2(sin(0), cos(0)) * 5.;
    vec3 lightVect = normalize(lightPos - p);
    vec3 normal = GetNormal(p);
    float dif = clamp(dot(normal, lightVect), 0.0, 1.0);

    // float d = RayMarch(p + normal * MIN_DIST * 8., lightVect);

    // if(d < length(lightPos - p))
    //     dif *= 0.;

    return map(dif, 0.0, 1.0, 0.7, 1.0);
}

void main() 
{
    // Screen coordinate the pixel
    vec2 fragCoord = gl_FragCoord.xy;
    
    // UV coordinate of the pixel
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    // Some math to get beautifull color x)
    // vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));

    vec3 rayOrigin = vec3(0, 3, -15);
    vec3 rayDirection = normalize(vec3(uv.xy, 1));

    float value = RayMarch(rayOrigin, rayDirection);

    vec3 p = rayOrigin + rayDirection * value;
    // rgba(255, 168, 1,1.0)
    vec3 col = vec3(value);
    col = vec3(pow(GetLight(p), 0.525));
    gl_FragColor = vec4(col, 1.0);
}