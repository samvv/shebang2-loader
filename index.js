
const path = require('path');

const { SourceNode, SourceMapGenerator } = require('source-map');

function isWhiteSpace(ch) {
  return /[\t\r\n ]/.test(ch);
}

function advance(pos, ch) {
  if (ch === '\n') {
    pos.line++;
    pos.column = 0;
  } else {
    pos.column++;
  }
}

function buildSourceMapLineByLine(code, startLine, source) {
  const nodes = [];
  let lineBuffer = ''
  let currLine = startLine;
  const push = () => {
    nodes.push(new SourceNode(currLine, 0, source, lineBuffer+'\n'));
  }
  for (const ch of code) {
    if (ch === '\n') {
      if (lineBuffer.length > 0) {
        push();
      }
      lineBuffer = '';
      currLine++;
    } else {
      lineBuffer += ch;
    }
  }
  if (lineBuffer.length > 0) {
    push();
  }
  return new SourceNode(null, null, source, nodes);
}

module.exports = function removeShebang(source, inputSourceMap) {

  const start = { line: 1, column: 0 };
  let i = 0;

  // First we skip characters until we are at a character that is not empty
  for (; i < source.length; i++) {
    if (!isWhiteSpace(source[i])) {
      break;
    }
    advance(start, source[i]);
  }

  // If we are at the end or no shebang is present, keep things fast by returning early
  if (i+3 >= source.length || source.substring(i, 2) !== '#!') {
    this.callback(null, source, inputSourceMap);
    return;
  }

  // Get ready for finding the line after '#!...'
  const end = { ...start };
  let j = i;

  // Skip the actual shebang line
  for (; j < source.length; j++) {
    if (source[j] === '\n') {
      end.line++;
      end.column = 0;
      j++;
      if (source[j] === '\r') {
        j++;
        end.column++;
      }
      break;
    }
    // Unnecesessary since it will be reset anyways
    //end.column++;
  }

  const result = source.substring(0, i) + source.substring(j);

  const sourcePath = path.resolve(__dirname, __filename) + '!' + this.resourcePath;

  // Weird ... source-map does not seem to support nodes with multi-line text in it, which is strange to say the least.
  const node = buildSourceMapLineByLine(result, end.line, this.resourcePath)
  node.setSourceContent(sourcePath, result)
  node.setSourceContent(this.resourcePath, source)

  const generated = node.toStringWithSourceMap({ file: sourcePath });

  // Done!
  this.callback(null, generated.code, generated.map.toJSON());
}

