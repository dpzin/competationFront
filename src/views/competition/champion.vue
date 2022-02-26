<template>
  <div class="championPage">
    <div class="title">大赛</div>
    <div class="type">
      <span style="margin-right: 20px;">POPPING</span>
      <span>大赛</span>
    </div>
    <div class="champion">CHAMPION</div>
    <div class="name">高飞</div>
    <div class="logo" />
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.championPage {
  width: 100%;
  height: 100%;
  background: url("../../assets/competition/bg.png") no-repeat;
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
  .champion {
    margin-top: 120px;
    color: #fbff97;
    text-align: center;
    font-weight: 900;
    font-size: 140px;
  }
  .name {
    width: 450px;
    height: 137px;
    line-height: 137px;
    background: url("../../assets/competition/champion.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
    font-size: 60px;
    font-weight: 600;
    color: #fbff97;
    margin: 80px auto 0;
  }
  .logo {
    width: 280px;
    height: 90px;
    background: url("../../assets/logo.png") no-repeat;
    background-size: 100% 100%;
    position: fixed;
    bottom: 50px;
    right: 50%;
    transform: translate(50%);
  }
}
</style>
