<template>
  <div style="padding: 15px 20px 15px 5px">
    <div class="pre-text">{{ text }}</div>
    <vol-form
      ref="form"
      :label-width="80"
      :load-key="false"
      :form-fields="options.fields"
      :form-rules="options.formOptions"
    />
    <div class="tables">
      <div class="table-item" v-for="(item, index) in options.tables" :key="index">
        <div class="table-header">
          <div class="header-text">{{ item.name }}</div>
          <div class="header-btns">
            <el-button
              type="primary"
              size="mini"
              :key="bindex"
              plain
              @click="tableBtnClick(item, bindex, index)"
              :icon="btnItem.icon"
              v-for="(btnItem, bindex) in item.buttons"
            >
              {{ btnItem.name }}
            </el-button>
          </div>
        </div>
        <vol-table
          :url="item.url"
          :load-key="false"
          :index="true"
          :ref="'table' + index"
          :table-data="item.tableData"
          :columns="item.columns"
          :max-height="250"
          :pagination-hide="item.pagination"
          :column-index="true"
          :ck="true"
        />
      </div>
    </div>

    <div class="tables" style="padding-bottom: 10px">
      <el-tabs v-model="tabsModel" v-show="options.tabs.length" @tab-click="() => { }">
        <el-tab-pane
          style="padding: 0"
          class="table-item"
          v-for="(item, index) in options.tabs"
          :label="item.name"
          :name="index"
          :key="index"
        >
          <div class="table-header">
            <div class="header-text">{{ item.name }}</div>
            <div class="header-btns">
              <el-button
                type="primary"
                size="mini"
                :key="bindex"
                :icon="btnItem.icon"
                plain
                @click="tabsTableBtnClick(item, bindex, index)"
                v-for="(btnItem, bindex) in item.buttons"
              >
                {{ btnItem.name }}
              </el-button>
            </div>
          </div>
          <vol-table
            :url="item.url"
            :load-key="false"
            :index="true"
            :ref="'tabsTable' + index"
            :table-data="item.tableData"
            :columns="item.columns"
            :max-height="250"
            :pagination-hide="item.pagination"
            :column-index="true"
            :ck="true"
          />
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="form-btns">
      <el-button type="primary" @click="submit" icon="el-icon-check" size="mini">提交</el-button>
      <el-button type="primary" @click="reset" plain icon="el-icon-refresh-right" size="mini">重置</el-button>
    </div>
  </div>
</template>

<script>
import VolTable from '@/components/Table/VolTable.vue'
import VolForm from '@/components/Form/VolForm.vue'

export default {
  props: {
    options: {
      type: Object,
      default: () => {
        return { fields: {}, formOptions: [], tables: [], tabs: [] }
      }
    }
  },
  data () {
    return {
      text: '',
      tabsModel: 0
    }
  },
  created () { },
  methods: {
    tableBtnClick (item, btnIndex, index) {
      if (item.buttons[btnIndex].value === 'add') {
        this.$refs['table' + index].addRow({})
        return
      }
      if (item.buttons[btnIndex].value === 'del') {
        this.$refs['table' + index].delRow()
      }
    },
    tabsTableBtnClick (item, btnIndex, index) {
      if (item.buttons[btnIndex].value === 'add') {
        this.$refs['tabsTable' + index].addRow({})
        return
      }
      if (item.buttons[btnIndex].value === 'del') {
        this.$refs['tabsTable' + index].delRow()
      }
    },
    submit () {

    },
    reset () {
      this.$refs.form.reset()
      this.$Message.success('表单已重置')
    }
  },
  components: {
    'vol-table': VolTable,
    'vol-form': VolForm
  }
}
</script>
<style lang="scss" scoped>
.form-btns {
  text-align: center;
}
.tables {
  padding-left: 15px;
  .table-item {
    padding: 10px;
  }
  .table-header {
    display: flex;
    margin-bottom: 8px;
  }
  .header-text {
    position: relative;
    bottom: -9px;
    flex: 1;
    font-weight: bold;
  }
  .header-btns {
    text-align: right;
  }
}
</style>
