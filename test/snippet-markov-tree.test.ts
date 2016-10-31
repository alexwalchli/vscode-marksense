// import { SnippetMarkovTree, SnippetMarkovNode, SnippetMarkovEdge, reduceToFlattenedMarkovTree } from '../src/snippet-markov-tree'
// import { TokenizedLineOfCode } from '../src/tokenization'
// const expect = require('chai').expect
// const describe = require('mocha').describe
// const it = require('mocha').it

// describe('snippet markov tree', () => {

//   describe('SnippetMarkovTree', () => {

//     it('should construct properly', () => {
//       const result = new SnippetMarkovTree()

//       expect(Object.keys(result.nodes).length).to.equal(1)
//       expect(result.nodes['__ROOT__']).to.deep.equal(new SnippetMarkovNode('__ROOT__', undefined))
//     })

//   })

//   describe('SnippetMarkovNode', () => {

//     it('should construct properly', () => {
//       const key = 'return `{{0}}`'
//       const parentKey = 'export const {{0}} = ({{1}}) => {'

//       const result = new SnippetMarkovNode(key, parentKey)

//       expect(result.key).to.equal(key)
//       expect(result.parentKey).to.equal(parentKey)
//       expect(result.children).to.deep.equal([]) 
//     })

//   })

//   describe('SnippetMarkovEdge', () => {

//     it('should construct properly', () => {
//       const key = 'export const {{0}} = ({{1}}) => {'
//       const orderedTokenValues = ['someFunction', 'someParam']

//       const result = new SnippetMarkovEdge(key, orderedTokenValues)

//       expect(result.key).to.equal(key)
//       expect(result.orderedTokenValues).to.equal(orderedTokenValues)
//       expect(result.count).to.equal(1)
//     })

//   })

//   describe('reduceToFlattenedMarkovTree', () => {

//     const tokenizedLinesOfCode = [
//       new TokenizedLineOfCode('export const someFunction = (someParam) => {', 'export const {{0}} = ({{1}}) => {', ['someFunction', 'someParam'], 1),
//       new TokenizedLineOfCode('export const someOtherFunction = (someParam) => {', 'export const {{0}} = ({{1}}) => {', ['someOtherFunction', 'someParam'], 1),
//       new TokenizedLineOfCode("describe('how marksense is awesome'', => {", "describe('{{0}}', => {", ['how marksense is awesome'], 1)
//     ]

//     it('should aggregate lines of code with similar form (same tokenized value but potentially different original code)', () => {
//       const result = reduceToFlattenedMarkovTree(tokenizedLinesOfCode)

//       expect(Object.keys(result.nodes).length).to.equal(3)
//       expect(result.nodes['__ROOT__']).to.not.be.null
//       expect(result.nodes['export const {{0}} = ({{1}}) => {']).to.not.be.null
//       expect(result.nodes["describe('{{0}}', => {"]).to.not.be.null
//     })

//     it('should correctly create edges and count occurences', () => {
//       const result = reduceToFlattenedMarkovTree(tokenizedLinesOfCode)

//       expect(result.nodes['__ROOT__'].children.length).to.equal(2)
//       const exportConstSnippetMarkovEdge = new SnippetMarkovEdge('export const {{0}} = ({{1}}) => {', ['someFunction', 'someParam']);
//       exportConstSnippetMarkovEdge.count = 2
//       expect(result.nodes['__ROOT__'].children[0]).to.deep.equal(exportConstSnippetMarkovEdge)
//       expect(result.nodes['__ROOT__'].children[1]).to.deep.equal(new SnippetMarkovEdge("describe('{{0}}', => {", ['how marksense is awesome']))
//     })

//     it('should count occurences of token values from orderedTokenValues', () => {
//       // TODO: Need to implement token value occurences
//       throw new Error
//     })

//   })

// })
