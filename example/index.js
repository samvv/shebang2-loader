
import sourceMapSupport from "source-map-support";

sourceMapSupport.install({ handleUncaughtExceptions: false });

const error = new Error(`This is just an error to see if source maps are working.`);

const frames = error.stack.substring(`Error: ${error.message}\n`.length).split('\n');

const frame = parseStackFrame(frames[0]);

assert(frame.line, 6);
assert(frame.column, 0);

function parseStackFrame(text) {

  let i = 0;

  let expression = null;
  let filenames = [];
  let line;
  let column;

  skipWhiteSpace();
  skip(`at `);

  if (lookaheadHasChar('(')) {

    expression = parseUntilDelim().trim();

    skip('(');
    const chunks = parseUntilDelim().split(':');
    filenames = chunks.slice(0, -2);
    line = Number(chunks[chunks.length-2]);
    column = Number(chunks[chunks.length-1]);
    skip(')');

  } else {

    const chunks = parseUntilDelim().split(':');
    filenames = chunks.slice(0, -2);
    line = Number(chunks[chunks.length-2]);
    column = Number(chunks[chunks.length-1]);

  }

  return {
    expression,
    filenames,
    line,
    column,
  };

  function parseUntilDelim() {
    let result = ''
    while (i < text.length && !/[\(\)\{\}]/.test(text[i])) {
      result += text[i++];
    }
    return result;
  }

  function skipWhiteSpace() {
    for (; i < text.length; i++) {
      if (!isWhiteSpace(text[i])) {
        break;
      }
    }
  }

  function lookaheadHasChar(ch) {
    for (let j = i; j < text.length; j++) {
      if (text[j] === ch) {
        return true;
      }
    }
    return false;
  }

  function isWhiteSpace(ch) {
    return /[\n\r\t ]/.test(ch);
  }

  function skip(text) {
    for (const ch of text) {
      assertChar(ch);
      i++;
    }
  }

  function assertChar(ch) {
    if (text[i] !== ch) {
      throw new Error(`Found character '${text[i]}' but expected '${ch}'`);
    }
  }

}

function assert(test) {
  if (!test) {
    throw new Error(`Assertion failed.`);
  }
}

