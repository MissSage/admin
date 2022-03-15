<template>
  <div class="confirm-dialog">
    <el-dialog
      v-model="visible"
      title="告警关联联系人"
      width="45%"
      append-to-body
      class="alarm-design"
      :close-on-click-modal="false"
      @close="connectDialog.close"
    >
      <el-tabs v-model="activePane">
        <el-tab-pane label="内部联系人" name="first">
          <div class="left-btn">
            <el-input
              v-model="filterText"
              placeholder="输入姓名搜索"
              class="filter-input"
            ></el-input>
            <el-button icon="el-icon-search" class="query-yellow" @click="clickFilterData"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh-right" class="reset-green" @click="clickReset"
              >重置</el-button
            >
          </div>
          <el-table ref="form" stripe :data="form" height="500px">
            <el-table-column label="姓名" prop="userName"></el-table-column>
            <el-table-column label="手机号" prop="phone"></el-table-column>
            <!-- <el-table-column label="告警接收方式"  prop="additionalInfo" :formatter="additionalInfoFormat">
                    <template  #default="scope">
                        <el-checkbox-group v-model="scope.row.additionalInfo">
                            <el-checkbox label="短信"></el-checkbox>
                            <el-checkbox label="邮件"></el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-table-column> -->
            <el-table-column label="短信接收告警" prop="sendSms">
              <template #default="scope">
                <el-checkbox v-model="scope.row.sendSms">短信</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="邮件接收告警" prop="sendEmail">
              <template #default="scope">
                <el-checkbox v-model="scope.row.sendEmail">邮件</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-button class="edit-primary-blue" @click="save">保存</el-button>
            <el-button plain @click="connectDialog.close">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="外部联系人" name="second">
          <div class="left-btn">
            <el-input
              v-model="filterTextOuter"
              placeholder="输入姓名搜索"
              class="filter-input"
            ></el-input>
            <el-button icon="el-icon-search" class="query-yellow" @click="clickFilterOuterData"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh-right" class="reset-green" @click="clickOuterReset"
              >重置</el-button
            >
          </div>
          <el-table ref="forms" stripe :data="formOuter" height="500px">
            <el-table-column label="姓名" prop="userName"></el-table-column>
            <el-table-column label="手机号" prop="phone"></el-table-column>
            <!-- <el-table-column label="告警接收方式"  prop="additionalInfo" :formatter="additionalInfoFormat">
                    <template  #default="scope">
                        <el-checkbox-group v-model="scope.row.additionalInfo">
                            <el-checkbox label="短信"></el-checkbox>
                            <el-checkbox label="邮件"></el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-table-column> -->
            <el-table-column label="短信接收告警" prop="sendSms">
              <template #default="scope">
                <el-checkbox v-model="scope.row.sendSms">短信</el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="邮件接收告警" prop="sendEmail">
              <template #default="scope">
                <el-checkbox v-model="scope.row.sendEmail">邮件</el-checkbox>
              </template>
            </el-table-column>
          </el-table>
          <div class="footer">
            <el-button class="edit-primary-blue" @click="saveOuter">保存</el-button>
            <el-button plain @click="connectDialog.close">取消</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import { connectAlarm, getAlarmType, getOuterConnect, connectOuter } from '@/api/alarm' // alarmConfirm,
import { removeSlash } from '@/utils/removeIdSlash' // 处理id
import useGlobal from '@/hooks/global/useGlobal'
const { $messageSuccess } = useGlobal()
// import { getTenantUsers } from '@/api/user-controller'
export default {
  name: 'ConnectDialog',
  // eslint-disable-next-line vue/require-prop-types
  props: ['connectDialog'],
  data() {
    return {
      filterText: '',
      form: [],
      filterTextOuter: '',
      activePane: 'first',
      userData: [],
      checkList: [],
      filterData: [],
      formOuter: [],
      connectData: [],
      filterDataOuter: []
    }
  },
  computed: {
    visible() {
      return this.connectDialog.visible
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const alarmJsonId = removeSlash(this.connectDialog.tableData.id.id)
      getAlarmType(alarmJsonId).then(res => {
        this.userData = res.data
        this.form = this.userData
        console.log(this.form, 'form')
      })
      getOuterConnect(alarmJsonId).then(res => {
        this.formOuter = res.data
        this.connectData = res.data
        console.log(this.formOuter, 'formoute')
      })
    },
    save() {
      const params = []
      for (const item in this.form) {
        console.log(this.form)
        const obj = {}
        obj.userId = this.form[item].userId
        obj.sendSms = this.form[item].sendSms
        obj.sendEmail = this.form[item].sendEmail
        params.push(obj)
      }
      console.log(params)
      const alarmJsonId = removeSlash(this.connectDialog.tableData.id.id)
      connectAlarm(params, alarmJsonId).then(res => {
        if (res.status === 200) {
          $messageSuccess('保存成功')
          this.connectDialog.close()
        }
      })
      this.getData()
    },
    saveOuter() {
      const params = []
      for (const item in this.formOuter) {
        const obj = {}
        obj.extraUserId = this.formOuter[item].extraUserId
        obj.sendSms = this.formOuter[item].sendSms
        obj.sendEmail = this.formOuter[item].sendEmail
        params.push(obj)
      }
      console.log(params, 'canshu ')
      const alarmJsonId = removeSlash(this.connectDialog.tableData.id.id)
      connectOuter(params, alarmJsonId).then(res => {
        if (res.status === 200) {
          $messageSuccess('保存成功')
          this.connectDialog.close()
        }
      })
      this.getData()
    },
    clickFilterData() {
      this.filterData = this.userData.filter(item => {
        return item.userName.toLowerCase().includes(this.filterText.toLowerCase())
      })
      this.form = this.filterData
    },
    clickReset() {
      this.filterText = ''
      this.filterData = this.userData
      this.form = this.filterData
    },
    clickFilterOuterData() {
      this.filterDataOuter = this.connectData.filter(item => {
        return item.userName.toLowerCase().includes(this.filterTextOuter.toLowerCase())
      })
      this.formOuter = this.filterDataOuter
    },
    clickOuterReset() {
      this.filterTextOuter = ''
      this.filterDataOuter = this.connectData
      this.formOuter = this.filterDataOuter
    }
  }
}
</script>

<style lang="scss" scoped>
.left-btn {
  width: 100%;
  height: 60px;
  .filter-input {
    width: 200px;
  }
}
.footer {
  margin-top: 10px;
}

.el-tabs {
  background: #222536;
}
.el-checkbox {
  color: rgb(255, 255, 255);
}
:deep(.el-table--striped) .el-table__body tr.el-table__row--striped td {
  background: #222536;
}
:deep(.el-tabs__item) {
  padding: 0 20px;
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  position: relative;
}
</style>
