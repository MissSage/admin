<template>
  <el-tabs class="backUpTab" model-value="first" @tab-click="handleClick">
    <el-tab-pane label="数据备份" name="first">
      <div
        v-loading="loadingState"
        class="backup-container"
        element-loading-text="备份中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(232, 232, 232, 0.8)"
      >
        <div class="short-message-config config-box">
          <div class="top-title-box">
            <p class="top-title" style="background: none">
              <i class="iconfont icon-shuangjiantouyou"></i>数据备份
            </p>
            <!-- <el-button type="text" icon="el-icon-refresh" class="refresh-button" @click="refreshData">刷新</el-button> -->
          </div>
          <div class="backupHead">
            <div class="backup-form">
              <el-form label-position="right" label-width="0px">
                <el-form-item label="">
                  <el-button class="delete-orange" icon="iconfont icon-backup-hm" @click="backup">
                    手动备份</el-button
                  >
                </el-form-item>
                <el-form-item label="">
                  <div class="tips-box">
                    <div><p>自动备份：每天03:00:00进行数据备份</p></div>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="backup-img">
              <img src="./../../assets/other/backup.png" alt="" />
            </div>
          </div>
        </div>
        <div class="email-config config-box">
          <div class="top-title-box unified-theme-bg-color">
            <p class="top-title"><i class="iconfont icon-shuangjiantouyou"></i>备份记录</p>
            <!-- <el-button type="text" icon="el-icon-refresh" class="refresh-button" @click="refreshData">刷新</el-button> -->
          </div>
          <div class="email-config-form">
            <!-- <itemTable :API="API" ref="itemTable"></itemTable> -->
            <CardTable :config="tableConfig"></CardTable>
            <el-pagination
              :current-page.sync="currentVarPage"
              :page-size="size"
              layout="total, prev, pager, next"
              :total="tableData.length"
              @current-change="varCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="数据恢复" name="second">
      <div class="data-recovery-container">
        <div class="short-message-config config-box">
          <div class="top-title-box unified-theme-bg-color">
            <p class="top-title">
              <i class="iconfont icon-shuangjiantouyou"></i>PostgreSQL数据恢复
            </p>
            <!-- <el-button type="text" icon="el-icon-refresh" class="refresh-button" @click="refreshData">刷新</el-button> -->
          </div>
          <div class="post_head">
            <span class="span_title">操作步骤</span>
            <p>1.登录数据库所在服务器</p>
            <p>2.备份文件存放位置：/var/lib/backup/备份日期/数据库名称_备份日期.gz</p>
            <p>3.进入备份文件目录：cd /var/lib/backup/备份日期/</p>
            <p>4.解压要还原的数据库备份文件压缩包：gunzip 数据库名称_备份日期.gz</p>
            <p>5.运行还原命令, 命令格式: psql -U postgres --set ON_ERROR_STOP=on -f 备份文件</p>
            <p>
              示例：psql -U postgres --set ON_ERROR_STOP=on -f
              /var/lib/backup/2020-04-28/istar_cloud_2_2020-04-28
            </p>
          </div>
        </div>
        <div class="email-config config-box">
          <div class="top-title-box unified-theme-bg-color">
            <p class="top-title"><i class="iconfont icon-shuangjiantouyou"></i>influxDB数据恢复</p>
            <!-- <el-button type="text" icon="el-icon-refresh" class="refresh-button" @click="refreshData">刷新</el-button> -->
          </div>
          <div class="email-config-form">
            <span class="span_title">操作步骤</span>
            <p>1.使用SSH登录到备份文件所在服务器</p>
            <p>
              2.执行命令：influxd restore -database device -metadir /var/lib/influxdb/meta -datadir
              /var/lib/influxdb/data /var/lib/backup/influxdb/
            </p>
            <p>3.重启influxdb，命令：systemctl restart influxdb.service</p>
            <!-- <p>1.登录 OpenTSDB 所在服务器</p>
            <p>2.备份文件存放在 /root 目录下, 文件名为：opentsdb-backup.zip</p>
            <p>3.解压文件 unzip opentsdb-backup.zip</p>
            <p>4.输入命令恢复数据，命令格式如下</p>
            <p>执行命令</p>
            <p>命令格式：~/hbase根目录/bin/hbase org.apache.hadoop.hbase.mapreduce.Driver import &lt;tableName&gt; &lt;inputPath&gt;</p>
            <p>示例</p>
            <p>~/hbase根目录/bin/hbase org.apache.hadoop.hbase.mapreduce.Driver import 'tsdb' /root/hbase-backup/tsdb/part-m-00000</p>
            <p>~/hbase根目录/bin/hbase org.apache.hadoop.hbase.mapreduce.Driver import 'tsdb-meta' /root/hbase-backup/tsdb-meta/part-m-00000</p>
            <p>~/hbase根目录/bin/hbase org.apache.hadoop.hbase.mapreduce.Driver import 'tsdb-tree' /root/hbase-backup/tsdb-tree/part-m-00000</p>
            <p>~/hbase根目录/bin/hbase org.apache.hadoop.hbase.mapreduce.Driver import 'tsdb-uid' /root/hbase-backup/tsdb-uid/part-m-00000</p>
            <p>注意：inputPath中的part-m-00000为备份生成的备份文件，具体值请查看文件名称</p>
            <p>3.确认数据还原成功</p> -->
          </div>
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import CardTable from '@/components/cardTable/index.vue'
import { backup, getDataBackupList } from '@/api/dataBackup'
// import itemTable from '@/views/layout/itemTable'
import moment from 'moment'
import useGlobal from '@/hooks/global/useGlobal'
const { $message } = useGlobal()
export default {
  name: 'Backup',
  components: {
    CardTable
  },
  data() {
    return {
      value: true,
      tableData: [],
      currentVarPage: 1,
      size: 15,
      loadingState: false,
      tableConfig: {
        loading: false,
        height: '320px',
        dataList: [],
        columns: [
          { label: '备份类型', prop: 'type' },
          { label: '备份人', prop: 'creater' },
          { label: '备份开始时间', prop: 'createTime' },
          { label: '备份结束时间', prop: 'endTime' }
        ]
      }
    }
  },
  created() {
    this.getDataBackupList()
  },
  methods: {
    getDataBackupList() {
      this.tableConfig.dataList = []
      this.tableData = []
      const params = {}
      params.start = moment(new Date())
        .subtract(6, 'days')
        .hours(0)
        .minutes(0)
        .seconds(0)
        .milliseconds(0)
      params.end = moment().valueOf() + 36000000
      getDataBackupList(params).then(res => {
        res.data.forEach(element => {
          if (element.type === 'AUTO') {
            element.type = '自动备份'
          }
          if (element.type === 'NO_AUTO') {
            element.type = '手动备份'
          }

          const createTime = new Date(element.createTime)
          element.createTime = moment(createTime).format('YYYY-MM-DD HH:mm:ss')

          const endTime = new Date(element.endTime)
          element.endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss')
          this.tableData.push(element)
        })
        this.tableConfig.dataList = this.tableData.slice(0, 15)
      })
    },
    varCurrentChange(val) {
      this.currentVarPage = val
      this.tableConfig.dataList = this.tableData.slice(val * 15 - 15, [val * 15])
    },
    refreshData() {
      this.getDataBackupList()
    },
    backup() {
      this.loadingState = true
      // setTimeout(()=> {
      backup().then(res => {
        if (!res.data) {
          $message('备份失败')
        } else {
          this.loadingState = false
          $message.success(res.data.result)
          this.getDataBackupList()
        }
      })
      // },4000)
    }
  }
}
</script>

