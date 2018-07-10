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
