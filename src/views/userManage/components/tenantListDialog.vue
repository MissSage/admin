<template>
  <el-dialog
    v-model="visible"
    title="企业赋予"
    width="30%"
    class="alarm-design"
    :close-on-click-modal="false"
  >
    <CardTable :config="cardTableConfig" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="clickSave">项目赋予</el-button>
        <el-button @click="tableConfig.close">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
// import { parse } from 'semver' // , saveRole
import { getAllTenantList, setTenantToUser } from '@/api/tenant'
import { removeSlash } from '@/utils/removeIdSlash'
import CardTable from '@/components/cardTable'
import useGlobal from '@/hooks/global/useGlobal'
const { $message, $confirm } = useGlobal()
export default {
  name: 'CharacterDialog',
  components: { CardTable },
  // eslint-disable-next-line vue/require-prop-types
  props: ['tableConfig'],
  data() {
    return {
      roleId: '',
      roleList: [],
      cardTableConfig: {
        // name: 'table',
        loading: false,
        dataList: [],
        selectList: [],
        tableSelectChangeHandle: val => (this.cardTableConfig.selectList = val),
        columns: [
          { prop: 'title', label: '项目' },
          { prop: 'managerUsername', label: '当前项目拥有人' }
        ]
      }
    }
  },
  computed: {
    visible() {
      return this.tableConfig.visible
    }
  },
  created() {
    this.getTenantList()
  },
  methods: {
    clickSave() {
      $confirm('确定要赋予企业吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const res = await setTenantToUser({
              toUserId: removeSlash(row.id.id),
              tenantIdList: this.cardTableConfig.selectList.map(item => item.id)
            })
            if (res.status === 200) {
              $message.success('赋予成功')
              this.tableConfig.close()
            }
          } catch (err) {
            $message.error(err.data.message)
          }
        })
        .catch(() => {
          //
        })
    },
    async getTenantList() {
      try {
        const res = await getAllTenantList(this.tableConfig.userId)
        console.log(res)
        if (res.status === 200) {
          this.cardTableConfig.dataList = res.data.tenantList
          this.initSelect(res.currentUserList)
        }
      } catch (err) {
        $message.error(err.data.message)
        this.tableConfig.close()
      }
    },
    initSelect(tenantIds) {
      this.cardTableConfig.selectList = this.cardTableConfig.dataList.filter(
        (item, index) => item.id === tenantIds[index]
      )
    }
  }
}
</script>
