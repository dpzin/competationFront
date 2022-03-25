<template>
  <div class="battlePage">
    <div class="title">{{ competition.name }}</div>
    <div class="type">
      <span style="margin-right: 20px;">{{ battleInfo.projectName }}</span>
      <span>{{ battleInfo.taskName }}</span>
    </div>
    <div class="main"><img :src="competition.battleIconUrl"></div>
    <div class="battle">
      <div class="name">{{ battleInfo.leftMember.name }}</div>
      <div class="vs" />
      <div class="name">{{ battleInfo.rightMember.name }}</div>
    </div>
    <div class="logo">本赛事系统由不羁超级赛事提供</div>
  </div>
</template>

<script>
import { getBattleInfo, getCompetitionDetail } from '@/api/competition'
export default {
  props: {
    battleId: {
      type: String,
      required: true
    },
    competitionId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      competition: {},
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
    },
    async getCompetition() {
      if (this.competitionId) {
        // 获取赛事大屏背景
        await getCompetitionDetail({ id: this.competitionId }).then(res => {
          this.competition = res.data
        })
      }
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
  padding-top: 1.7%;
  .title {
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    width: 650px;
    height: 82px;
    line-height: 82px;
    margin: auto;
    color: #fff;
    background: url("../../../assets/competition/title.png") no-repeat;
    background-size: 100% 100%;
  }
  .type {
    margin-top: 80px;
    text-align: center;
    font-size: 24px;
    font-weight: bold;
    color: #fbff97;
  }
  .main {
    margin: 40px auto;
  }
  .battle {
    display: flex;
    justify-content: center;
    .vs {
      width: 104px;
      height: 93px;
      background: url("../../../assets/competition/1v1-VS.png") no-repeat;
      background-size: 100% 100%;
      margin: 0 227px;
    }
    .name {
      width: 300px;
      height: 100px;
      background: url("../../../assets/competition/user.svg") no-repeat;
      background-size: 100% 100%;
      line-height: 100px;
      text-align: center;
      font-size: 27px;
      font-weight: 600;
      color: #ffffff;
    }
  }
  .logo {
    position: fixed;
    bottom: 50px;
    right: 50%;
    transform: translate(50%);
    color: #fff;
    font-size: 20px;
    letter-spacing: 20px;
    opacity: 0.5;
  }
}
</style>
