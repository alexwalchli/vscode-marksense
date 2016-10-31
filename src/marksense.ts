
import { SnippetMarkovTree, SnippetMarkovEdge, SnippetMarkovNode, reduceCodingPatternsToFlattenedMarkovTree } from './snippet-markov-tree'
import { reduceToSearchIndex } from './search-index'
import { mapToTokenizedLinesOfCode } from './tokenization'

export default class Marksense {
  private snippetSearchIndex: Object = {}

  // Admittedly this could be much more effecient. Could probably generate the required output in one or two passes.
  // However, it's broken up this way to make easier to extend and inject some future features tucked away in my brain.
  public createSnippets (code) {

    // split code by newlines and tokenize symbols and strings
    const tokenizedLinesOfCode = mapToTokenizedLinesOfCode(code)

    // Reduce the tokenized lines of code to a flattened acyclic MarkovChain, a tree. 
    // With this model, given a selected snippet anywhere in the tree, we can easily predict,
    // provided it's not a leaf, what the next line of code the programmer will type and suggest that to them
    // At some point a bias could be added to the probabilities based on the current file the programmer is on. 
    // Code found in the current file would be weighed highest. Code found in sibling files would be weighed higher than code found in other folders.
    const snippetMarkovChain = reduceCodingPatternsToFlattenedMarkovTree(tokenizedLinesOfCode)

    // Create a lookup dictionary for searching for snippets. Each snippet's token will have a prefilled value with the
    // highest probable symbol. This way, a coder can simply tab over filled in values if it's what they need.
    this.snippetSearchIndex = reduceToSearchIndex(snippetMarkovChain)
  }

  public search (char) {
    return this.snippetSearchIndex[char] || []
  }
}
