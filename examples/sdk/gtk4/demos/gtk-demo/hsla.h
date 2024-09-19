#pragma once

typedef struct _GdkHSLA GdkHSLA;

struct _GdkHSLA {
  float hue;
  float saturation;
  float lightness;
  float alpha;
};

void            hsla_init_from_rgba    (GdkHSLA          *hsla,
                                             const GdkRGBA    *rgba);
void            rgba_init_from_hsla    (GdkRGBA          *rgba,
                                             const GdkHSLA    *hsla);
