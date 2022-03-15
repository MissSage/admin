<template>
  <DispatchCard>
    <template #header>
      <DispatchCardHeader title="监测点分析">
        <template #extra>
          <div class="dispatch-btn dispatch-btn-highlight">
            <span class="dispatch-btn-text">瞬时流量</span>
          </div>
          <div class="dispatch-btn">
            <span class="dispatch-btn-text">压力</span>
          </div>
        </template>
      </DispatchCardHeader>
    </template>
    <DispatchInnerCard title="监测点列表">
      <div class="inner-card">
        <div class="jcdfx-head">
          <span class="jcdfx-item__child jcdfx-item__desc">监测点</span>
          <span class="jcdfx-item__child jcdfx-item__value">监测值</span>
          <span class="jcdfx-item__child jcdfx-item__date">时间</span>
        </div>
        <VueScroll :data="tableData" :class-option="optionHover" class="warp">
          <ul class="jcdfx-list">
            <li v-for="(item, i) in tableData" :key="i" class="jcdfx-item">
              <span class="jcdfx-item__child jcdfx-item__desc">{{ item.name }}</span>
              <span class="jcdfx-item__child jcdfx-item__value">{{ item.value }}</span>
              <span class="jcdfx-item__child jcdfx-item__date">{{ item.date }}</span>
            </li>
          </ul>
        </VueScroll>
      </div>
    </DispatchInnerCard>
  </DispatchCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import DispatchCard from '../components/dispatchCard.vue'
import DispatchCardHeader from '../components/dispatchCardHeader.vue'
import DispatchInnerCard from '../components/dispatchInnerCard.vue'
import VueScroll from 'vue-seamless-scroll/src'
export default defineComponent({
  name: 'CardJcdfx',
  components: { DispatchCard, DispatchCardHeader, DispatchInnerCard, VueScroll },
  setup() {
    // codes here
    const tableData = [
      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },

      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },

      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },

      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },

      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },

      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },

      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },

      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },

      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },

      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      },
      {
        date: '16:20:28',
        name: '唯亭三区',
        value: 5.77
      },
      {
        date: '16:20:28',
        name: '星湖街/独墅湖大道',
        value: 4.88
      },
      {
        date: '16:20:28',
        name: '华兴街西/城阳湖大道北',
        value: 6.35
      }
    ]
    const optionHover = {
      step:0.2
    }
    return {
      tableData,
      optionHover
    }
  }
})
</script>

<style lang="scss" scoped>
.sl-dispatch-card {
  width: 564px;
  height: 600px;
  background: url('~@/assets/dispatchCenterImages/监测点／用水／水表背景框.png');
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: center;
}
.dispatch-btn {
  height: 24px;
  margin: 5px 5px;
  border-radius: 4px 4px 0px 0px;
  border: 1px solid #064d54;
  color: #168994;
  font-family: PingFangSC-Medium, PingFang SC;
  text-align: center;
  font-weight: 500;
  padding: 2px 5px;
  cursor: pointer;
  .dispatch-btn-text {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
  }
  &.dispatch-btn-highlight {
    background: linear-gradient(180deg, #1a6973 0%, #03494f 100%);
    .dispatch-btn-text {
      color: rgba(255, 255, 255, 1);
    }
  }
}
.sl-disptach-inner-card {
  width: 484px;
  height: 494px;
  background: url('~@/assets/dispatchCenterImages/监测点内容背景.png') no-repeat;
}
.inner-card{
  margin: 5px;
}

.jcdfx-head {
  background: #063146;
  line-height: 30px;
  width: 100%;
  span{
    display: inline-block;
  }
}
.jcdfx-list {
  margin: 10px;
  list-style: none;
  .jcdfx-item {
    
    &:nth-child(odd) {
      background: #063146;
    }
    .jcdfx-item__value {
      color: #fbe300;
    }
  }
}
.jcdfx-item__desc{
  width:60%;
  padding-left: 10px;
}
.jcdfx-item__value{
  width:20%;
}
.jcdfx-item__date{
  width:20%;
}
.warp {
  height: 424px;
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    li,
    a {
      display: block;
      height: 30px;
      line-height: 30px;
      display: flex;
      justify-content: space-between;
      font-size: 15px;
    }
  }
}
</style>
