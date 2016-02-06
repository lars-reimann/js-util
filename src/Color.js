/**
 * Represents a color.
 */
export default class Color {

    /**
     * Converts an RGBA color value to a Color object.
     *
     * @param {Number} r
     * The red channel. This is an integer in the range [0, 255].
     *
     * @param {Number} g
     * The green channel. This is an integer in the range [0, 255].
     *
     * @param {Number} b
     * The blue channel. This is an integer in the range [0, 255].
     *
     * @param {Number} a
     * The alpha value. This is a number in the range [0, 1]. 0 represents full
     * transparency and 1 is full opacity.
     *
     * @return {Color}
     * The generated Color object.
     */
    static fromRGBA(r, g, b, a = 1) {
        const hex = (r << 8 | g) << 8 | b;
        return new Color(hex, a);
    }

    /**
     * Converts an HSLA color value to a Color object.
     *
     * @param {Number} h
     * The hue. This is a number in the range [0, 360).
     *
     * @param {Number} s
     * The saturation. This is a number in the range [0, 1].
     *
     * @param {Number} l
     * The lightness. This is a number in the range [0, 1].
     *
     * @param {Number} a
     * The alpha value. This is a number in the range [0, 1]. 0 represents full
     * transparency and 1 is full opacity.
     *
     * @return {Color}
     * The generated Color object.
     */
    static fromHSLA(h, s, l, a){
        h /= 360;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s,
                  m1 = l * 2 - m2;
            r  = Color.hueToRGB(m1, m2, h + 1/3);
            g  = Color.hueToRGB(m1, m2, h      );
            b  = Color.hueToRGB(m1, m2, h - 1/3);
        }

        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);

        const hex = (r << 8 | g) << 8 | b;
        return new Color(hex, a);
    }

    /**
     * A helper function for the conversion from HSL to RGB.
     *
     * @private
     */
    static hueToRGB(m1, m2, h) {
        if (h < 0)   h += 1;
        if (h > 1)   h -= 1;
        if (h < 1/6) return m1 + (m2 - m1) * 6 * h;
        if (h < 1/2) return m2;
        if (h < 2/3) return m1 + (m2 - m1) * (2/3 - h) * 6;
        return m1;
    }

    /**
     * @param {Number} hex
     * The hex value.
     *
     * @param  {Number} [alpha=1]
     * The alpha value. This is a number in the range [0, 1]. 0 represents full
     * transparency and 1 is full opacity.
     */
    constructor(hex, alpha = 1) {

        /**
         * The hex value of this color.
         *
         * @type {Number}
         */
        this.hex = hex;

        /**
         * The alpha value of this color. This is a number in the range [0, 1].
         * 0 represents full transparency and 1 is full opacity.
         *
         * @type {Number}
         */
        this.alpha = alpha;
    }

    /**
     * Converts this Color object to RGBA.
     *
     * @return {Object}
     * An RGBA representation of this color. The resulting object has the three
     * properties r, g and b for the red, green and blue channel respectively.
     * Those are integers in the range [0, 255]. It also has an a property for
     * the alpha value. This is a number in the range [0, 1]. 0 represents full
     * transparency and 1 is full opacity.
     */
    toRGBA() {
        const r = this.hex >> 16 & 255,
              g = this.hex >> 8  & 255,
              b = this.hex       & 255;
        return {r, g, b, a: this.alpha};
    }

    /**
     * Converts this Color object to HSLA.
     *
     * @return {Object}
     * An HSLA representation of this color. The resulting object has the three
     * properties h, s and l for the hue, saturation and lightness respectively.
     * The hue is a number in the range [0, 360) and saturation and lightness
     * are in the range [0, 1]. It also has an a property for the alpha value.
     * This is a number in the range [0, 1]. 0 represents full transparency and
     * 1 is full opacity.
     */
    toHSLA() {
        const r   = (this.hex >> 16 & 255) / 255,
              g   = (this.hex >> 8  & 255) / 255,
              b   = (this.hex       & 255) / 255,
              max = Math.max(r, g, b),
              min = Math.min(r, g, b);

        let h, s, l;

        l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2;               break;
            case b: h = (r - g) / d + 4;               break;
            }
            h /= 6;
        }

        return {h: h * 360, s, l, a: this.alpha};
    }

    /**
     * Returns a textual representation of this color.
     *
     * @return {String}
     * A textual representation of this color.
     */
    toString() {
        `#${this.hex.toString(16)}`;
    }
}

