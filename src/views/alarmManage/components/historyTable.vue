<template>
  <div class="history-table-dialog">
    <el-dialog
      v-if="visible"
      v-model="visible"
      :title="titleType + ' 历史记录'"
      width="50%"
      append-to-body
      class="alarm-design"
      :close-on-click-modal="false"
      @close="dialogInfo.close"
    >
      <!-- <historyList :API="API" :name="name"></historyList> -->
      <div class="history-list-table">
        <el-table
          stripe
          height="470"
          :data="historyList"
          class="h-table"
          row-class-name="h-table-style"
        >
          <el-table-column prop="name" label="告警设备" width="180"></el-table-column>
          <el-table-column prop="alarmSet" label="告警名称"></el-table-column>
          <el-table-column prop="createdTime" label="告警时间"></el-table-column>
          <el-table-column prop="removeRemark" label="处理备注"></el-table-column>
        </el-table>
        <el-pagination
          :page-size="10"
          :current-page="currentPage"
          :total="total"
          layout="total, prev, pager, next"
          class="h-page"
          background
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import historyList from '@/components/historyList'
import { getAlarmHistoryByDeviceAndAuth } from '@/api/alarm' // getAlarmHistoryByDevice,
import { removeSlash } from '@/utils/removeIdSlash'
import moment from 'moment'

export default {
  name: 'HistoryTable',
  // components: {
  //   historyList
  // },
  // eslint-disable-next-line vue/require-prop-types
  props: ['dialogInfo', 'deviceName'],
  data() {
    return {
      currentPage: 1,
      titleType: '',
      historyList: [],
      getHistory: []
    }
  },
  computed: {
    total() {
      return this.getHistory.length
    },
    visible() {
      return this.dialogInfo.visible
    }
  },
  created() {
    const info = this.dialogInfo.row
    if (info.type === 'scope') {
      this.titleType = '范围告警'
    }
    if (info.type === 'change') {
      this.titleType = '变动告警'
    }
    if (info.type === 'maintain') {
      this.titleType = '维持告警'
    }
    if (info.type === 'offline') {
      this.titleType = '掉线报警'
    }
    const time = {
      deviceId: removeSlash(info.originator.id),
      type: info.type
    }
    if (
      this.$route.path === '/eventAlarm/realTimeAlarm' ||
      this.$route.path === '/moverealTimeAlarm'
    ) {
      const secret = removeSlash(this.$store.state.user.id) + '.' + new Date().valueOf()
      time.secret = btoa(secret)
    } else {
      const getUserId = this.$route.fullPath.split('=secret')
      time.secret = getUserId[getUserId.length - 1]
    }
    console.log(this.$route.path, '---ls')
    getAlarmHistoryByDeviceAndAuth(time).then(res => {
      console.log(res.data, '历史')
      for (const item of res.data) {
        console.log(this.deviceName, 'deviceName')
        const dName = this.deviceName.get(item.originator.id)
          ? this.deviceName.get(item.originator.id)
          : '设备已删除'
        item.createdTime = moment(item.createdTime).format('YYYY-MM-DD HH:mm')
        item.name = dName
        item.removeRemark = item.details.clearRemarks
          ? item.details.clearRemarks
          : item.details.confirmRemarks
        item.alarmSet = item.alarmJsonName ? item.alarmJsonName : '掉线 - ' + dName
        this.getHistory.push(item)
      }
      this.historyList = this.getHistory.slice(0, [10])
    })
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.historyList = this.getHistory.slice(val * 10 - 10, [val * 10])
    }
  }
}
</script>

<style lang="scss"></style>
