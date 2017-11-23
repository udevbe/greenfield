'use strict'

export const vertexQuad = {
  type: 'x-shader/x-vertex',
  source: `
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

export const fragmentRGBA = {
  type: 'x-shader/x-fragment',
  source: `
  precision mediump float;
  uniform sampler2D u_texture0;
  varying vec2 v_texCoord;
  void main(){
      gl_FragColor = texture2D(u_texture0, v_texCoord);
  }
`
}

export const fragmentYUV = {
  type: 'x-shader/x-fragment',
  source: `
  precision mediump float;
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
   pix.w = (texture2D(alphaYTexture,  v_texCoord).x - (16.0 / 255.0)) * (255.0 / (235.0-16.0));
   // pix.w = 1.0;
   gl_FragColor = pix;
  }
`
}