export const predefinedColors = {
    black:                new Color(0x000000),
    silver:               new Color(0xc0c0c0),
    gray:                 new Color(0x808080),
    white:                new Color(0xffffff),
    maroon:               new Color(0x800000),
    red:                  new Color(0xff0000),
    purple:               new Color(0x800080),
    fuchsia:              new Color(0xff00ff),
    green:                new Color(0x008000),
    lime:                 new Color(0x00ff00),
    olive:                new Color(0x808000),
    yellow:               new Color(0xffff00),
    navy:                 new Color(0x000080),
    blue:                 new Color(0x0000ff),
    teal:                 new Color(0x008080),
    aqua:                 new Color(0x00ffff),
    orange:               new Color(0xffa500),
    aliceblue:            new Color(0xf0f8ff),
    antiquewhite:         new Color(0xfaebd7),
    aquamarine:           new Color(0x7fffd4),
    azure:                new Color(0xf0ffff),
    beige:                new Color(0xf5f5dc),
    bisque:               new Color(0xffe4c4),
    blanchedalmond:       new Color(0xffe4c4),
    blueviolet:           new Color(0x8a2be2),
    brown:                new Color(0xa52a2a),
    burlywood:            new Color(0xdeb887),
    cadetblue:            new Color(0x5f9ea0),
    chartreuse:           new Color(0x7fff00),
    chocolate:            new Color(0xd2691e),
    coral:                new Color(0xff7f50),
    cornflowerblue:       new Color(0x6495ed),
    cornsilk:             new Color(0xfff8dc),
    crimson:              new Color(0xdc143c),
    darkblue:             new Color(0x00008b),
    darkcyan:             new Color(0x008b8b),
    darkgoldenrod:        new Color(0xb8860b),
    darkgray:             new Color(0xa9a9a9),
    darkgreen:            new Color(0x006400),
    darkgrey:             new Color(0xa9a9a9),
    darkkhaki:            new Color(0xbdb76b),
    darkmagenta:          new Color(0x8b008b),
    darkolivegreen:       new Color(0x556b2f),
    darkorange:           new Color(0xff8c00),
    darkorchid:           new Color(0x9932cc),
    darkred:              new Color(0x8b0000),
    darksalmon:           new Color(0xe9967a),
    darkseagreen:         new Color(0x8fbc8f),
    darkslateblue:        new Color(0x483d8b),
    darkslategray:        new Color(0x2f4f4f),
    darkslategrey:        new Color(0x2f4f4f),
    darkturquoise:        new Color(0x00ced1),
    darkviolet:           new Color(0x9400d3),
    deeppink:             new Color(0xff1493),
    deepskyblue:          new Color(0x00bfff),
    dimgray:              new Color(0x696969),
    dimgrey:              new Color(0x696969),
    dodgerblue:           new Color(0x1e90ff),
    firebrick:            new Color(0xb22222),
    floralwhite:          new Color(0xfffaf0),
    forestgreen:          new Color(0x228b22),
    gainsboro:            new Color(0xdcdcdc),
    ghostwhite:           new Color(0xf8f8ff),
    gold:                 new Color(0xffd700),
    goldenrod:            new Color(0xdaa520),
    greenyellow:          new Color(0xadff2f),
    grey:                 new Color(0x808080),
    honeydew:             new Color(0xf0fff0),
    hotpink:              new Color(0xff69b4),
    indianred:            new Color(0xcd5c5c),
    indigo:               new Color(0x4b0082),
    ivory:                new Color(0xfffff0),
    khaki:                new Color(0xf0e68c),
    lavender:             new Color(0xe6e6fa),
    lavenderblush:        new Color(0xfff0f5),
    lawngreen:            new Color(0x7cfc00),
    lemonchiffon:         new Color(0xfffacd),
    lightblue:            new Color(0xadd8e6),
    lightcoral:           new Color(0xf08080),
    lightcyan:            new Color(0xe0ffff),
    lightgoldenrodyellow: new Color(0xfafad2),
    lightgray:            new Color(0xd3d3d3),
    lightgreen:           new Color(0x90ee90),
    lightgrey:            new Color(0xd3d3d3),
    lightpink:            new Color(0xffb6c1),
    lightsalmon:          new Color(0xffa07a),
    lightseagreen:        new Color(0x20b2aa),
    lightskyblue:         new Color(0x87cefa),
    lightslategray:       new Color(0x778899),
    lightslategrey:       new Color(0x778899),
    lightsteelblue:       new Color(0xb0c4de),
    lightyellow:          new Color(0xffffe0),
    limegreen:            new Color(0x32cd32),
    linen:                new Color(0xfaf0e6),
    mediumaquamarine:     new Color(0x66cdaa),
    mediumblue:           new Color(0x0000cd),
    mediumorchid:         new Color(0xba55d3),
    mediumpurple:         new Color(0x9370db),
    mediumseagreen:       new Color(0x3cb371),
    mediumslateblue:      new Color(0x7b68ee),
    mediumspringgreen:    new Color(0x00fa9a),
    mediumturquoise:      new Color(0x48d1cc),
    mediumvioletred:      new Color(0xc71585),
    midnightblue:         new Color(0x191970),
    mintcream:            new Color(0xf5fffa),
    mistyrose:            new Color(0xffe4e1),
    moccasin:             new Color(0xffe4b5),
    navajowhite:          new Color(0xffdead),
    oldlace:              new Color(0xfdf5e6),
    olivedrab:            new Color(0x6b8e23),
    orangered:            new Color(0xff4500),
    orchid:               new Color(0xda70d6),
    palegoldenrod:        new Color(0xeee8aa),
    palegreen:            new Color(0x98fb98),
    paleturquoise:        new Color(0xafeeee),
    palevioletred:        new Color(0xdb7093),
    papayawhip:           new Color(0xffefd5),
    peachpuff:            new Color(0xffdab9),
    peru:                 new Color(0xcd853f),
    pink:                 new Color(0xffc0cb),
    plum:                 new Color(0xdda0dd),
    powderblue:           new Color(0xb0e0e6),
    rosybrown:            new Color(0xbc8f8f),
    royalblue:            new Color(0x4169e1),
    saddlebrown:          new Color(0x8b4513),
    salmon:               new Color(0xfa8072),
    sandybrown:           new Color(0xf4a460),
    seagreen:             new Color(0x2e8b57),
    seashell:             new Color(0xfff5ee),
    sienna:               new Color(0xa0522d),
    skyblue:              new Color(0x87ceeb),
    slateblue:            new Color(0x6a5acd),
    slategray:            new Color(0x708090),
    slategrey:            new Color(0x708090),
    snow:                 new Color(0xfffafa),
    springgreen:          new Color(0x00ff7f),
    steelblue:            new Color(0x4682b4),
    tan:                  new Color(0xd2b48c),
    thistle:              new Color(0xd8bfd8),
    tomato:               new Color(0xff6347),
    turquoise:            new Color(0x40e0d0),
    violet:               new Color(0xee82ee),
    wheat:                new Color(0xf5deb3),
    whitesmoke:           new Color(0xf5f5f5),
    yellowgreen:          new Color(0x9acd32),
    transparent:          new Color(0x000000, 0)
};
