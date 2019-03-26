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

'use strict'

/**
 * @type {{type: string, source: string}}
 */
export const vertexQuad = {
  type: 'x-shader/x-vertex',
  source: `
  precision mediump float;

  uniform mat4 u_projection;
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  void main(){
      v_texCoord = a_texCoord;
      gl_Position = u_projection * vec4(a_position, 0.0, 1.0);
  }
`
}

/**
 * @type {{type: string, source: string}}
 */
export const fragmentJpegAlpha = {
  type: 'x-shader/x-fragment',
  source: `
  precision mediump float;
  
  varying vec2 v_texCoord;
  
  uniform sampler2D opaqueTexture;
  uniform sampler2D alphaTexture;

  void main(void) {
   vec4 pix = texture2D(opaqueTexture, v_texCoord);
   vec4 alphaPix = texture2D(alphaTexture, v_texCoord);
   pix.a = alphaPix.r * 1.1644 - 0.07312;
   pix.r = pix.r * 1.1644 - 0.07312;
   pix.g = pix.g * 1.1644 - 0.07312;
   pix.b = pix.b * 1.1644 - 0.07312;
   gl_FragColor = pix;
  }
`
}

/**
 * @type {{type: string, source: string}}
 */
export const fragmentJpeg = {
  type: 'x-shader/x-fragment',
  source: `
  precision mediump float;
  
  varying vec2 v_texCoord;
  
  uniform sampler2D opaqueTexture;

  void main(void) {
   gl_FragColor = texture2D(opaqueTexture, v_texCoord);
  }
`
}

/**
 * @type {{type: string, source: string}}
 */
export const fragmentYUVA = {
  type: 'x-shader/x-fragment',
  source: `
  precision lowp float;
  
  varying vec2 v_texCoord;
  
  uniform sampler2D yTexture;
  uniform sampler2D uTexture;
  uniform sampler2D vTexture;
  uniform sampler2D alphaYTexture;
    
  const mat4 YUV2RGB = mat4
  (
   1.1643828125,             0, 1.59602734375, -.87078515625,
   1.1643828125, -.39176171875,    -.81296875,     .52959375,
   1.1643828125,   2.017234375,             0,  -1.081390625,
              0,             0,             0,             1
  );

  void main(void) {
   vec4 pix = vec4(texture2D(yTexture,  v_texCoord).x, texture2D(uTexture, v_texCoord).x, texture2D(vTexture, v_texCoord).x, 1) * YUV2RGB;
   pix.w = (vec4(texture2D(alphaYTexture,  v_texCoord).x, 0.5019607843137255, 0.5019607843137255, 1) * YUV2RGB).x;
   gl_FragColor = pix;
  }
`
}

/**
 * @type {{type: string, source: string}}
 */
export const fragmentYUV = {
  type: 'x-shader/x-fragment',
  source: `
  precision lowp float;
  
  varying vec2 v_texCoord;
  
  uniform sampler2D yTexture;
  uniform sampler2D uTexture;
  uniform sampler2D vTexture;
    
  const mat4 YUV2RGB = mat4
  (
   1.1643828125,             0, 1.59602734375, -.87078515625,
   1.1643828125, -.39176171875,    -.81296875,     .52959375,
   1.1643828125,   2.017234375,             0,  -1.081390625,
              0,             0,             0,             1
  );

  void main(void) {
   vec4 pix = vec4(texture2D(yTexture,  v_texCoord).x, texture2D(uTexture, v_texCoord).x, texture2D(vTexture, v_texCoord).x, 1) * YUV2RGB;
   pix.w = 1.0;
   // pix.w = 1.0;
   gl_FragColor = pix;
  }
`
}
