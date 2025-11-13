export class Trie {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }

  insert(word) {
    let node = this;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, new Trie());
      }
      node = node.children.get(char);
    }
    node.isEnd = true;
  }

  contains(word) {
    let node = this;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) return false;
      node = node.children.get(char);
    }
    return node.isEnd;
  }
}
