// For safari and edge, retrieved from https://dev.to/nektro/createimagebitmap-polyfill-for-safari-and-edge-228

export function polyfillCreateImageBitmap() {
  if (!('createImageBitmap' in window)) {
    window.createImageBitmap = async function (blob) {
      return new Promise((resolve, _reject) => {
        let img = document.createElement('img');
        img.addEventListener('load', function () {
          resolve(this);
          URL.revokeObjectURL(img.src)
        });
        img.src = URL.createObjectURL(blob);
      });
    }
  }
}