<style lang="scss" scoped>
.backUpTab {
  margin: 20px;
}
.backup-container {
  height: 100%;
  width: 100%;
  padding: 20px;
  // background: aliceblue;
  overflow-y: auto;
  .config-box {
    width: 100%;
    margin: 0 auto;
    // background: #fff;
    .top-title-box {
      height: 50px;
      display: flex;
      padding: 0 10px;
      margin-bottom: 15px;
      align-items: center;
      justify-content: space-between;
      .top-title {
        height: 50px;
        margin: 0 0;
        color: #a0a6c5;
        font-size: 18px;
        line-height: 30px;
        padding: 10px 10px;
      }
      .refresh-button {
        color: #a8f5f2;
      }
    }
    .backupHead {
      margin: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .backup-form {
        height: 100%;
        width: 45%;
      }
      .backup-img {
        height: 198px;
        width: 310px;
      }
      .tips-box {
        width: 45%;
        height: 50px;
        margin-right: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        div {
          // background:rgba(229,244,255,1);
          border-radius: 2px;
          height: 50px;
          width: 100%;
          padding: 15px 10px;
          p {
            height: 17px;
            font-weight: 400;
            color: rgba(92, 184, 83, 1);
            line-height: 17px;
            font-size: 14px;
            margin-top: 0;
          }
        }
      }
    }
  }
  .short-message-config {
    height: 290px;
    background-color: #373b4e;
    margin: 0 auto;
  }
  .email-config {
    height: 480px;
    margin: 15px auto 15px auto;
    .email-config-form {
      height: calc(100% - 120px);
      width: 100%;
    }
  }
}
.data-recovery-container {
  height: 100%;
  width: 100%;
  padding: 20px;
  // background: aliceblue;
  overflow-y: auto;
  .config-box {
    width: 100%;
    margin: 0 auto;
    // background: #fff;
    .top-title-box {
      height: 50px;
      display: flex;
      padding: 0 10px;
      align-items: center;
      justify-content: space-between;
      .top-title {
        height: 50px;
        margin: 0 0;
        color: #a0a6c5;
        font-size: 18px;
        line-height: 30px;
        padding: 10px 10px;
      }
      .refresh-button {
        color: #a8f5f2;
      }
    }
  }
  .short-message-config {
    height: 350px;
    margin: 0 auto;
    .post_head {
      height: calc(100% - 65px);
      padding: 10px 15px;
      width: 100%;
      .span_title {
        font-size: 18px;
        font-weight: 600;
        // color: rgba(51, 51, 51, 1);
        color: #fff;
        line-height: 25px;
        margin: 10px 0;
      }
      .img_postgre {
        width: 1065px;
        height: 150px;
        border: 1px solid red;
      }
    }
  }

  .email-config {
    height: 550px;
    margin: 15px auto 15px auto;
    .email-config-form {
      height: calc(100% - 65px);
      padding: 10px 15px;
      width: 100%;
      .span_title {
        font-size: 18px;
        font-weight: 600;
        // color: rgba(51, 51, 51, 1);
        color: #fff;
        line-height: 25px;
        margin: 10px 0;
      }
    }
  }

  .small_text {
    font-size: 12px;
  }
}
</style>

<style lang="scss">
.backUpTab {
  .el-tabs__nav-wrap {
    padding: 0 16px;
  }
}
</style>
