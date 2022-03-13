<template>
  <div class="footer">
    <img
      class="beian-img"
      :src="getImageUrl('备案图标.png')"
      alt=""
    />
    <a class="beian-text" href="https://beian.miit.gov.cn">
      蜀ICP备20000164号
    </a>
  </div>
</template>
<script lang='ts' setup>
import { getImageUrl } from '@/utils/helper'
</script>
<style scoped lang='scss'>
.beian{
  line-height: 1em;
  font-size: 12px;
  &-img{
    height: 1em;
    width: 1em;
  }
  &-img,&-text{
    display: inline-block;
    vertical-align: middle;
    color: #929292;
  }
}
</style>
