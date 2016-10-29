import { reduceToNGramSnippetsDictionary, mapToSearchIndex } from '../src/search-index'
import { SnippetMarkovTree, reduceToFlattenedMarkovTree } from '../src/snippet-markov-tree'
import { TokenizedLineOfCode } from '../src/tokenization'
const expect = require('chai').expect
const describe = require('mocha').describe
const it = require('mocha').it

describe('search index', () => {

  const tokenizedLinesOfCode = [
    new TokenizedLineOfCode('export const someFunction = (someParam) => {', 'export const {{0}} = ({{1}}) => {', ['someFunction', 'someParam'], 1),
    new TokenizedLineOfCode('export const someOtherFunction = (someParam) => {', 'export const {{0}} = ({{1}}) => {', ['someOtherFunction', 'someParam'], 1),
    new TokenizedLineOfCode('export const someOtherFunctionWithMoreParams = (someParam, anotherParam) => {', 'export const {{0}} = ({{1}}, {{2}}) => {', ['someOtherFunction', 'someParam', 'anotherParam'], 1),
    new TokenizedLineOfCode("describe('how marksense is awesome'', => {", "describe('{{0}}', => {", ['how marksense is awesome'], 1)
  ]

  describe('reduceToNGramSnippetsDictionary', () => {

    it('should reduce tokenizedLinesOfCode to a snippet dictionary', () => {
      const result = reduceToNGramSnippetsDictionary(tokenizedLinesOfCode)

      expect(result).to.deep.equal({
        'e' : [ 'export const {{0}} = ({{1}}) => {', 'export const {{0}} = ({{1}}, {{2}}) => {'  ],
        'd' : [ "describe('{{0}}', => {" ]
      })
    })

  })

  describe('mapToSearchIndex', () => {

    it('should create a search index', () => {
      const result = reduceToNGramSnippetsDictionary(tokenizedLinesOfCode)

      expect(result).to.deep.equal({
        'e' : [ 'export const {{0}} = ({{1}}) => {', 'export const {{0}} = ({{1}}, {{2}}) => {'  ],
        'd' : [ "describe('{{0}}', => {" ]
      })
    })

    it('should replace snippet tokens with highest probable value', () => {
      // TODO: Need to implement snippet token replacement
      throw new Error

      // const nGramSnippetsDictionary = reduceToNGramSnippetsDictionary(tokenizedLinesOfCode)
      // const flattenedMarkovTree = reduceToFlattenedMarkovTree(tokenizedLinesOfCode)

      // const result = mapToSearchIndex(nGramSnippetsDictionary, flattenedMarkovTree)

      // expect(result).to.deep.equal({
      //   'e' : [ 'export const {{0}} = ({{1}}) => {', 'export const {{0}} = ({{1}}, {{2}}) => {'  ],
      //   'd' : [ "describe('{{0}}', => {" ]
      // })
    })

  })

})
