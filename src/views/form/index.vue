
<template>
  <div class="flex-container">
    <div class="flex-item">
      <h2>Lgs's vue demo</h2>
      <p>vite | vue3 | vue-router | vuex | element-plus</p>
      <el-button><a href="src/pages/icons.html" target="_blank">图标</a></el-button>
      <el-button type="primary">primary</el-button>
      <el-button type="danger">danger</el-button>
      <el-button type="default">default</el-button>
      <el-button type="info">danger</el-button>
      <el-button type="success">danger</el-button>
      <el-button type="text">danger</el-button>
      <el-button type="warning">danger</el-button>
      <el-input v-model="state.textarea"></el-input>
      <el-select v-model="state.textarea"></el-select>
      <el-radio-group v-model="state.radios">
        <el-radio label="1">1</el-radio>
        <el-radio label="2">2</el-radio>
      </el-radio-group>
      <el-checkbox-group v-model="state.checkbox">
        <el-checkbox label="1">1</el-checkbox>
        <el-checkbox label="2">2</el-checkbox>
      </el-checkbox-group>
      <el-switch v-model="state.switch"></el-switch>
      <el-input
        v-model="state.textarea"
        :rows="2"
        type="textarea"
        placeholder="Please input"
      />
      <el-cascader
        v-model="state.cascader"
      ></el-cascader>
      <el-color-picker
        v-model="state.color"
        show-alpha
        :predefine="state.predefineColors"
      />
      <el-date-picker
        v-model="state.date"
        type="date"
      ></el-date-picker>
      <el-input-number
        v-model="state.number"
        :min="1"
        :max="10"
      />
      <el-rate v-model="state.rate" :colors="state.colors"></el-rate>
      <el-select-v2
        v-model="state.selectv2"
        :options="state.v2options"
        placeholder="Please select"
      />
      <el-slider v-model="state.slider"></el-slider>
      <el-transfer
        v-model="state.transferValue"
        style="text-align: left; display: inline-block"
        filterable
        :left-default-checked="[2, 3]"
        :right-default-checked="[1]"
        :titles="['Source', 'Target']"
        :button-texts="['To left', 'To right']"
        :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
        :data="state.transferData"
      >
        <template #default="{ option }">
          <span>{{ option.key }} - {{ option.label }}</span>
        </template>
        <template #left-footer>
          <el-button class="transfer-footer" size="small">Operation</el-button>
        </template>
        <template #right-footer>
          <el-button class="transfer-footer" size="small">Operation</el-button>
        </template>
      </el-transfer>
      <el-calendar v-model="state.calendar" />
      <el-carousel
        :interval="4000"
        type="card"
        height="200px"
      >
        <el-carousel-item v-for="item in 6" :key="item">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
      <el-empty description="description"></el-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NormalOption } from '@/common/types/common'
import { onMounted, reactive } from 'vue'
interface Option {
  key: number
  label: string
  disabled: boolean
}
const generateData = (): Option[] => {
  const data: Option[] = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `Option ${i}`,
      disabled: i % 4 === 0
    })
  }
  return data
}
const state = reactive<{
      radios:string
      checkbox:string[]
      switch:boolean
      textarea:string
      cascader:string[]
      color:string
      predefineColors:string[]
      date:string
      number:number
      rate:number
      colors:string[]
      selectv2:string
      v2options:NormalOption[]
      slider:number
      transferValue:number[]
      transferData:Option[]
      calendar:Date
    }>({
      radios: '1',
      checkbox: ['1'],
      switch: true,
      textarea: 'sadfaf',
      cascader: ['1'],
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      date: '',
      number: 1,
      rate: 1,
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      selectv2: '1',
      v2options: [],
      slider: 50,
      transferValue: [1],
      transferData: generateData(),
      calendar: new Date()

    })
const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
const initOptions = () => {
  state.v2options = Array.from({ length: 1000 }).map((_, idx) => ({
    value: `Option ${idx + 1}`,
    label: `${initials[idx % 10]}${idx}`
  }))
}

onMounted(() => {
  initOptions()
})
</script>

<style lang="scss" scoped>
.flex-container{
  height: 100%;
  display: flex;
  text-align: center;
}
.flex-item{
  margin: auto;
}
// :deep(.el-select-v2__wrapper),
// :deep(.el-calendar){
//   background-color: #25465e;
//   border-color: #456379;
//   .el-calendar__title{
//     color: #dddddd;
//   }
//   .el-calendar-table {
//     .el-calendar-day:hover,
//     td.is-selected{

//       background-color: #00374c;
//     }
//   }
// }

// .el-carousel__item h3 {
//   color: #475669;
//   font-size: 14px;
//   opacity: 0.75;
//   line-height: 200px;
//   margin: 0;
//   text-align: center;
// }

// .el-carousel__item:nth-child(2n) {
//   background-color: #99a9bf;
// }

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #d3dce6;
// }
</style>
