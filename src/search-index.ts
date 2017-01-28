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

export const reduceToSearchIndex = (snippetMarkovTree: SnippetMarkovTree) => {
  return Object.keys(snippetMarkovTree.nodes).reduce((searchIndex, nodeKey) => {
    if (nodeKey === '__ROOT__') {
      return searchIndex;
    }
    const node = snippetMarkovTree.nodes[nodeKey]
    const parentMarkovNode = snippetMarkovTree.nodes[snippetMarkovTree.nodes[nodeKey].parentKey]
    const nodeEdge = parentMarkovNode.children.find(c => c.key === nodeKey)
    const mostProbableTokenValuesForEachPositionInSnippet = nodeEdge.orderedTokenValueOccurances
      .reduce((acc, otvo, idx) => {
        acc[idx] = otvo.reduce((prev, current) => (prev.occurance > current.occurance) ? prev : current).value
        return acc
      }, [])

    node.nGrams.forEach(nGram => {
      searchIndex[nGram] = searchIndex[nGram] || []
      if(!searchIndex[nGram].find(s => s.key === node.key)){
        searchIndex[nGram].push(createSnippet(node.key, mostProbableTokenValuesForEachPositionInSnippet))
      }
    })

    return searchIndex
  }, {})
}

function createSnippet (tokenizedSnippet, mostProbableTokenValues) {
  let key = tokenizedSnippet
  let label = tokenizedSnippet
  let filterText = tokenizedSnippet
  let documentation = tokenizedSnippet
  let insertText = tokenizedSnippet

  mostProbableTokenValues.forEach((tokenValue, idx) => {
    insertText = insertText.replace(`{{${idx}}}`, `{{${tokenValue}}}`)
  })
  insertText += `{{}}`
  
  label = insertText.replace(new RegExp('{{', 'g'), '').replace(new RegExp('}}', 'g'), '');
  filterText = insertText.replace(new RegExp('{{', 'g'), '').replace(new RegExp('}}', 'g'), '');
  documentation = tokenizedSnippet.replace(new RegExp('{{', 'g'), '');
  documentation = documentation.replace(new RegExp('}}', 'g'), '');

 
  return { key, label, filterText, documentation,  insertText }
}