
import { SnippetMarkovTree, SnippetMarkovEdge, SnippetMarkovNode, reduceToFlattenedMarkovTree } from './snippet-markov-tree'
import { mapToSearchIndex, reduceToNGramSnippetsDictionary } from './search-index'
import { mapToTokenizedLinesOfCode } from './tokenization'

export default class Marksense {
  private snippetSearchIndex: Object = {}

  // Admittedly this could be more effecient. Could probably generate the required output in one or two passes.
  // However, it's broken up this way to make easier to inject some future features tucked away in my brain.
  public createSnippets (code) {
    // split code by newlines and tokenize symbols and strings
    const tokenizedLinesOfCode = mapToTokenizedLinesOfCode(code)

    // create a dictionary with single letter ngrams as the keys and the values as an array
    // where each item in the array is the tokenized code where its original untokenized code
    // started with the ngram
    const nGramSnippetsDict = reduceToNGramSnippetsDictionary(tokenizedLinesOfCode)

    // Reduce the tokenized lines of code to a flattened acyclic MarkovChain, a tree. 
    // With this model, given a selected snippet anywhere in the tree, we can easily predict,
    // provided it's not a leaf, what the next line of code the programmer will type and suggest that to them
    // At some point a bias could be added to the probabilities based on the current file the programmer is on. 
    // Code found in the current file would be weighed highest. Code found in sibling files would be weighed higher than code found in other folders.
    const snippetMarkovChain = reduceToFlattenedMarkovTree(tokenizedLinesOfCode)

    // Create a lookup dictionary for searching for snippets. Each snippet's token will have a prefilled value with the
    // highest probable symbol. This way, a coder can simply tab over filled in values if it's what they need.
    this.snippetSearchIndex = mapToSearchIndex(nGramSnippetsDict, snippetMarkovChain)
  }

  public search (char) {
    return this.snippetSearchIndex[char] || []
  }
}
