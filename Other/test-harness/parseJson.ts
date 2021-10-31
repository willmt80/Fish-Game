import * as JSONStream from 'JSONStream';
import { Duplex } from 'stream';

/**
 * Writes to output array from stream to jsonArray and is given instructions for when the stream closes
 * @param stream stream receives input and can be written output
 * @param jsonArray is an array of json
 * @param onClose what function to run when the stream closes
 */
export function parseJSON(
  stream: Duplex,
  jsonArray: Object[],
  onClose: () => void
): Object[] {
  var parser = JSONStream.parse(null);
  parser.on('data', function (json: Object) {
    jsonArray.push(json);
  });
  stream.pipe(parser);
  stream.on('close', () => {
    onClose();
  });

  return jsonArray;
}
