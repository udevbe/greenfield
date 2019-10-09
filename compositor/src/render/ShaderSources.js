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
export const fragmentVideoAlpha = {
  type: 'x-shader/x-fragment',
  source: `
  precision lowp float;
  
  varying vec2 v_texCoord;
  
  uniform sampler2D opaqueTexture;
  uniform sampler2D alphaTexture;

  void main(void) {
    gl_FragColor = vec4(texture2D(opaqueTexture, v_texCoord).xyz, texture2D(alphaTexture, v_texCoord).x);
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
    
  const mat4 conversion = mat4(
    1.0,     0.0,     1.402,  -0.701,
    1.0,    -0.344,  -0.714,   0.529,
    1.0,     1.772,   0.0,    -0.886,
    0.0,     0.0,     0.0,     0.0
  );

  void main(void) {
    float yChannel = texture2D(yTexture, v_texCoord).x;
    float uChannel = texture2D(uTexture, v_texCoord).x;
    float vChannel = texture2D(vTexture, v_texCoord).x;
    float alphaChannel = texture2D(alphaYTexture, v_texCoord).x;
    vec4 channels = vec4(yChannel, uChannel, vChannel, 1.0);
    vec3 rgb = (channels * conversion).xyz;

    gl_FragColor = vec4(rgb, alphaChannel*1.0894);
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
    
  const mat4 conversion = mat4(
    1.0,     0.0,     1.402,  -0.701,
    1.0,    -0.344,  -0.714,   0.529,
    1.0,     1.772,   0.0,    -0.886,
    0.0,     0.0,     0.0,     0.0
  );

  void main(void) {
    float yChannel = texture2D(yTexture, v_texCoord).x;
    float uChannel = texture2D(uTexture, v_texCoord).x;
    float vChannel = texture2D(vTexture, v_texCoord).x;
    vec4 channels = vec4(yChannel, uChannel, vChannel, 1.0);
    vec3 rgb = (channels * conversion).xyz;
    gl_FragColor = vec4(rgb, 1.0);
  }
`
}
