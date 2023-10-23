/* eslint-disable */
/*
 * 组件配置项树结构解析器
 * 树数据 data 结构示例
 ```
 {
   input: {
     name: 'aaa',
     type: 'ttt',
     children: {
       select: {
         name: 'bbb'
         type: 'fff',
         default: 'ddd'
       },
       upload: {
         name: 'up',
         type: 'mmm',
         default: 'fadff'
       }
     }
   },
   menu: {
     name: 'mm'
     type: 'aa',
     default: 'fffff'
   }
 }
 ```
 * ideas from： [d3-hierarchy](https://github.com/d3/d3-hierarchy)
*/

function hierarchy(data, tree) {
  const root = new Node(data, tree)

  let node
  const nodes = [root]

  while ((node = nodes.pop())) {
    // 先序遍历
    let childs, child, n
    if (
      node.data.children &&
      (childs = Object.entries(node.data.children)) &&
      (n = (childs = Array.from(childs)).length)
    ) {
      // 如果有孩子节点
      node.children = childs
      for (let i = n - 1; i >= 0; --i) {
        // 遍历孩子节点
        childs[i][1].key = childs[i][0]
        nodes.push((child = childs[i] = new Node(childs[i][1], tree)))
        child.parent = node
        child.depth = node.depth + 1
      }
    }
  }

  return root
}

// 最小公共祖先
function leastCommonAncestor(a, b) {
  if (a === b) return a
  const aNodes = a.ancestors()
  const bNodes = b.ancestors()
  let c = null
  a = aNodes.pop()
  b = bNodes.pop()
  while (a === b) {
    c = a
    a = aNodes.pop()
    b = bNodes.pop()
  }
  return c
}

let id = 0
class Node {
  constructor(data, tree) {
    this.data = data || {}
    this.depth = 0
    this.parent = null
    this.id = id++
    this.tree = tree
    // 可选属性 this.children
    if (this.tree) {
      this.tree.registerNode(this)
    }
  }

  isRoot() {
    return this.parent == null && this.depth === 0
  }

  isLeaf() {
    return !this.children || !this.children.length
  }

  hasChildren() {
    return this.children && this.children.length
  }

  path(end) {
    let start = this
    const ancestors = leastCommonAncestor(start, end)
    const nodes = [start]
    while (start !== ancestors) {
      start = start.parent
      nodes.push(start)
    }
    const k = nodes.length
    while (end !== ancestors) {
      nodes.splice(k, 0, end)
      end = end.parent
    }
    return nodes
  }

  ancestors() {
    let node = this
    const nodes = [node]
    while ((node = node.parent)) {
      nodes.push(node)
    }
    return nodes
  }

  descendants() {
    return Array.from(this)
  }

  leaves() {
    const leaves = []
    this.eachBefore(function (node) {
      if (!node.children || !node.children.length) {
        leaves.push(node)
      }
    })
    return leaves
  }

  each(callback, that) {
    let index = -1
    for (const node of this) {
      callback.call(that, node, ++index, this)
    }
    return this
  }

  eachBefore(callback, that) {
    let node = this
    const nodes = [node]
    let children
    let index = -1
    while ((node = nodes.pop())) {
      callback.call(that, node, ++index, this)
      if ((children = node.children)) {
        for (let i = children.length - 1; i >= 0; --i) {
          nodes.push(children[i])
        }
      }
    }
    return this
  }

  eachAfter(callback, that) {
    let node = this
    const nodes = [node]
    const next = []
    let children
    let index = -1
    while ((node = nodes.pop())) {
      next.push(node) // 存成：根->右->左
      if ((children = node.children)) {
        for (let i = 0, n = children.length; i < n; ++i) {
          nodes.push(children[i])
        }
      }
    }

    while ((node = next.pop())) {
      // 遍历：左 -> 右 -> 根
      callback.call(that, node, ++index, this)
    }

    return this
  }

  find(callback, that) {
    let index = -1
    for (const node of this) {
      if (callback.call(that, node, ++index, this)) {
        return node
      }
    }
  }

  *[Symbol.iterator]() {
    let node = this
    let current
    let next = [node]
    let children
    do {
      ;(current = next.reverse()), (next = [])
      while ((node = current.pop())) {
        yield node
        if ((children = node.children)) {
          for (let i = 0, n = children.length; i < n; ++i) {
            next.push(children[i])
          }
        }
      }
    } while (next.length)
  }
}

class ConfigTree {
  constructor(data) {
    this.data = data
    this.nodesMap = {}
    this.valuePathMap = {}

    this.root = hierarchy(data, this)
  }

  registerNode(node) {
    this.nodesMap[node.id] = node
    return this
  }

  getNodeById(id) {
    return this.nodesMap[id]
  }

  toObject() {
    let node = this.root
    const nodes = [node]
    const root = {}
    const outputs = [root] // 输出的对象数组

    this.valuePathMap = {}

    while ((node = nodes.pop())) {
      const output = outputs.pop()
      let children, n
      if ((children = node.children) && (n = children.length)) {
        // 如果有孩子节点
        for (let i = n - 1; i >= 0; --i) {
          const child = {}
          const data = children[i].data
          const isLeaf = children[i].isLeaf()
          const hasownChildren =
            children[i].data.children && children[i].data.children.length
          if (isLeaf) {
            if (hasownChildren) {
              output[data.key] = children[i].data.children.map(child => {
                return new ConfigTree(child).toObject()
              })
            } else {
              output[data.key] = data.default
            }
          } else {
            output[data.key] = child
          }
          // output[data.key] = children[i].isLeaf() ? data.default : child; // 逆序推入，顺序pop
          this.valuePathMap[children[i].id] = this.root
            .path(children[i])
            .map(n => n.data.key)
            .slice(1)
          outputs.push(child)
          nodes.push(children[i])
        }
      }
    }

    return root
  }
}

function parseConfig(config) {
  if (!config) return
  if (typeof config === 'string') {
    try {
      config = JSON.parse(config)
    } catch (e) {
      throw e
    }
  }
  if (typeof config !== 'object') return
  const configTree = new ConfigTree({ children: config })
  return configTree.toObject()
}

module.exports = parseConfig
