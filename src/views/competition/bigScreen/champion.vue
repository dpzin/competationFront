<template>
  <div class="championPage">
    <div class="title">{{ competitionName }}</div>
    <div class="type">
      <span style="margin-right: 20px;">{{ competitionProjectName }}</span>
    </div>
    <div class="champion">CHAMPION</div>
    <div class="name">{{ championName }}</div>
    <div class="logo">本赛事系统由苏州工业园区不羁软件工作室提供</div>
  </div>
</template>

<script>
import { getCompetitionProject, getChampionByProjectId } from '@/api/competition'

export default {
  props: {
    competitionProjectId: {
      type: String,
      required: true
    },
    competitionName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      competitionProjectName: '',
      championName: ''
    }
  },
  created() {
    getCompetitionProject({ ids: [this.competitionProjectId] }).then(res => {
      this.competitionProjectName = res.data[0].name
    })
    getChampionByProjectId({ id: this.competitionProjectId }).then(res => {
      this.championName = res.data.name
    })
  }
}
</script>

<style lang="scss" scoped>
.championPage {
  width: 100%;
  height: 100%;
  background: url("../../../assets/competition/bg.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 1.7%;
  .title {
    margin: auto;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    width: 650px;
    height: 82px;
    line-height: 82px;
    color: #fff;
    background: url("../../../assets/competition/title.png") no-repeat;
    background-size: 100% 100%;
  }
  .type {
    margin-top: 60px;
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    color: #fbff97;
  }
  .champion {
    margin-top: 6%;
    color: #fbff97;
    text-align: center;
    font-weight: 900;
    font-size: 140px;
  }
  .name {
    width: 600px;
    height: 140px;
    line-height: 140px;
    background: url("../../../assets/competition/champion.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
    font-size: 60px;
    font-weight: 600;
    color: #fbff97;
    margin: 8% auto 0;
  }
  // .logo {
  //   width: 280px;
  //   height: 90px;
  //   background: url("../../../assets/logo.png") no-repeat;
  //   background-size: 100% 100%;
  //   position: fixed;
  //   bottom: 50px;
  //   right: 50%;
  //   transform: translate(50%);
  // }
  .logo {
    position: fixed;
    bottom: 5%;
    right: 50%;
    transform: translate(50%);
    color: #fff;
    font-size: 20px;
    letter-spacing: 10px;
    opacity: 0.5;
  }
}
</style>
