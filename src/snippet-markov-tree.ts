import { TokenizedLineOfCode } from './tokenization'

export class SnippetMarkovTree {
  public nodes: { [key: string]: SnippetMarkovNode; } = { };

  constructor () {
    this.nodes['__ROOT__'] = new SnippetMarkovNode('__ROOT__', undefined, null) 
  }
}

export class SnippetMarkovNode {
  public key: string
  public parentKey: string
  public children: SnippetMarkovEdge[] = []
  public nGrams = []

  constructor (key: string, parentKey: string, initialNGram: string) {
    this.key = key
    this.parentKey = parentKey
    this.nGrams.push(initialNGram)
  }
}

export class SnippetMarkovEdge {
  public key: string
  public occurance: number
  public orderedTokenValueOccurances: Array<Array<any>>

  constructor (key: string, orderedTokenValues: Array<string>) {
    this.key = key
    this.occurance = 1
    this.orderedTokenValueOccurances = orderedTokenValues.map(v =>  { return [{ value: v, occurance: 1 }] })
  }
}

export const reduceCodingPatternsToFlattenedMarkovTree = (tokenizedLinesOfCode: TokenizedLineOfCode[])
 : SnippetMarkovTree => {
  let searchIndex = {}
  return tokenizedLinesOfCode.reduce((tree, tloc, lineNumber) => {
    const parentLineOfCode = getParentLineOfCode(tokenizedLinesOfCode, lineNumber, tloc.depth)
    const parentMarkovNode = tree.nodes[parentLineOfCode.tokenizedCode]
    const markovEdgeToParent = parentMarkovNode.children.find(c => c.key === tloc.tokenizedCode)
    const nGram = tloc.code.substring(0, 1)

    if (tree.nodes[tloc.tokenizedCode]) {
      // this pattern of code has been encountered before, add its nGram
      tree.nodes[tloc.tokenizedCode].nGrams.push(nGram)
    } else {
      // this pattern of code has not been encountered before, create a node
      tree.nodes[tloc.tokenizedCode] = new SnippetMarkovNode(tloc.tokenizedCode, parentLineOfCode.tokenizedCode, nGram)
    }

    if (markovEdgeToParent) {
      // this pattern of code to this parent has been encountered before
      markovEdgeToParent.occurance++

      // track the values of snippet tokens so that we can predict and place hold what the coder would type for this pattern of code under this parent
      tloc.orderedTokenValues.forEach((otv, idx) => {
        let matchingTokenValueOccurance = markovEdgeToParent.orderedTokenValueOccurances[idx].find(otvo => otvo.value === otv)
        if (matchingTokenValueOccurance) {
          // for this pattern of code under this parent, the original token value for this position in the snippet is the same
          matchingTokenValueOccurance.occurance++
        } else {
          // for this pattern of code under this parent, the original token value for this position has not been seen
          markovEdgeToParent.orderedTokenValueOccurances[idx].push({ value: otv, occurance: 1 })
        }
      })
    } else {
      // this pattern of code to this parent has not been encountered yet, create a new edge
      parentMarkovNode.children.push(new SnippetMarkovEdge(tloc.tokenizedCode, tloc.orderedTokenValues))
    }
    
    return tree
  }, new SnippetMarkovTree())
}

function getParentLineOfCode (linesOfCode, lineNumber: number, currentDepth: number) : TokenizedLineOfCode {
  if (currentDepth === 1) {
    return new TokenizedLineOfCode('__ROOT__', '__ROOT__', null, 0)
  }

  // traverse backwards until a node is hit with less depth, it's parent
  for (let i = lineNumber - 1; i >= 0; i--) {
    if (linesOfCode[i].depth < currentDepth) {
      return linesOfCode[i]
    }
  }
}