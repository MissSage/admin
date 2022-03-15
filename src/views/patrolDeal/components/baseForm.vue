<template>
  <el-form ref="ruleForm" :rules="rules" :label-width="'150px'" :model="dataForm" class="baseForm">
    <el-form-item label="计划名称：" prop="content">
      <el-input v-model="dataForm.content" :disabled="isReadonly" placeholder="请输入"></el-input>
    </el-form-item>
    <div class="flexFromItem">
      <el-form-item label="循环周期：" class="short-item" prop="periodTime">
        <el-input
          v-model="dataForm.periodTime"
          onkeyup="value=value.replace(/[^\d]/g,'')"
          placeholder="请输入"
          :disabled="isReadonly"
          on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"
        >
          <template #suffix>
            <i style="font-style: normal; margin-right: 10px">天</i>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item label="限制时间：" class="short-item" prop="limitTime">
        <el-input
          v-model="dataForm.limitTime"
          onkeyup="value=value.replace(/[^\d]/g,'')"
          :disabled="isReadonly"
          placeholder="请输入"
          on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"
        >
          <template #suffix>
            <i style="font-style: normal; margin-right: 10px">小时</i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="启用状态：" class="short-item" prop="type">
        <el-select
          v-model="dataForm.status"
          :disabled="isReadonly"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="启用" value="1"></el-option>
          <el-option label="停用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="下次巡检时间："
        :label-width="'150px'"
        class="short-item"
        prop="executeTime"
      >
        <el-date-picker
          v-model="dataForm.executeTime"
          :disabled="isReadonly"
          style="width: 100%"
          type="datetime"
          placeholder="选择日期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        :label="dataForm.type === '2' ? '执行提示人：' : '任务人：'"
        class="long-item"
        prop="users"
      >
        <ChooseUserByRole v-if="!isReadonly" height="40px" width="100%" @checkUsers="checkUsers" />
        <div v-else class="userText">{{ dataForm.userNames || '空' }}</div>
      </el-form-item>
      <el-form-item v-if="showMap && isReadonly" label="历史轨迹" class="map-item">
        <AMap v-model="MapInitPosition" :polylines="Polylines" />
      </el-form-item>
    </div>
  </el-form>
</template>

<script lang="ts">
// const csv = require('jquery-csv')
import AMap from '@/components/SLAmap/index.vue'
import ChooseUserByRole from '@/components/chooseUserByRole/index.vue'
import { ref, watch, onBeforeMount, defineComponent, PropType } from 'vue'
import useGlobal from '@/hooks/global/useGlobal'
import { getTrack } from '@/api/patrol/index'
import { IPolyline } from '@/components/SLAmap/type'
export default defineComponent({
  components: { ChooseUserByRole, AMap },
  props: {
    isReadonly: {
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object as PropType<SubParams>,
      default: () => {
        return {
          // do sth
        }
      }
    },
    showMap: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const { $format } = useGlobal()
    const rules = ref<FormRules>({
      content: [{ required: true, message: '请输入工作内容', trigger: 'blur' }],
      executeTime: [{ required: true, message: '请选择执行时间', trigger: 'change' }],
      limitTime: [{ required: true, message: '请输入限制时间', trigger: 'blur' }],
      periodTime: [{ required: true, message: '请输入周期', trigger: 'blur' }],
      users: [{ required: false, message: '请选择任务人', trigger: 'change' }]
    })

    const dataForm = ref<any>({
      id: null,
      users: []
    })
    const Polylines = ref<IPolyline[]>([])
    const MapInitPosition = ref<string>([116.3995, 39.9092].join(','))
    const setPolylines = async () => {
      const res = await getTrack(dataForm.value.id)
      Polylines.value = formatPolylines(res.data)
      if (Polylines.value.length > 0) {
        MapInitPosition.value = (Polylines.value[0][0] || [116.3995, 39.9092]).join(',')
      }
    }
    const formatPolylines = (data: any): IPolyline[] => {
      console.log(data)
      // data = [
      //   {
      //     userId: '1111111',
      //     track: [
      //       {
      //         location: '116.3995,39.9092'
      //       },
      //       {
      //         location: '116.2937,39.9013'
      //       },
      //       {
      //         location: '116.3260,39.8644'
      //       }
      //     ]
      //   }
      // ]
      const result: IPolyline[] = []
      if (!data) return []
      data.map(item => {
        const polylineData = item.track
          ? item.track.map(obj => {
              const location = obj.location.split(',').map(a => parseFloat(a))
              return location
            })
          : []
        result.push(polylineData)
      })
      return result
    }
    const checkUsers = (users: any[]) => {
      console.log(users, 'usersusers')

      const userIds = users.map(user => user.id)
      console.log(userIds, 'userIdsuserIds')
      dataForm.value.users = userIds
    }

    watch(
      () => props.defaultValue,
      newValue => {
        dataForm.value = { ...newValue }
        dataForm.value.executeTime = $format(newValue.executeTime as string)
        props.showMap && setPolylines()
      }
    )

    onBeforeMount(() => {
      dataForm.value = { ...props.defaultValue }
      props.showMap && setPolylines()
    })

    const ruleForm = ref<any>()

    const checkRule = () => {
      ctx.emit('setBaseParams', dataForm.value)
      let validate = false
      ruleForm.value.validate(async valid => {
        validate = valid
      })
      return validate
    }

    return {
      rules,
      dataForm,
      checkUsers,
      ruleForm,
      checkRule,
      Polylines,
      MapInitPosition
    }
  }
})
</script>

<style lang="scss">
.patrolDialog {
  .el-dialog__body {
    padding: 0 !important;
  }
  .el-input__inner {
    height: 40px !important;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .el-form-item__label {
    line-height: 40px;
    font-size: 16px;
  }
}
</style>

<style lang="scss" scoped>
.flexFromItem {
  display: flex;
  justify-content: flex-start;
  align-content: center;
  flex-wrap: wrap;
  .short-item {
    flex-basis: 33.3333%;
    min-width: 300px;
  }
  .long-item {
    flex: 1;
  }
  .map-item {
    flex-basis: 100%;
  }
  .userText {
    background-color: #222536;
    border-radius: 4px;
    border: 1px solid #313544;
    padding: 0 12px;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
    color: #ffffff;
  }
}
</style>
