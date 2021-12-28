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
