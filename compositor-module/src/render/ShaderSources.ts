// Copyright 2019 Erik De Rijcke
//
// This file is part of Greenfield.
//
// Greenfield is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Greenfield is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Greenfield.  If not, see <https://www.gnu.org/licenses/>.

export const VERTEX_QUAD = {
  type: 'x-shader/x-vertex',
  source: `
  precision mediump float;

  attribute vec2 a_position;
  attribute vec2 a_texCoord;

  varying vec2 v_texCoord;

  void main(){
      v_texCoord = a_texCoord;
      gl_Position = vec4(a_position, 0.0, 1.0);
  }
`,
} as const

export const VERTEX_QUAD_TRANSFORM = {
  type: 'x-shader/x-vertex',
  source: `
    uniform mat4 u_projection;
    uniform mat4 u_transform;

    attribute vec2 a_position;
    attribute vec2 a_texCoord;

    varying vec2 v_texCoord;

    void main(){
        v_texCoord = a_texCoord;
        gl_Position = u_projection * u_transform * vec4(a_position, 0.0, 1.0) ;
    }
`,
} as const

export const FRAGMENT_ARGB8888 = {
  type: 'x-shader/x-fragment',
  source: `
    precision mediump float;
    uniform sampler2D u_texture;
    varying vec2 v_texCoord;
    void main(){
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`,
} as const

export const FRAGMENT_YUVA_TO_RGBA = {
  type: 'x-shader/x-fragment',
  source: `
  precision mediump float;

  varying vec2 v_texCoord;

  uniform sampler2D yTexture;
  uniform sampler2D uTexture;
  uniform sampler2D vTexture;
  uniform sampler2D alphaYTexture;
  
  const vec3 yuv_bt601_offset = vec3(-0.0625, -0.5, -0.5);
  const vec3 yuv_bt601_rcoeff = vec3(1.164, 0.000, 1.596);
  const vec3 yuv_bt601_gcoeff = vec3(1.164,-0.391,-0.813);
  const vec3 yuv_bt601_bcoeff = vec3(1.164, 2.018, 0.000);
  
  vec3 yuv_to_rgb (vec3 val, vec3 offset, vec3 ycoeff, vec3 ucoeff, vec3 vcoeff) {
    vec3 rgb;              
    val += offset;        
    rgb.r = dot(val, ycoeff);
    rgb.g = dot(val, ucoeff);
    rgb.b = dot(val, vcoeff);
    return rgb;
  }

  void main(void) {
    vec4 texel, rgba;

    texel.x = texture2D(yTexture, v_texCoord).r;
    texel.y = texture2D(uTexture, v_texCoord).r;
    texel.z = texture2D(vTexture, v_texCoord).r;
    float alphaChannel = texture2D(alphaYTexture, v_texCoord).r;

    rgba.rgb = yuv_to_rgb (texel.xyz, yuv_bt601_offset, yuv_bt601_rcoeff, yuv_bt601_gcoeff, yuv_bt601_bcoeff);
    rgba.a = yuv_to_rgb (vec3(alphaChannel, 0.55, 0.55), yuv_bt601_offset, yuv_bt601_rcoeff, yuv_bt601_gcoeff, yuv_bt601_bcoeff).r;
    gl_FragColor=rgba;
  }
`,
} as const

export const FRAGMENT_YUV_TO_RGB = {
  type: 'x-shader/x-fragment',
  source: `
  precision mediump float;

  varying vec2 v_texCoord;

  uniform sampler2D yTexture;
  uniform sampler2D uTexture;
  uniform sampler2D vTexture;

  const vec3 yuv_bt709_offset = vec3(-0.0625, -0.5, -0.5);
  const vec3 yuv_bt709_rcoeff = vec3(1.164, 0.000, 1.787);
  const vec3 yuv_bt709_gcoeff = vec3(1.164,-0.213,-0.531);
  const vec3 yuv_bt709_bcoeff = vec3(1.164,2.112, 0.000);
  
  vec3 yuv_to_rgb (vec3 val, vec3 offset, vec3 ycoeff, vec3 ucoeff, vec3 vcoeff) {
    vec3 rgb;              
    val += offset;        
    rgb.r = dot(val, ycoeff);
    rgb.g = dot(val, ucoeff);
    rgb.b = dot(val, vcoeff);
    return rgb;
  }

  void main(void) {
    vec4 texel, rgba;
     
    texel.x = texture2D(yTexture, v_texCoord).r;
    texel.y = texture2D(uTexture, v_texCoord).r;
    texel.z = texture2D(vTexture, v_texCoord).r;

    rgba.rgb = yuv_to_rgb (texel.xyz, yuv_bt709_offset, yuv_bt709_rcoeff, yuv_bt709_gcoeff, yuv_bt709_bcoeff);
    rgba.a = 1.0;
    gl_FragColor=rgba;
  }
`,
} as const
