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

export const WlShmFormat = {
  /**
   * 32-bit ARGB format, [31:0] A:R:G:B 8:8:8:8 little endian
   */
  argb8888: 0,
  /**
   * 32-bit RGB format, [31:0] x:R:G:B 8:8:8:8 little endian
   */
  xrgb8888: 1,
  /**
   * 8-bit color index format, [7:0] C
   */
  c8: 0x20203843,
  /**
   * 8-bit RGB format, [7:0] R:G:B 3:3:2
   */
  rgb332: 0x38424752,
  /**
   * 8-bit BGR format, [7:0] B:G:R 2:3:3
   */
  bgr233: 0x38524742,
  /**
   * 16-bit xRGB format, [15:0] x:R:G:B 4:4:4:4 little endian
   */
  xrgb4444: 0x32315258,
  /**
   * 16-bit xBGR format, [15:0] x:B:G:R 4:4:4:4 little endian
   */
  xbgr4444: 0x32314258,
  /**
   * 16-bit RGBx format, [15:0] R:G:B:x 4:4:4:4 little endian
   */
  rgbx4444: 0x32315852,
  /**
   * 16-bit BGRx format, [15:0] B:G:R:x 4:4:4:4 little endian
   */
  bgrx4444: 0x32315842,
  /**
   * 16-bit ARGB format, [15:0] A:R:G:B 4:4:4:4 little endian
   */
  argb4444: 0x32315241,
  /**
   * 16-bit ABGR format, [15:0] A:B:G:R 4:4:4:4 little endian
   */
  abgr4444: 0x32314241,
  /**
   * 16-bit RBGA format, [15:0] R:G:B:A 4:4:4:4 little endian
   */
  rgba4444: 0x32314152,
  /**
   * 16-bit BGRA format, [15:0] B:G:R:A 4:4:4:4 little endian
   */
  bgra4444: 0x32314142,
  /**
   * 16-bit xRGB format, [15:0] x:R:G:B 1:5:5:5 little endian
   */
  xrgb1555: 0x35315258,
  /**
   * 16-bit xBGR 1555 format, [15:0] x:B:G:R 1:5:5:5 little endian
   */
  xbgr1555: 0x35314258,
  /**
   * 16-bit RGBx 5551 format, [15:0] R:G:B:x 5:5:5:1 little endian
   */
  rgbx5551: 0x35315852,
  /**
   * 16-bit BGRx 5551 format, [15:0] B:G:R:x 5:5:5:1 little endian
   */
  bgrx5551: 0x35315842,
  /**
   * 16-bit ARGB 1555 format, [15:0] A:R:G:B 1:5:5:5 little endian
   */
  argb1555: 0x35315241,
  /**
   * 16-bit ABGR 1555 format, [15:0] A:B:G:R 1:5:5:5 little endian
   */
  abgr1555: 0x35314241,
  /**
   * 16-bit RGBA 5551 format, [15:0] R:G:B:A 5:5:5:1 little endian
   */
  rgba5551: 0x35314152,
  /**
   * 16-bit BGRA 5551 format, [15:0] B:G:R:A 5:5:5:1 little endian
   */
  bgra5551: 0x35314142,
  /**
   * 16-bit RGB 565 format, [15:0] R:G:B 5:6:5 little endian
   */
  rgb565: 0x36314752,
  /**
   * 16-bit BGR 565 format, [15:0] B:G:R 5:6:5 little endian
   */
  bgr565: 0x36314742,
  /**
   * 24-bit RGB format, [23:0] R:G:B little endian
   */
  rgb888: 0x34324752,
  /**
   * 24-bit BGR format, [23:0] B:G:R little endian
   */
  bgr888: 0x34324742,
  /**
   * 32-bit xBGR format, [31:0] x:B:G:R 8:8:8:8 little endian
   */
  xbgr8888: 0x34324258,
  /**
   * 32-bit RGBx format, [31:0] R:G:B:x 8:8:8:8 little endian
   */
  rgbx8888: 0x34325852,
  /**
   * 32-bit BGRx format, [31:0] B:G:R:x 8:8:8:8 little endian
   */
  bgrx8888: 0x34325842,
  /**
   * 32-bit ABGR format, [31:0] A:B:G:R 8:8:8:8 little endian
   */
  abgr8888: 0x34324241,
  /**
   * 32-bit RGBA format, [31:0] R:G:B:A 8:8:8:8 little endian
   */
  rgba8888: 0x34324152,
  /**
   * 32-bit BGRA format, [31:0] B:G:R:A 8:8:8:8 little endian
   */
  bgra8888: 0x34324142,
  /**
   * 32-bit xRGB format, [31:0] x:R:G:B 2:10:10:10 little endian
   */
  xrgb2101010: 0x30335258,
  /**
   * 32-bit xBGR format, [31:0] x:B:G:R 2:10:10:10 little endian
   */
  xbgr2101010: 0x30334258,
  /**
   * 32-bit RGBx format, [31:0] R:G:B:x 10:10:10:2 little endian
   */
  rgbx1010102: 0x30335852,
  /**
   * 32-bit BGRx format, [31:0] B:G:R:x 10:10:10:2 little endian
   */
  bgrx1010102: 0x30335842,
  /**
   * 32-bit ARGB format, [31:0] A:R:G:B 2:10:10:10 little endian
   */
  argb2101010: 0x30335241,
  /**
   * 32-bit ABGR format, [31:0] A:B:G:R 2:10:10:10 little endian
   */
  abgr2101010: 0x30334241,
  /**
   * 32-bit RGBA format, [31:0] R:G:B:A 10:10:10:2 little endian
   */
  rgba1010102: 0x30334152,
  /**
   * 32-bit BGRA format, [31:0] B:G:R:A 10:10:10:2 little endian
   */
  bgra1010102: 0x30334142,
  /**
   * packed YCbCr format, [31:0] Cr0:Y1:Cb0:Y0 8:8:8:8 little endian
   */
  yuyv: 0x56595559,
  /**
   * packed YCbCr format, [31:0] Cb0:Y1:Cr0:Y0 8:8:8:8 little endian
   */
  yvyu: 0x55595659,
  /**
   * packed YCbCr format, [31:0] Y1:Cr0:Y0:Cb0 8:8:8:8 little endian
   */
  uyvy: 0x59565955,
  /**
   * packed YCbCr format, [31:0] Y1:Cb0:Y0:Cr0 8:8:8:8 little endian
   */
  vyuy: 0x59555956,
  /**
   * packed AYCbCr format, [31:0] A:Y:Cb:Cr 8:8:8:8 little endian
   */
  ayuv: 0x56555941,
  /**
   * 2 plane YCbCr Cr:Cb format, 2x2 subsampled Cr:Cb plane
   */
  nv12: 0x3231564e,
  /**
   * 2 plane YCbCr Cb:Cr format, 2x2 subsampled Cb:Cr plane
   */
  nv21: 0x3132564e,
  /**
   * 2 plane YCbCr Cr:Cb format, 2x1 subsampled Cr:Cb plane
   */
  nv16: 0x3631564e,
  /**
   * 2 plane YCbCr Cb:Cr format, 2x1 subsampled Cb:Cr plane
   */
  nv61: 0x3136564e,
  /**
   * 3 plane YCbCr format, 4x4 subsampled Cb (1) and Cr (2) planes
   */
  yuv410: 0x39565559,
  /**
   * 3 plane YCbCr format, 4x4 subsampled Cr (1) and Cb (2) planes
   */
  yvu410: 0x39555659,
  /**
   * 3 plane YCbCr format, 4x1 subsampled Cb (1) and Cr (2) planes
   */
  yuv411: 0x31315559,
  /**
   * 3 plane YCbCr format, 4x1 subsampled Cr (1) and Cb (2) planes
   */
  yvu411: 0x31315659,
  /**
   * 3 plane YCbCr format, 2x2 subsampled Cb (1) and Cr (2) planes
   */
  yuv420: 0x32315559,
  /**
   * 3 plane YCbCr format, 2x2 subsampled Cr (1) and Cb (2) planes
   */
  yvu420: 0x32315659,
  /**
   * 3 plane YCbCr format, 2x1 subsampled Cb (1) and Cr (2) planes
   */
  yuv422: 0x36315559,
  /**
   * 3 plane YCbCr format, 2x1 subsampled Cr (1) and Cb (2) planes
   */
  yvu422: 0x36315659,
  /**
   * 3 plane YCbCr format, non-subsampled Cb (1) and Cr (2) planes
   */
  yuv444: 0x34325559,
  /**
   * 3 plane YCbCr format, non-subsampled Cr (1) and Cb (2) planes
   */
  yvu444: 0x34325659,
} as const
