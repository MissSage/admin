<template>
  <div class="info-table-dialog">
    <el-dialog
      v-if="visible"
      v-model="visible"
      title="告警详情"
      width="50%"
      append-to-body
      class="alarm-design"
      :close-on-click-modal="false"
      @close="dialogInfo.close"
    >
      <el-table height="470" :data="showList">
        <el-table-column prop="time" label="触发时间" width="180"></el-table-column>
        <el-table-column prop="status" label="触发状态"></el-table-column>
        <el-table-column prop="infoValue" label="告警详细信息"></el-table-column>
      </el-table>
      <el-pagination
        :page-size="10"
        :current-page="currentPage"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'InfoTable',
  // eslint-disable-next-line vue/require-prop-types
  props: ['dialogInfo'],
  data() {
    return {
      currentPage: 1,
      showList: [],
      recordList: []
    }
  },
  computed: {
    total() {
      return this.recordList.length
    },
    visible() {
      return this.dialogInfo.visible
    }
  },
  created() {
    if (this.dialogInfo.isStatistics) {
      this.showList = this.dialogInfo.row.recordList.slice(0, [9])
      this.recordList = this.dialogInfo.row.recordList
    } else {
      this.showList = this.dialogInfo.row.info.slice(0, [9])
      this.recordList = this.dialogInfo.row.info
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.showList = this.recordList.slice(val * 10 - 10, [val * 10])
      // this.showList = this.API.rowOperations[this.name].row.info.slice(val * 10 - 10, [val * 10])
    }
  }
}
</script>

<style lang="scss"></style>
