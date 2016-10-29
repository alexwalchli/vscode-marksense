const acorn = require('acorn')

export class TokenizedLineOfCode {
  depth: number
  code: string
  tokenizedCode: string
  orderedTokenValues: Array<string>

  constructor (code: string, tokenizedCode: string, orderedTokenValues: Array<string>, depth: number) {
    this.code = code
    this.tokenizedCode = tokenizedCode
    this.orderedTokenValues = orderedTokenValues
    this.depth = depth
  }
}

export const mapToTokenizedLinesOfCode = (code: string) : TokenizedLineOfCode[] => {
  if (!code) {
    return []
  }

  return unescapeHtml(code)
          .split('\n')
          .filter(loc => !isWhitespaceOrEmptyOrClosing(loc))
          .map(loc => {
            let tokenization = tokenizeLineOfCode(loc.trim())
            return new TokenizedLineOfCode(loc.trim(), tokenization.tokenizedCode, tokenization.tokenValues, depth(loc))
          })
}

function tokenizeLineOfCode (code: string): any {
  const tokens = [...acorn.tokenizer(code)]
  let tokenizedCode = code
  let tokenValues = []
  let tokenOffset = 0
  tokens.forEach((token, idx) => {
    if (token.type.label === 'name' || token.type.label === 'string') {
      tokenValues.push(token.value)
      let replaceToken = `{{${tokenValues.length - 1}}}`
      tokenizedCode = tokenizedCode.slice(0, token.start + tokenOffset) + replaceToken + tokenizedCode.slice(token.end + tokenOffset, tokenizedCode.length)
      tokenOffset = tokenizedCode.length - code.length
    }
  })

  return { tokenizedCode, tokenValues }
}

function unescapeHtml (str: string) : string {
  return str.replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
}

function isWhitespaceOrEmptyOrClosing (lineOfCode: string): Boolean {
  return lineOfCode === null || lineOfCode.match(/^ *$/) !== null || lineOfCode.trim() === '}'
}

function depth (code: string) {
  return code.split('  ').length
}