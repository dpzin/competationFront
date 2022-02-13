<template>
  <div class="battleTree">
    <div class="left">
      <div
        v-for="(item,index) in user.left.roundOne"
        :key="index"
      >{{ item.name }}</div>
    </div>
    <div class="right">
      <div
        v-for="(item,index) in user.right.roundOne"
        :key="index"
      >{{ item.name }}</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      user: {
        left: { roundOne: [{ name: '一' }, { name: '二' }, { name: '三' }, { name: '四' }, { name: '五' }, { name: '六' }, { name: '七' }, { name: '八' }, { name: '九' }, { name: '十' }, { name: '十一' }, { name: '十二' }, { name: '十三' }, { name: '十四' }, { name: '十五' }, { name: '十六' }], roundTwo: [{ name: '2-1' }, { name: '2-2' }, { name: '2-3' }, { name: '2-4' }, { name: '2-5' }, { name: '2-6' }, { name: '2-7' }, { name: '2-8' }], roundThree: [{ name: '3-1' }, { name: '3-2' }, { name: '3-3' }, { name: '3-4' }], roundFour: [{ name: '4-1' }, { name: '4-2' }], roundFive: [{ name: '5-1' }] }, right: { roundOne: [{ name: '一' }, { name: '二' }, { name: '三' }, { name: '四' }, { name: '五' }, { name: '六' }, { name: '七' }, { name: '八' }, { name: '九' }, { name: '十' }, { name: '十一' }, { name: '十二' }, { name: '十三' }, { name: '十四' }, { name: '十五' }, { name: '十六' }], roundTwo: [{ name: '2-1' }, { name: '2-2' }, { name: '2-3' }, { name: '2-4' }, { name: '2-5' }, { name: '2-6' }, { name: '2-7' }, { name: '2-8' }], roundThree: [{ name: '3-1' }, { name: '3-2' }, { name: '3-3' }, { name: '3-4' }], roundFour: [{ name: '4-1' }, { name: '4-2' }], roundFive: [{ name: '5-1' }] }, champion: '冠军'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.battleTree {
  width: 100%;
  height: 100%;
  background: url("../../assets/competition/bg.png") no-repeat;
  background-size: 100% 100%;
}
</style>
