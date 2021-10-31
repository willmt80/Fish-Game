"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const JSONStream = __importStar(require("JSONStream"));
/**
 * Writes to output array from stream to jsonArray and is given instructions for when the stream closes
 * @param stream stream receives input and can be written output
 * @param jsonArray is an array of json
 * @param onClose what function to run when the stream closes
 */
function parseJSON(stream, jsonArray, onClose) {
    var parser = JSONStream.parse(null);
    parser.on('data', function (json) {
        jsonArray.push(json);
    });
    stream.pipe(parser);
    stream.on('close', () => {
        onClose();
    });
    return jsonArray;
}
exports.parseJSON = parseJSON;
