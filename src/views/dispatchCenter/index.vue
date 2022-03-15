<template>
  <div class="dispatch-container">
    <div id="dispatchBox" class="dispatch-wrapper">
      <div class="dispatch-wrapper__header">
        <CardHeader />
      </div>
      <div class="dispatch-wrapper__main">
        <div class="dispatch-wrapper__item dispatch-left">
          <CardShuizhiJianCe class="dispatch-wrapper__item-top" />
          <CardJcdfx class="dispatch-wrapper__item-bottom" />
        </div>
        <div class="dispatch-wrapper__item dispatch-center__left">
          <CardGwtj class="dispatch-wrapper__item-top" />
          <div class="dispatch-wrapper__item-bottom">
            <CardYsfx />
            <CardSbxx />
          </div>
        </div>
        <div class="dispatch-wrapper__item dispatch-center">
          <CenterHead />
          <CenterMap />
        </div>
        <div class="dispatch-wrapper__item dispatch-center__right">
          <CardSbtj />
        </div>
        <div class="dispatch-wrapper__item dispatch-right">
          <CardCxxfx class="dispatch-wrapper__item-top" />
          <div class="dispatch-wrapper__item-bottom">
            <CardQylsfx />
            <CardBjfx />
            <CardLxphb class="dispatch-wrapper__item-bottom__bottom" />
            <CardOrder class="dispatch-wrapper__item-bottom__bottom" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CardHeader from './cardHeader.vue'
import CardShuizhiJianCe from './cardSzjc/index.vue'
import CardJcdfx from './cardJcdfx/index.vue'
import CardGwtj from './cardGwtj/index.vue'
import CardYsfx from './cardYsfx/index.vue'
import CardSbxx from './cardSbxx/index.vue'
import CenterHead from './cardCenter/centerHead.vue'
import CenterMap from './cardCenter/centerMap.vue'
import CardSbtj from './cardSbtj/index.vue'
import CardCxxfx from './cardCxxfx/index.vue'
import CardQylsfx from './cardQylsfx.vue'
import CardBjfx from './cardBjfx/index.vue'
import CardLxphb from './cardLsphb.vue'
import CardOrder from './cardOrder/index.vue'
export default defineComponent({
  name: 'DispatchCenter',
  components: {
    CardHeader,
    CardShuizhiJianCe,
    CardJcdfx,
    CardGwtj,
    CardYsfx,
    CardSbxx,
    CenterHead,
    CenterMap,
    CardSbtj,
    CardCxxfx,
    CardQylsfx,
    CardBjfx,
    CardLxphb,
    CardOrder
  },
  setup() {
    //
    
  }
})
</script>

<style lang="scss" scoped>
.dispatch-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #0e0e0e;
  .dispatch-wrapper {
    width: 4510px;
    height: 1232px;
    .dispatch-wrapper__header {
      height: 80px;
    }
    .dispatch-wrapper__main {
      padding: 0 8px;
      display: flex;
      .dispatch-wrapper__item {
        margin: 0 8px 16px 8px;
        .dispatch-wrapper__item-top {
          margin: 0;
        }
        .dispatch-wrapper__item-bottom {
          margin: 16px 0 0 0;

          .dispatch-wrapper__item-bottom__bottom {
            margin-top: 16px;
          }
        }
      }
      .dispatch-left {
        width: 564px;
      }
      .dispatch-center {
        width: 1013px;
      }
      .dispatch-center__right {
        width: 564px;
      }
      .dispatch-center__left,
      .dispatch-right {
        width: 1141px;
        .dispatch-wrapper__item-bottom {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          align-content: space-between;
          .dispatch-wrapper__item-bottom__bottom {
            margin-top: 16px;
          }
        }
      }
    }
  }
}
</style>
