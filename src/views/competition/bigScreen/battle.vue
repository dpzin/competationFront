<template>
  <div class="battlePage">
    <div class="title">大赛</div>
    <div class="type">
      <span style="margin-right: 20px;">{{ battleInfo.projectName }}</span>
      <span>{{ battleInfo.taskName }}</span>
    </div>
    <div class="main" />
    <div class="battle">
      <div class="name">{{ battleInfo.leftMember.name }}</div>
      <div class="vs">VS</div>
      <div class="name">{{ battleInfo.rightMember.name }}</div>
    </div>
    <div class="logo" />
  </div>
</template>

<script>
import { getBattleInfo } from '@/api/competition'

export default {
  props: {
    battleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      battleInfo: {
        leftMember: {},
        rightMember: {},
        taskName: '',
        projectName: ''
      }
    }
  },
  watch: {
    battleId() {
      this.getBattle()
    }
  },
  created() {
    this.getBattle()
  },
  methods: {
    getBattle() {
      getBattleInfo({ id: this.battleId }).then(res => {
        this.battleInfo = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.battlePage {
  width: 100%;
  height: 100%;
  background: url("../../../assets/competition/bg.png") no-repeat;
  background-size: 100% 100%;
  .title {
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    padding-top: 2.5%;
    height: 90px;
    color: #fff;
  }
  .type {
    margin-top: 80px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #fbff97;
  }
  .main {
    width: 380px;
    height: 380px;
    margin: 40px auto;
    background: url("../../../assets/SUPBOOGIE-logo-07.png") no-repeat;
    background-size: 100% 100%;
  }
  .battle {
    display: flex;
    justify-content: center;
    .vs {
      height: 61px;
      line-height: 61px;
      margin-left: 220px;
      margin-right: 220px;
      font-size: 27px;
      font-weight: 600;
      color: #fbff97;
    }
    .name {
      width: 200px;
      height: 61px;
      background: url("../../../assets/competition/user.svg") no-repeat;
      background-size: 100% 100%;
      line-height: 61px;
      text-align: center;
      font-size: 27px;
      font-weight: 600;
      color: #ffffff;
    }
  }
  .logo {
    width: 280px;
    height: 90px;
    background: url("../../../assets/logo.png") no-repeat;
    background-size: 100% 100%;
    position: fixed;
    bottom: 50px;
    right: 50%;
    transform: translate(50%);
  }
}
</style>
