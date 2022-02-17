import { TreeNode } from './TreeNode'

export class NumberNode extends TreeNode<number> {}
export class TreeNodeTest {
  public static createTree ():NumberNode {
    const root:NumberNode = new NumberNode(0, undefined, 'root')
    const node1:NumberNode = new NumberNode(1, root, 'node1')
    const node2:NumberNode = new NumberNode(2, root, 'node2')
    const node3:NumberNode = new NumberNode(3, root, 'node3')
    const node4:NumberNode = new NumberNode(4, node1, 'node4')
    const node5:NumberNode = new NumberNode(5, node1, 'node5')
    const node6:NumberNode = new NumberNode(6, node2, 'node6')
    const node7:NumberNode = new NumberNode(7, node2, 'node7')
    const node8:NumberNode = new NumberNode(8, node3, 'node8')
    const node9:NumberNode = new NumberNode(9, node4, 'node9')
    const node10:NumberNode = new NumberNode(10, node6, 'node10')
    const node11:NumberNode = new NumberNode(11, node7, 'node11')
    const node12:NumberNode = new NumberNode(12, node11, 'node12')
    return root
  }

  public static printNodeInfo (node:NumberNode):void {
    console.log(node.name)
  }
}
