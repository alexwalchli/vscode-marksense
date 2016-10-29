import { SnippetMarkovTree } from './snippet-markov-tree'
import { TokenizedLineOfCode } from './tokenization'

export const reduceToNGramSnippetsDictionary = (tokenizedLinesOfCode: TokenizedLineOfCode[]) : Object => {
    return tokenizedLinesOfCode.reduce((dictionary, tloc) => {
      let ngram = tloc.code.substring(0, 1)
      dictionary[ngram] = dictionary[ngram] || []
      if (dictionary[ngram].indexOf(tloc.tokenizedCode) === -1) {
        dictionary[ngram].push(tloc.tokenizedCode)
      }
      return dictionary
    }, {})
  }

export const mapToSearchIndex = (nGramSnippetsDictionary: Object, snippetMarkovTree: SnippetMarkovTree) => {
  let snippetSearchIndex = {}

  // TODO: This needs some work. Lots of loops, need orderedTokenValues. Maybe a way to store the chain so it's easier to 
  // create this

  Object.keys(nGramSnippetsDictionary).map((ngram, idx) => {
    snippetSearchIndex[ngram] = []
    nGramSnippetsDictionary[ngram].forEach(snippet => {
      let parentMarkovNode = snippetMarkovTree.nodes[snippetMarkovTree.nodes[snippet].parentKey]
      let mostProbableEdge = parentMarkovNode.children.reduce((prev, current) => (prev.count > current.count) ? prev : current)
      let snippetWithPlaceholders = snippet
      mostProbableEdge.orderedTokenValues.forEach((tokenValue, idx) => {
        snippet = snippet.replace(`{{${idx}}}`, tokenValue)
      })

      snippetSearchIndex[ngram] = snippetWithPlaceholders
    })
  })

  return nGramSnippetsDictionary
}