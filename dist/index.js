(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // node_modules/nearest-color/nearestColor.js
  var require_nearestColor = __commonJS({
    "node_modules/nearest-color/nearestColor.js"(exports, module) {
      (function(context2) {
        function nearestColor2(needle, colors) {
          needle = parseColor(needle);
          if (!needle) {
            return null;
          }
          var distanceSq, minDistanceSq = Infinity, rgb, value;
          colors || (colors = nearestColor2.DEFAULT_COLORS);
          for (var i = 0; i < colors.length; ++i) {
            rgb = colors[i].rgb;
            distanceSq = Math.pow(needle.r - rgb.r, 2) + Math.pow(needle.g - rgb.g, 2) + Math.pow(needle.b - rgb.b, 2);
            if (distanceSq < minDistanceSq) {
              minDistanceSq = distanceSq;
              value = colors[i];
            }
          }
          if (value.name) {
            return {
              name: value.name,
              value: value.source,
              rgb: value.rgb,
              distance: Math.sqrt(minDistanceSq)
            };
          }
          return value.source;
        }
        nearestColor2.from = function from(availableColors) {
          var colors = mapColors(availableColors), nearestColorBase = nearestColor2;
          var matcher = function nearestColor3(hex) {
            return nearestColorBase(hex, colors);
          };
          matcher.from = from;
          matcher.or = function or(alternateColors) {
            var extendedColors = colors.concat(mapColors(alternateColors));
            return nearestColor2.from(extendedColors);
          };
          return matcher;
        };
        function mapColors(colors) {
          if (colors instanceof Array) {
            return colors.map(function(color) {
              return createColorSpec(color);
            });
          }
          return Object.keys(colors).map(function(name) {
            return createColorSpec(colors[name], name);
          });
        }
        ;
        function parseColor(source) {
          var red, green, blue;
          if (typeof source === "object") {
            return source;
          }
          if (source in nearestColor2.STANDARD_COLORS) {
            return parseColor(nearestColor2.STANDARD_COLORS[source]);
          }
          var hexMatch = source.match(/^#?((?:[0-9a-f]{3}){1,2})$/i);
          if (hexMatch) {
            hexMatch = hexMatch[1];
            if (hexMatch.length === 3) {
              hexMatch = [
                hexMatch.charAt(0) + hexMatch.charAt(0),
                hexMatch.charAt(1) + hexMatch.charAt(1),
                hexMatch.charAt(2) + hexMatch.charAt(2)
              ];
            } else {
              hexMatch = [
                hexMatch.substring(0, 2),
                hexMatch.substring(2, 4),
                hexMatch.substring(4, 6)
              ];
            }
            red = parseInt(hexMatch[0], 16);
            green = parseInt(hexMatch[1], 16);
            blue = parseInt(hexMatch[2], 16);
            return { r: red, g: green, b: blue };
          }
          var rgbMatch = source.match(/^rgb\(\s*(\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)\s*\)$/i);
          if (rgbMatch) {
            red = parseComponentValue(rgbMatch[1]);
            green = parseComponentValue(rgbMatch[2]);
            blue = parseComponentValue(rgbMatch[3]);
            return { r: red, g: green, b: blue };
          }
          throw Error('"' + source + '" is not a valid color');
        }
        function createColorSpec(input, name) {
          var color = {};
          if (name) {
            color.name = name;
          }
          if (typeof input === "string") {
            color.source = input;
            color.rgb = parseColor(input);
          } else if (typeof input === "object") {
            if (input.source) {
              return createColorSpec(input.source, input.name);
            }
            color.rgb = input;
            color.source = rgbToHex(input);
          }
          return color;
        }
        function parseComponentValue(string) {
          if (string.charAt(string.length - 1) === "%") {
            return Math.round(parseInt(string, 10) * 255 / 100);
          }
          return Number(string);
        }
        function rgbToHex(rgb) {
          return "#" + leadingZero(rgb.r.toString(16)) + leadingZero(rgb.g.toString(16)) + leadingZero(rgb.b.toString(16));
        }
        function leadingZero(value) {
          if (value.length === 1) {
            value = "0" + value;
          }
          return value;
        }
        nearestColor2.STANDARD_COLORS = {
          aqua: "#0ff",
          black: "#000",
          blue: "#00f",
          fuchsia: "#f0f",
          gray: "#808080",
          green: "#008000",
          lime: "#0f0",
          maroon: "#800000",
          navy: "#000080",
          olive: "#808000",
          orange: "#ffa500",
          purple: "#800080",
          red: "#f00",
          silver: "#c0c0c0",
          teal: "#008080",
          white: "#fff",
          yellow: "#ff0"
        };
        nearestColor2.DEFAULT_COLORS = mapColors([
          "#f00",
          "#f80",
          "#ff0",
          "#0f0",
          "#00f",
          "#008",
          "#808"
        ]);
        nearestColor2.VERSION = "0.4.4";
        if (typeof module === "object" && module && module.exports) {
          module.exports = nearestColor2;
        } else {
          context2.nearestColor = nearestColor2;
        }
      })(exports);
    }
  });

  // src/colors.ts
  var colorList = {
    "016": "000000",
    "017": "00005f",
    "018": "000087",
    "019": "0000af",
    "020": "0000d7",
    "021": "0000ff",
    "022": "005f00",
    "023": "005f5f",
    "024": "005f87",
    "025": "005faf",
    "026": "005fd7",
    "027": "005fff",
    "028": "008700",
    "029": "00875f",
    "030": "008787",
    "031": "0087af",
    "032": "0087d7",
    "033": "0087ff",
    "034": "00af00",
    "035": "00af5f",
    "036": "00af87",
    "037": "00afaf",
    "038": "00afd7",
    "039": "00afff",
    "040": "00d700",
    "041": "00d75f",
    "042": "00d787",
    "043": "00d7af",
    "044": "00d7d7",
    "045": "00d7ff",
    "046": "00ff00",
    "047": "00ff5f",
    "048": "00ff87",
    "049": "00ffaf",
    "050": "00ffd7",
    "051": "00ffff",
    "052": "5f0000",
    "053": "5f005f",
    "054": "5f0087",
    "055": "5f00af",
    "056": "5f00d7",
    "057": "5f00ff",
    "058": "5f5f00",
    "059": "5f5f5f",
    "060": "5f5f87",
    "061": "5f5faf",
    "062": "5f5fd7",
    "063": "5f5fff",
    "064": "5f8700",
    "065": "5f875f",
    "066": "5f8787",
    "067": "5f87af",
    "068": "5f87d7",
    "069": "5f87ff",
    "070": "5faf00",
    "071": "5faf5f",
    "072": "5faf87",
    "073": "5fafaf",
    "074": "5fafd7",
    "075": "5fafff",
    "076": "5fd700",
    "077": "5fd75f",
    "078": "5fd787",
    "079": "5fd7af",
    "080": "5fd7d7",
    "081": "5fd7ff",
    "082": "5fff00",
    "083": "5fff5f",
    "084": "5fff87",
    "085": "5fffaf",
    "086": "5fffd7",
    "087": "5fffff",
    "088": "870000",
    "089": "87005f",
    "090": "870087",
    "091": "8700af",
    "092": "8700d7",
    "093": "8700ff",
    "094": "875f00",
    "095": "875f5f",
    "096": "875f87",
    "097": "875faf",
    "098": "875fd7",
    "099": "875fff",
    "100": "878700",
    "101": "87875f",
    "102": "878787",
    "103": "8787af",
    "104": "8787d7",
    "105": "8787ff",
    "106": "87af00",
    "107": "87af5f",
    "108": "87af87",
    "109": "87afaf",
    "110": "87afd7",
    "111": "87afff",
    "112": "87d700",
    "113": "87d75f",
    "114": "87d787",
    "115": "87d7af",
    "116": "87d7d7",
    "117": "87d7ff",
    "118": "87ff00",
    "119": "87ff5f",
    "120": "87ff87",
    "121": "87ffaf",
    "122": "87ffd7",
    "123": "87ffff",
    "124": "af0000",
    "125": "af005f",
    "126": "af0087",
    "127": "af00af",
    "128": "af00d7",
    "129": "af00ff",
    "130": "af5f00",
    "131": "af5f5f",
    "132": "af5f87",
    "133": "af5faf",
    "134": "af5fd7",
    "135": "af5fff",
    "136": "af8700",
    "137": "af875f",
    "138": "af8787",
    "139": "af87af",
    "140": "af87d7",
    "141": "af87ff",
    "142": "afaf00",
    "143": "afaf5f",
    "144": "afaf87",
    "145": "afafaf",
    "146": "afafd7",
    "147": "afafff",
    "148": "afd700",
    "149": "afd75f",
    "150": "afd787",
    "151": "afd7af",
    "152": "afd7d7",
    "153": "afd7ff",
    "154": "afff00",
    "155": "afff5f",
    "156": "afff87",
    "157": "afffaf",
    "158": "afffd7",
    "159": "afffff",
    "160": "d70000",
    "161": "d7005f",
    "162": "d70087",
    "163": "d700af",
    "164": "d700d7",
    "165": "d700ff",
    "166": "d75f00",
    "167": "d75f5f",
    "168": "d75f87",
    "169": "d75faf",
    "170": "d75fd7",
    "171": "d75fff",
    "172": "d78700",
    "173": "d7875f",
    "174": "d78787",
    "175": "d787af",
    "176": "d787d7",
    "177": "d787ff",
    "178": "d7af00",
    "179": "d7af5f",
    "180": "d7af87",
    "181": "d7afaf",
    "182": "d7afd7",
    "183": "d7afff",
    "184": "d7d700",
    "185": "d7d75f",
    "186": "d7d787",
    "187": "d7d7af",
    "188": "d7d7d7",
    "189": "d7d7ff",
    "190": "d7ff00",
    "191": "d7ff5f",
    "192": "d7ff87",
    "193": "d7ffaf",
    "194": "d7ffd7",
    "195": "d7ffff",
    "196": "ff0000",
    "197": "ff005f",
    "198": "ff0087",
    "199": "ff00af",
    "200": "ff00d7",
    "201": "ff00ff",
    "202": "ff5f00",
    "203": "ff5f5f",
    "204": "ff5f87",
    "205": "ff5faf",
    "206": "ff5fd7",
    "207": "ff5fff",
    "208": "ff8700",
    "209": "ff875f",
    "210": "ff8787",
    "211": "ff87af",
    "212": "ff87d7",
    "213": "ff87ff",
    "214": "ffaf00",
    "215": "ffaf5f",
    "216": "ffaf87",
    "217": "ffafaf",
    "218": "ffafd7",
    "219": "ffafff",
    "220": "ffd700",
    "221": "ffd75f",
    "222": "ffd787",
    "223": "ffd7af",
    "224": "ffd7d7",
    "225": "ffd7ff",
    "226": "ffff00",
    "227": "ffff5f",
    "228": "ffff87",
    "229": "ffffaf",
    "230": "ffffd7",
    "231": "ffffff",
    "232": "080808",
    "233": "121212",
    "234": "1c1c1c",
    "235": "262626",
    "236": "303030",
    "237": "3a3a3a",
    "238": "444444",
    "239": "4e4e4e",
    "240": "585858",
    "241": "626262",
    "242": "6c6c6c",
    "243": "767676",
    "244": "808080",
    "245": "8a8a8a",
    "246": "949494",
    "247": "9e9e9e",
    "248": "a8a8a8",
    "249": "b2b2b2",
    "250": "bcbcbc",
    "251": "c6c6c6",
    "252": "d0d0d0",
    "253": "dadada",
    "254": "e4e4e4",
    "255": "eeeeee",
    "16-a": "000000",
    "231-z": "ffffff"
  };
  var xList = {
    "016": "000",
    "017": "001",
    "018": "002",
    "019": "003",
    "020": "004",
    "021": "005",
    "022": "010",
    "023": "011",
    "024": "012",
    "025": "013",
    "026": "014",
    "027": "015",
    "028": "020",
    "029": "021",
    "030": "022",
    "031": "023",
    "032": "024",
    "033": "025",
    "034": "030",
    "035": "031",
    "036": "032",
    "037": "033",
    "038": "034",
    "039": "035",
    "040": "040",
    "041": "041",
    "042": "042",
    "043": "043",
    "044": "044",
    "045": "045",
    "046": "050",
    "047": "051",
    "048": "052",
    "049": "053",
    "050": "054",
    "051": "055",
    "052": "100",
    "053": "101",
    "054": "102",
    "055": "103",
    "056": "104",
    "057": "105",
    "058": "110",
    "059": "111",
    "060": "112",
    "061": "113",
    "062": "114",
    "063": "115",
    "064": "120",
    "065": "121",
    "066": "122",
    "067": "123",
    "068": "124",
    "069": "125",
    "070": "130",
    "071": "131",
    "072": "132",
    "073": "133",
    "074": "134",
    "075": "135",
    "076": "140",
    "077": "141",
    "078": "142",
    "079": "143",
    "080": "144",
    "081": "145",
    "082": "150",
    "083": "151",
    "084": "152",
    "085": "153",
    "086": "154",
    "087": "155",
    "088": "200",
    "089": "201",
    "090": "202",
    "091": "203",
    "092": "204",
    "093": "205",
    "094": "210",
    "095": "211",
    "096": "212",
    "097": "213",
    "098": "214",
    "099": "215",
    "100": "220",
    "101": "221",
    "102": "222",
    "103": "223",
    "104": "224",
    "105": "225",
    "106": "230",
    "107": "231",
    "108": "232",
    "109": "233",
    "110": "234",
    "111": "235",
    "112": "240",
    "113": "241",
    "114": "242",
    "115": "243",
    "116": "244",
    "117": "245",
    "118": "250",
    "119": "251",
    "120": "252",
    "121": "253",
    "122": "254",
    "123": "255",
    "124": "300",
    "125": "301",
    "126": "302",
    "127": "303",
    "128": "304",
    "129": "305",
    "130": "310",
    "131": "311",
    "132": "312",
    "133": "313",
    "134": "314",
    "135": "315",
    "136": "320",
    "137": "321",
    "138": "322",
    "139": "323",
    "140": "324",
    "141": "325",
    "142": "330",
    "143": "331",
    "144": "332",
    "145": "333",
    "146": "334",
    "147": "335",
    "148": "340",
    "149": "341",
    "150": "342",
    "151": "343",
    "152": "344",
    "153": "345",
    "154": "350",
    "155": "351",
    "156": "352",
    "157": "353",
    "158": "354",
    "159": "355",
    "160": "400",
    "161": "401",
    "162": "402",
    "163": "403",
    "164": "404",
    "165": "405",
    "166": "410",
    "167": "411",
    "168": "412",
    "169": "413",
    "170": "414",
    "171": "415",
    "172": "420",
    "173": "421",
    "174": "422",
    "175": "423",
    "176": "424",
    "177": "425",
    "178": "430",
    "179": "431",
    "180": "432",
    "181": "433",
    "182": "434",
    "183": "435",
    "184": "440",
    "185": "441",
    "186": "442",
    "187": "443",
    "188": "444",
    "189": "445",
    "190": "450",
    "191": "451",
    "192": "452",
    "193": "453",
    "194": "454",
    "195": "455",
    "196": "500",
    "197": "501",
    "198": "502",
    "199": "503",
    "200": "504",
    "201": "505",
    "202": "510",
    "203": "511",
    "204": "512",
    "205": "513",
    "206": "514",
    "207": "515",
    "208": "520",
    "209": "521",
    "210": "522",
    "211": "523",
    "212": "524",
    "213": "525",
    "214": "530",
    "215": "531",
    "216": "532",
    "217": "533",
    "218": "534",
    "219": "535",
    "220": "540",
    "221": "541",
    "222": "542",
    "223": "543",
    "224": "544",
    "225": "545",
    "226": "550",
    "227": "551",
    "228": "552",
    "229": "553",
    "230": "554",
    "231": "555",
    "232": "=b",
    "233": "=c",
    "234": "=d",
    "235": "=e",
    "236": "=f",
    "237": "=g",
    "238": "=h",
    "239": "=i",
    "240": "=j",
    "241": "=k",
    "242": "=l",
    "243": "=m",
    "244": "=n",
    "245": "=o",
    "246": "=p",
    "247": "=q",
    "248": "=r",
    "249": "=s",
    "250": "=t",
    "251": "=u",
    "252": "=v",
    "253": "=w",
    "254": "=x",
    "255": "=y",
    "16-a": "=a",
    "231-z": "=z"
  };

  // src/index.ts
  var import_nearest_color = __toESM(require_nearestColor());
  var canvas = document.getElementById("preview");
  var asciiImage = document.getElementById("ascii");
  var xTermData = document.getElementById("xterm");
  var context = canvas.getContext("2d");
  var fileInput = document.querySelector('input[type="file"]');
  var scaleInput = document.getElementById("scale");
  var size = {
    width: 100,
    height: 100
  };
  var toGrayScale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  var getFontRatio = () => {
    const pre = document.createElement("pre");
    pre.style.display = "inline";
    pre.textContent = " ";
    document.body.appendChild(pre);
    const { width, height } = pre.getBoundingClientRect();
    document.body.removeChild(pre);
    return height / width;
  };
  var clampSize = (width, height) => {
    const adjustedWidth = Math.floor(getFontRatio() * width);
    if (height > size.height) {
      return [Math.floor(adjustedWidth * size.height / height), size.height];
    }
    if (width > size.width) {
      return [size.width, Math.floor(height * size.width / adjustedWidth)];
    }
    return [adjustedWidth, height];
  };
  var convertImage = (context2, width, height) => {
    const imageData = context2.getImageData(0, 0, width, height);
    const grayScales = [];
    const xTermColors = [];
    const pixelColors = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];
      const grayScale = toGrayScale(r, g, b);
      imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = imageData.data[i + 3] = grayScale;
      grayScales.push(grayScale);
      const nearest = (0, import_nearest_color.default)({ r, g, b }, colorList);
      pixelColors.push(__spreadProps(__spreadValues({}, nearest.rgb), { a }));
      xTermColors.push(xList[nearest.name]);
    }
    context2.putImageData(imageData, 0, 0);
    return { grayScales, pixelColors, xTermColors };
  };
  var reader = new FileReader();
  var renderImage = () => {
    {
      const image = new Image();
      image.onload = () => {
        const [width, height] = clampSize(image.width, image.height);
        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        const { grayScales, pixelColors, xTermColors } = convertImage(context, width, height);
        drawAscii(grayScales, pixelColors, xTermColors, width);
        fileInput.value = "";
      };
      image.src = reader.result;
    }
    ;
  };
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    reader.onload = renderImage;
    reader.readAsDataURL(file);
  };
  var grayRamp = " ****########%%%%%%%%%%%@@@@@@@@@@@@@@@@";
  var rampLength = grayRamp.length;
  var convertToChar = (grayScale) => grayRamp[Math.ceil((rampLength - 1) * grayScale / 255)];
  var drawAscii = (grayScales, pixelColors, xTermColors, width) => {
    const html = { lines: [], line: "", lastColor: null };
    const xterm = { lines: [], line: "", lastColor: null };
    let leastSpaces = 1e4;
    grayScales.forEach((scale, index) => {
      const rampChar = convertToChar(scale);
      let color = pixelColors[index];
      let xcolor = xTermColors[index];
      if (color.a !== 0) {
        xterm.line += xterm.lastColor === xcolor ? rampChar : `|${xcolor}${rampChar}`;
        html.line += html.lastColor === color ? rampChar : `${html.line !== "" ? "</span>" : ""}<span style="background-color:none;color:rgb(${color.r},${color.g},${color.b})">${rampChar}`;
      } else {
        xterm.line += " ";
        html.line += " ";
      }
      if ((index + 1) % width === 0) {
        const i = html.line.search(/\S/);
        if (i < leastSpaces && i > -1) {
          leastSpaces = i;
        }
        ;
        if (/^\s+$/.exec(html.line) === null) {
          html.lines.push(html.line);
          xterm.lines.push(xterm.line);
        }
        xterm.line = "";
        html.line = "";
      }
      xterm.lastColor = color;
      html.lastColor = color;
    });
    xTermData.innerText = xterm.lines.map((l, i) => {
      const prefix = i === 0 ? "|000" : "";
      return prefix + l.slice(leastSpaces).trimEnd().replace(/[ ]/gm, "|_");
    }).join("|/");
    asciiImage.innerHTML = html.lines.map((l) => l.slice(leastSpaces).trimEnd()).join("<br>");
  };
  var updateValue = (e) => {
    size.height = size.width = parseInt(e.target.value);
    renderImage();
  };
  scaleInput.addEventListener("change", updateValue);
})();
