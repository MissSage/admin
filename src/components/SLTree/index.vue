<template>
  <div class="tree-list-container">
    <div :class="{ headerBoxBorder: treeData.title }">
      <p v-if="treeData.title" class="tree-list-title custom-bottom-box-shadow">
        <i class="iconfont"></i> {{ treeData.title }}
      </p>
      <div v-if="treeData.selectFilter">
        <el-select
          v-if="treeData.selectFilter"
          v-model="queryParams[treeData.selectFilter.key]"
          :multiple="treeData.selectFilter.multiple"
          collapse-tags
          :placeholder="'请选择' + treeData.selectFilter.label"
          class="tree-filter-box"
          :style="treeData.selectFilter.style"
          style="width: 100%; margin: 0px 0 16px"
          :filterable="treeData.selectFilter.search"
          @change="treeData.selectFilter.handleChange"
        >
          <el-option
            v-for="option of treeData.selectFilter.options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
            style="box-sizing: border-box"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div v-if="treeData.switch" class="switchBox">
      <span
        v-for="item in treeData.switch.options"
        :key="item.name"
        :class="{ active: treeData.switch.curVal === item.val }"
        @click="treeData.switch && treeData.switch.handle && treeData.switch.handle(item)"
      >{{ item.name }}</span>
    </div>
    <el-input
      v-if="treeData.isFilterTree"
      v-model="filterText"
      placeholder="搜索关键字"
      class="tree-filter-box"
    >
      <!-- <el-button slot="append" @click="filterText = ''" icon='iconfont icon-8'>重置</el-button> -->
    </el-input>
    <!-- <el-button type="primary" icon="iconfont icon-cc-plus-square" class='anewProbtn'> 新建项目</el-button>
    <div class="three-btn">
      <el-button icon="iconfont icon-plus" class='addChild' size='mini'> 子项</el-button>
      <el-button icon="iconfont icon-bianji" class='editChild' size='mini'> 编辑</el-button>
      <el-button icon="iconfont icon-shanchu" class='deleteChild' size='mini'> 删除</el-button>
    </div> -->
    <el-button
      v-if="treeData.allowNew && treeData.btnPerms && treeData.btnPerms.addBtn"
      class="tree-o-btn edit-primary-blue"
      :disabled="customer_disable"
      @click="handleCreate()"
    >
      {{
        treeData.operationText ? treeData.operationText[0] || '新建项目' : '新建项目'
      }}
    </el-button>
    <div
      v-if="operationVsible && treeData.btnPerms"
      class="operation-btns"
      :class="{ 'active-operation': treeData.currentProject }"
    >
      <el-button
        v-if="treeData.btnPerms.addBtn && !treeData.btnPerms.noChild"
        :disabled="customer_disable"
        :style="{ width: treeData.nodeBtnWidth || '' }"
        class="node-o-btn query-yellow"
        @click="add(treeData.currentProject)"
      >
        {{ treeData.operationText ? treeData.operationText[1] || '子项' : '子项' }}
      </el-button>
      <el-button
        v-if="treeData.btnPerms.editBtn"
        :disabled="customer_disable"
        :style="{ width: treeData.nodeBtnWidth || '' }"
        class="node-o-btn add-child-blue"
        @click="edit(treeData.currentProject)"
      >
        编辑
      </el-button>
      <el-button
        v-if="treeData.btnPerms.delBtn"
        :disabled="customer_disable"
        :style="{ width: treeData.nodeBtnWidth || '' }"
        class="node-o-btn delete-red"
        @click="deleteHandle(treeData.currentProject)"
      >
        删除
      </el-button>

      <!-- type="success" -->
    </div>
    <p
      v-if="treeData.showAll"
      class="all-project"
      :class="{ 'active-all-project': treeData.activeAll }"
      @click="treeData.showAllProject"
    >
      <i class="iconfont icon-xiangmu1"></i> 所有项目
    </p>
    <div
      class="tree-list-box"
      :class="{
        'tree-btn-list-box': operationVsible,
        'tree-f-list-box': !operationVsible && treeData.title && treeData.isFilterTree,
        'tree-all-list': treeData.showAll
      }"
    >
      <el-scrollbar>
        <el-tree
          ref="tree"
          class="filter-tree"
          accordion
          highlight-current
          node-key="id"
          default-expand-all
          :data="treeData.data"
          :props="treeData.defaultProps"
          :filter-node-method="filterNode"
          :default-checked-keys="[1]"
          :default-expanded-keys="treeData.expandNodeId"
          @node-click="treeNodeHandleClick"
        >
          <template #default="{ node, data }">
            <div
              class="custom-tree-node"
              :class="{
                'active-tree-node':
                  treeData.currentProject && treeData.currentProject.id === data.id,
                'disabled-node': data.disabled
              }"
            >
              <p class="c-t-label">
                <i
                  class="iconfont project-icon"
                  :class="{ 'icon-xiangmu1': !node.isHost, 'icon-wangguan': node.isHost }"
                ></i>
                <span class="c-t-name">{{ node.label }}</span>
              </p>
              <span
                v-if="operationVsible && treeData.btnPerms && !treeData.btnPerms.noChild"
                class="hover-button"
              >
                <!-- <i v-if="treeData.allowAdd" class="el-icon-plus" style="color:#32D1DB" @click.stop="add(data, $parent, node)"></i>
            <i v-if="treeData.allowDelete" class="el-icon-delete" style="color:#f56c6c" @click.stop="deleteHandle(data, $parent, node)"></i>
            <i v-if="treeData.allowEdit" class="el-icon-edit-outline" style="color:#1F9FFF" @click.stop="edit(data, $parent, node)"></i> -->
                <i
                  v-if="treeData.btnPerms.addBtn"
                  class="el-icon-plus"
                  style="color: #32d1db"
                  @click.stop="add(data, $parent, node)"
                ></i>
                <i
                  v-if="treeData.btnPerms.delBtn"
                  class="el-icon-delete"
                  style="color: #f56c6c"
                  @click.stop="deleteHandle(data, $parent, node)"
                ></i>
                <i
                  v-if="treeData.btnPerms.editBtn"
                  class="el-icon-edit-outline"
                  style="color: #1f9fff"
                  @click.stop="edit(data, $parent, node)"
                ></i>
              </span>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts">
