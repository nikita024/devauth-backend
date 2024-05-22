const base65chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
function encodeBase65(input) {
  let output = "";
  let i = 0;
  let length = input.length;
  let enc1, enc2, enc3, enc4;
  
  while (i < length) {
    let chr1 = input.charCodeAt(i++);
    let chr2 = i < length ? input.charCodeAt(i++) : NaN;
    let chr3 = i < length ? input.charCodeAt(i++) : NaN;

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = isNaN(chr2) ? 64 : ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = isNaN(chr3) ? 64 : (chr3 & 63);

    output += base65chars.charAt(enc1) + base65chars.charAt(enc2);
    output += enc3 !== 64 ? base65chars.charAt(enc3) : '';
    output += enc4 !== 64 ? base65chars.charAt(enc4) : '';
  }

  return output;
}

function decodeBase65(input) {
  let output = "";
  let i = 0;
  let length = input.length;
  let enc1, enc2, enc3, enc4;

  while (i < length) {
    enc1 = base65chars.indexOf(input.charAt(i++));
    enc2 = base65chars.indexOf(input.charAt(i++));
    enc3 = base65chars.indexOf(input.charAt(i++));
    enc4 = base65chars.indexOf(input.charAt(i++));

    let chr1 = (enc1 << 2) | (enc2 >> 4);
    let chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    let chr3 = ((enc3 & 3) << 6) | enc4;

    output += String.fromCharCode(chr1);
    if (enc3 !== 64) {
      output += String.fromCharCode(chr2);
    }
    if (enc4 !== 64) {
      output += String.fromCharCode(chr3);
    }
  }

  return output;
}

export { encodeBase65, decodeBase65 };


