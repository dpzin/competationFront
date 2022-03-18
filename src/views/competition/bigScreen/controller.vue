<template>
  <div class="back">
    <div class="title">大屏遥控</div>
    <div class="head_title">
      <div class="main_page">
        <div class="main_photo">
          <img
            :src="domain + detail.posterUrl"
            width="148"
            height="148"
          >
        </div>
        <div class="font">主画面</div>
      </div>
      <div class="battle_info">
        <div class="main_photo">
          <img
            :src="domain + detail.posterUrl"
            width="148"
            height="148"
          >
        </div>
        <div class="font">对阵表</div>
      </div>
    </div>

    <div class="select_section">
      <div class="left">32进16</div>
      <div class="right">POPPING</div>
      <div class="card">
        <div class="card_main">
          <div class="card_main_left">666</div>
          <div class="card_main_vs" />
          <div class="card_main_right">666</div>
        </div>
        <div class="line" />
        <div class="card_button">判决</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCompetitionDetail } from '@/api/competition'
export default {
  data() {
    return {
      competitionId: '2c9abe3f7f8c04c1017f8df0b0510000',
      domain: process.env.VUE_APP_BASE_API,
      detail: {}
    }
  },
  created() {
    this.getCompetition()
  },
  methods: {
    getCompetition() {
      getCompetitionDetail({ id: this.competitionId }).then(res => {
        this.detail = res.data
        this.detailVisible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .back {
    background-color: #18245C;
    padding-top: 53px;
    .title {
      width: 100%;
      height: 23px;
      font-size: 20px;
      font-family: Microsoft YaHei UI;
      font-weight: bold;
      color: #FFFFFF;
      opacity: 1;
      background-color: #00082C;
      text-align: center;
    }
    .head_title {
      background-color: #00082C;
      display: flex;
      justify-content: space-around;
    }
    .font {
      width: 42px;
      height: 18px;
      font-size: 14px;
      font-family: Microsoft YaHei UI;
      font-weight: 400;
      color: #FFFFFF;
      opacity: 0.5;
    }
  }
</style>