import { IElTree } from '@/common/types/element-plus'
import { SLConfirm, SLMessage } from '@/utils/global'
import { computed, nextTick, onMounted, ref, toRefs, watch } from 'vue'
import { defineComponent, PropType, reactive } from 'vue-demi'
import { useStore } from 'vuex'
import { SLTreeConfig } from './type'
export default defineComponent({
  name: 'TreeList',
  props: {
    treeData: {
      type: Object as PropType<SLTreeConfig>,
      default: () => {
        //
      }
    }
  },
  setup (props) {
    const store = useStore()
    const state = reactive<{
      filterText: string
      customer_disable: boolean
      queryParams: any
    }>({
      filterText: '',
      customer_disable: false,
      queryParams: {}
    })
    const tree = ref<IElTree>()
    const operationVsible = computed(() => {
      if (!props.treeData.btnPerms) return false
      for (const key in props.treeData.btnPerms) {
        if ((props.treeData.btnPerms as any)[key]) {
          return true && props.treeData.allowCreate
        }
      }
      return false
    })
    const initBtnPermit = () => {
      if (store.getters.roles[0] === 'CUSTOMER_USER') {
        if (props.treeData.allowNew && props.treeData.allowCreate) {
          state.customer_disable = true
        }
      } else {
        state.customer_disable = false
      }
    }
    const filterNode = (value: any, data: { [x: string]: string | any[] }) => {
      if (!value) return true
      return data[props.treeData.defaultProps.label].indexOf(value) !== -1
    }
    const handleCreate = () => {
      props.treeData.clickAddOrEdit(null, 'created')
    }
    const add = (data: any, parent?: any, node?: any) => {
      console.log(data)
      if (state.customer_disable) {
        SLMessage.info('暂无权限')
        console.log(parent, node)
      } else {
        if (data) props.treeData.clickAddOrEdit(data, 'add')
      }
    }
    const edit = (data: any, parent?: any, node?: any) => {
      if (state.customer_disable) {
        SLMessage.info('暂无权限')
        console.log(parent, node)
      } else {
        if (data) props.treeData.clickAddOrEdit(data, 'edit')
      }
    }
    const deleteHandle = (data: any, parent?: any, node?: any) => {
      if (state.customer_disable) {
        SLMessage.info('暂无权限')
        console.log(parent, node)
      } else {
        const msg = data.name ? '确定要删除' + data.name + '吗?' : '确定要删除吗?'
        SLConfirm(msg, '删除提示')
          .then(() => {
            console.log(data, '---del')
            if (data) props.treeData.projectDelete(data.id, this)
          })
          .catch(e => {
            console.log(e)
            //
          })
      }
    }
    const treeNodeHandleClick = (data: any, node?: any, e?: Event) => {
      console.log(data, node, e)

      props.treeData.treeNodeHandleClick && props.treeData.treeNodeHandleClick(data)
    }
    watch(
      () => state.filterText,
      value => {
        tree.value && tree.value.filter(value)
      }
    )
    watch(
      () => props.treeData.currentProject,
      (newVal: any) => {
        if (newVal) {
          nextTick(() => {
            tree.value && tree.value.setCurrentKey(props.treeData.currentProject.id)
          })
        }
      },
      {
        immediate: true
      }
    )
    onMounted(() => {
      initBtnPermit()
      if (props.treeData.selectFilter) {
        state.queryParams = props.treeData.selectFilter.defaultVal || {}
      }
    })
    return {
      ...toRefs(state),
      operationVsible,
      tree,
      filterNode,
      handleCreate,
      add,
      edit,
      deleteHandle,
      treeNodeHandleClick
    }
  }
})
</script>

