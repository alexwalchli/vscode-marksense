// import { reduceToNGramSnippetsDictionary, reduceToSearchIndex } from '../src/search-index'
// import { SnippetMarkovTree, reduceCodingPatternsToFlattenedMarkovTree } from '../src/snippet-markov-tree'
// import { TokenizedLineOfCode, mapToTokenizedLinesOfCode } from '../src/tokenization'
// const expect = require('chai').expect
// const describe = require('mocha').describe
// const it = require('mocha').it

// describe('search index', () => {

//   const code = `
// describe('some thing', () => {
//   it('should do something', () => {
//   })
//   it('should do something else', () => {
//   })
// })

// export const nodeCreated = (newNode) => {
//   return {
//     type: NODE_CREATED,
//     nodeId: newNode.id,
//     payload: newNode
//   };
// };

// export const nodeUpdated = (updatedNode) => {
//   return {
//     type: NODE_UPDATED,
//     nodeId: updatedNode.id,
//     payload: updatedNode
//   };
// };

// export const xplusy = (x, y) => {
//   return x + y;
// };
// `
//   const tokenizedLinesOfCode = mapToTokenizedLinesOfCode(code)
//   const snippetMarkovTree = reduceCodingPatternsToFlattenedMarkovTree(tokenizedLinesOfCode)

//   describe('reduceToSearchIndex', () => {

//     it('should create a search index', () => {
//       const result = reduceToSearchIndex(snippetMarkovTree)

//       expect(result).to.deep.equal({
//         'e' : [ 'export const {{0}} = ({{1}}) => {', 'export const {{0}} = ({{1}}, {{2}}) => {'  ],
//         'd' : [ "describe('{{0}}', => {" ]
//       })
//     })

//     it('should replace snippet tokens with highest probable value', () => {
//       // TODO: Need to implement snippet token replacement
//       throw new Error

//       // const nGramSnippetsDictionary = reduceToNGramSnippetsDictionary(tokenizedLinesOfCode)
//       // const flattenedMarkovTree = reduceToFlattenedMarkovTree(tokenizedLinesOfCode)

//       // const result = mapToSearchIndex(nGramSnippetsDictionary, flattenedMarkovTree)

//       // expect(result).to.deep.equal({
//       //   'e' : [ 'export const {{0}} = ({{1}}) => {', 'export const {{0}} = ({{1}}, {{2}}) => {'  ],
//       //   'd' : [ "describe('{{0}}', => {" ]
//       // })
//     })

//   })

//})
