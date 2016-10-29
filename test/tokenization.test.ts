import { TokenizedLineOfCode, mapToTokenizedLinesOfCode } from '../src/tokenization'
const expect = require('chai').expect
const describe = require('mocha').describe
const it = require('mocha').it

describe('tokenization', () => {

  describe('TokenizedLineOfCode', () => {

    it('should construct properly', () => {
      const code = 'export const someFunction(() => {'
      const tokenizedCode = 'export const {{0}}(() => {'
      const orderedTokenValues = ['someFunction']
      const depth = 0

      const newTokenizedLineOfCode = new TokenizedLineOfCode(code, tokenizedCode, orderedTokenValues, depth)

      expect(newTokenizedLineOfCode.code).to.equal(code)
      expect(newTokenizedLineOfCode.tokenizedCode).to.equal(tokenizedCode)
      expect(newTokenizedLineOfCode.orderedTokenValues).to.equal(orderedTokenValues)
      expect(newTokenizedLineOfCode.depth).to.equal(depth)  
    })

  })

  describe('mapToTokenizedLinesOfCode', () => {

    it('should filter out empty lines and closing lines', () => {
      const code = `
export const someFunction = (param) => {

}`

      const result = mapToTokenizedLinesOfCode(code)

      expect(result.length).to.equal(1)
    })

    it('should split lines by newlines', () => {
      const code = `
export const someFunction = (param) => {

}

export const someOtherFunction = (param) => {

}`

      const result = mapToTokenizedLinesOfCode(code)

      expect(result.length).to.equal(2)
    })

    it('should tokenize code and store the token values', () => {
            const code = `
export const someFunction = (param) => {

}`

      const result = mapToTokenizedLinesOfCode(code)

      expect(result[0].tokenizedCode).to.equal('export const {{0}} = ({{1}}) => {')
    })

    it('should calculate code depth(indentation) and store it', () => {
      const code = `
export const someFunction = (param) => {
  return awesomeness
}`

      const result = mapToTokenizedLinesOfCode(code)

      expect(result[0].depth).to.equal(1)
      expect(result[1].depth).to.equal(2)
    })

  })

})