<style lang="scss" scoped>
.tree-list-container {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .switchBox {
    // padding: 0 10px;
    margin: 20px 10px 10px;
    display: flex;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #404354;
    span {
      &.active {
        background-color: #3e8ef7;
      }
      &:hover {
        cursor: pointer;
      }
      &:last-of-type {
        border-right: none;
      }
      // border-right: 1px solid #404354;
      display: block;
      flex: 1;
      color: #fff;
      text-align: center;
      line-height: 30px;
    }
  }
  .tree-list-title {
    height: 56px;
    line-height: 56px;
    margin: -1px -1px 0 0;
    padding: 0 16px;
    //  ;
    font-size: 18px;
    color: #333;
    font-weight: 400;
    // border-bottom: 1px solid #4e5166;
  }
  .tree-filter-box {
    padding: 0 16px;
    margin-top: 20px;
    height: 48px;
    .el-input-group__append {
      background: #10bc1e;
      color: #fff;
    }
  }
  .tree-o-btn {
    // width:280px;
    width: calc(100% - 32px);
    height: 40px;
    margin: 16px 16px 0 16px;
  }
  .operation-btns {
    height: 40px;
    // width:280px;
    width: calc(100% - 32px);
    margin: 16px 16px 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .node-o-btn {
      width: 80px;
      height: 48px;
    }
  }
  .all-project {
    height: 40px;
    line-height: 40px;
    padding-left: 15px;
    width: calc(100% - 20px);
    margin: 10px 10px 0 10px;
    border-bottom: 1px solid #23729f;
    cursor: pointer;
    .icon-xiangmu1 {
      color: #25a1cf;
      margin-right: 10px;
    }
    &:hover {
      background: rgba(9, 17, 40, 0.5);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2), inset 0 0 20px 2px rgba(0, 149, 255, 0.6);
    }
  }
  .active-all-project {
    color: #02feff;
    font-weight: 600;
    background: rgba(9, 17, 40, 0.5);
    border: 1px solid #23729f;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2), inset 0 0 20px 2px rgba(0, 149, 255, 0.6);
    .icon-xiangmu1 {
      color: #526dff;
    }
  }
  .tree-list-box {
    height: calc(100% - 65px);
    margin-top: 10px;
    .filter-tree {
      height: 100%;
      overflow-y: auto;
      padding: 0 10px 5px 10px;
      // height: calc(100% - 50px);
      transition: height ease 1s;
      .el-tree-node {
        width: 100%;
        .custom-tree-node {
          width: 100%;
          .c-t-label {
            width: 180px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            .c-t-name {
              width: 90%;
            }
          }
        }
      }
    }
    .active-operation {
      height: 190px;
    }
    .custom-tree-node {
      flex: 1;
      height: 40px;
      display: flex;
      font-size: 14px;
      padding-right: 8px;
      align-items: center;
      position: relative;
      justify-content: space-between;
      &:hover {
        .hover-button {
          width: 78px;
          height: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
      }
      .c-t-label {
        margin: 0 0;
        align-items: center;
        .project-icon {
          margin-right: 5px;
          font-size: 16px;
          color: #f49f5d;
        }
        .icon-wangguan {
          color: #5d8cf4;
        }
      }
      // .active-tree-label {
      //   .project-icon {
      //     color: #526dff;
      //   }
      //   .c-t-name {
      //     color: #28adff;
      //     font-weight: 600;
      //   }
      // }
    }
    .disabled-node {
      .c-t-label {
        .project-icon {
          color: #aaaaaa;
        }
        .c-t-name {
          font-size: 16px;
          color: #aaaaaa;
        }
      }
    }
    .active-tree-node {
      .c-t-label {
        .project-icon {
          color: #526dff;
        }
        .c-t-name {
          color: #333;
        }
      }
    }
    .hover-button {
      display: none;
      position: absolute;
      // background: #f0f7ff;
      right: 0;
      z-index: 10;
      font-size: 18px;
      padding: 4px 5px;
    }
  }
  .tree-btn-list-box {
    height: calc(100% - 256px);
  }
  .tree-f-list-box {
    height: calc(100% - 150px);
  }
  .tree-all-list {
    height: calc(100% - 115px);
  }
  .color {
    color: #000000;
    color: #a72d2d;
  }
}
.headerBoxBorder {
  border-bottom: 1px solid #bebcbc;
}
</style>
