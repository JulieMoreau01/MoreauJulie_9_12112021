export default function MockFile() {}

MockFile.prototype.create = function (name, size, mimeType) {
  name = name || "mock.txt";
  size = size || 1024;
  mimeType = mimeType || "plain/txt";

  function range(count) {
    let output = "";
    for (let i = 0; i < count; i++) {
      output += "a";
    }
    return output;
  }

  let blob = new Blob([range(size)], { type: mimeType });
  blob.lastModifiedDate = new Date();
  blob.name = name;

  return blob;
};
