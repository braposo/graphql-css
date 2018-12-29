function isFalsish(chunk) {
    return chunk === undefined || chunk === null || chunk === false || chunk === "";
}

export function isPlainObject(x) {
    return typeof x === "object" && x.constructor === Object;
}

export function isFunction(test) {
    return typeof test === "function";
}

export function buildQuery(chunk, props) {
    if (Array.isArray(chunk)) {
        const ruleSet = [];

        for (let i = 0, len = chunk.length, result; i < len; i += 1) {
            result = buildQuery(chunk[i], props);

            if (result === null) continue;
            else if (Array.isArray(result)) ruleSet.push(...result);
            else ruleSet.push(result);
        }

        return ruleSet;
    }

    if (isFalsish(chunk)) {
        return null;
    }

    if (isFunction(chunk)) {
        return chunk(props);
    }

    return chunk.toString();
}

export function isGqlQuery(query) {
    return typeof query === "object" && query.constructor === Object && query.kind === "Document";
}

export function interleave(strings, interpolations = []) {
    const result = [strings[0]];

    for (let i = 0, len = interpolations.length; i < len; i += 1) {
        result.push(interpolations[i], strings[i + 1]);
    }

    return result;
}

export function smoosh(object) {
    return Object.assign(
        {},
        ...(function _flatten(objectBit) {
            return [].concat(
                ...Object.keys(objectBit).map(key =>
                    typeof objectBit[key] === "object"
                        ? _flatten(objectBit[key])
                        : { [key]: objectBit[key] }
                )
            );
        })(object)
    );
}

export const domElements = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "big",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "marquee",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rp",
    "rt",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",

    // SVG
    "circle",
    "clipPath",
    "defs",
    "ellipse",
    "foreignObject",
    "g",
    "image",
    "line",
    "linearGradient",
    "mask",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "stop",
    "svg",
    "text",
    "tspan",
];
