import Mat4 from './Mat4'

const NORMAL = Mat4.IDENTITY()
const _90 = Mat4.create(
  0, -1, 0, 0,
  1, 0, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
)
const _180 = Mat4.create(
  -1, 0, 0, 0,
  0, -1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
)
const _270 = Mat4.create(
  0, 1, 0, 0,
  -1, -0, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
)
const FLIPPED = Mat4.create(
  -1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
)
const FLIPPED_90 = Mat4.create(
  0, 1, 0, 0,
  1, 0, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
)
const FLIPPED_180 = Mat4.create(
  1, 0, 0, 0,
  0, -1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
)
const FLIPPED_270 = Mat4.create(
  0, -1, 0, 0,
  -1, 0, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
)

export {
  NORMAL,
  _90,
  _180,
  _270,
  FLIPPED,
  FLIPPED_90,
  FLIPPED_180,
  FLIPPED_270
}
