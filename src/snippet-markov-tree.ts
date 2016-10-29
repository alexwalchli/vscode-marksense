import { TokenizedLineOfCode } from './tokenization'

export class SnippetMarkovTree {
  public nodes: { [key: string]: SnippetMarkovNode; } = { };

  constructor () {
    this.nodes['__ROOT__'] = new SnippetMarkovNode('__ROOT__', undefined) 
  }
}

export class SnippetMarkovNode {
  public key: string
  public parentKey: string
  public children: SnippetMarkovEdge[] = []

  constructor (key: string, parentKey: string) {
    this.key = key
    this.parentKey = parentKey
  }
}

export class SnippetMarkovEdge {
  public key: string
  public count: number
  public orderedTokenValues: Array<string>

  constructor (key: string, orderedTokenValues: Array<string>) {
    this.key = key
    this.count = 1
    this.orderedTokenValues = orderedTokenValues
  }
}

export const reduceToFlattenedMarkovTree = (tokenizedLinesOfCode: TokenizedLineOfCode[])
 : SnippetMarkovTree => {
  return tokenizedLinesOfCode.reduce((tree, tloc, lineNumber) => {
    const parentLineOfCode = getParentLineOfCode(tokenizedLinesOfCode, lineNumber, tloc.depth)
    const parentMarkovNode = tree.nodes[parentLineOfCode.tokenizedCode]
    const markovEdgeToParent = parentMarkovNode.children.find(c => c.key === tloc.tokenizedCode)

    if (markovEdgeToParent) {
      markovEdgeToParent.count++
    } else {
      parentMarkovNode.children.push(new SnippetMarkovEdge(tloc.tokenizedCode, tloc.orderedTokenValues))
    }

    if (!tree.nodes[tloc.tokenizedCode]) {
      tree.nodes[tloc.tokenizedCode] = new SnippetMarkovNode(tloc.tokenizedCode, parentLineOfCode.tokenizedCode)
    }

    return tree
  }, new SnippetMarkovTree())
}

function getParentLineOfCode (linesOfCode, lineNumber: number, currentDepth: number): TokenizedLineOfCode {
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