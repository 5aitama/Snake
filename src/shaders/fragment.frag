precision mediump float;

// The time in seconds
uniform float iTime;

// The screen resolution in pixel
uniform vec2 iResolution;

#define MIN_DIST 0.01
#define MAX_DIST 100.
#define MAX_ITER 100

float Scene(vec3 position)
{
    vec4 sphere = vec4(0, 1, 6, 1);

    float sphereDist = length(position - sphere.xyz) - sphere.w;
    float planeDist = position.y;
    return min(sphereDist, planeDist);
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

void main() 
{
    // Screen coordinate the pixel
    vec2 fragCoord = gl_FragCoord.xy;
    
    // UV coordinate of the pixel
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

    // Some math to get beautifull color x)
    // vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0, 2, 4));

    vec3 rayOrigin = vec3(0, 1, 0);
    vec3 rayDirection = normalize(vec3(uv.xy, 1));

    float value = RayMarch(rayOrigin, rayDirection) / 100.;
    vec3 col = vec3(value);
    
    gl_FragColor = vec4(col, 1.0);
}