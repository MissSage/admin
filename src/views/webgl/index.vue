<template>
  <p>webgl</p>
</template>
<script setup lang='ts'>
import { IEnumerator, NodeEnumeratorFactory } from './utils/Enumerator'
import { NumberNode, TreeNodeTest } from './utils/Test'
import { TreeNode } from './utils/TreeNode'
const root:NumberNode = TreeNodeTest.createTree()

let current:TreeNode<number>|undefined
const curr:TreeNode<number>|undefined = undefined
const iter:IEnumerator<TreeNode<number>> = NodeEnumeratorFactory.createDfL2rT2bIter<number>(root)
while (iter.moveNext()) {
  current = iter.current
  if (current !== undefined) {
    console.log(current.repeatString(' ', current.depth * 4) + current.name)
  }
}
root.visit(TreeNodeTest.printNodeInfo, null)
TreeNodeTest.printNodeInfo(root)
</script>
<style scoped lang='scss'>
</style>
