<template>
  <div>
    <div v-if="competition.main">主页海报</div>
    <div v-if="competition.battleInfo">晋级表</div>
    <div v-if="competition.battle1v1">1V1 Battle</div>
    <div v-if="competition.chaimpion">冠军</div>
  </div>
</template>

<script>
var websock = null
var serverPort = '16666'
var id = 11
export default {
  data() {
    return {
      competition: {
        main: true,
        battleInfo: false,
        battle1v1: false,
        chaimpion: false
      }
    }
  },
  created() {
    this.initWebSocket()
  },
  methods: {
    // 上传文件格式限制
    initWebSocket() { // 初始化weosocket
      const ref = this
      // ws地址
      var wsuri = 'ws://' + this.getWebIP() + ':' + serverPort + '/webSocket/' + id
      websock = new WebSocket(wsuri)
      websock.onmessage = function(e) {
        ref.websocketonmessage(e)
      }
      websock.onclose = function(e) {
        ref.websocketclose(e)
      }
      websock.onopen = function() {
        ref.websocketOpen()
      }
      // 连接发生错误的回调方法
      websock.onerror = function() {
        console.log('WebSocket连接发生错误')
      }
    },
    websocketonmessage(e) {
      console.log('接受到的消息:' + e.data)
      const socketMessage = JSON.parse(e.data)
      if (socketMessage.view === 'battleInfo') {
        this.clearChaimpion()
        this.competition.battleInfo = true
      }
    },
    clearChaimpion() {
      this.competition.main = false
      this.competition.battleInfo = false
      this.competition.battle1v1 = false
      this.competition.chaimpion = false
    },
    websocketsend(agentData) {
      websock.send(JSON.stringify(agentData))
    },
    websocketclose(e) {
      console.log('connection closed (' + e.code + ')')
    },
    getWebIP() {
      // todo 服务器IP
      var curIP = window.location.hostname
      return curIP
    },
    sendSock(agentData, callback) {
      const ref = this
      if (websock.readyState === websock.OPEN) {
        this.websocketsend(agentData)
      } else if (websock.readyState === websock.CONNECTING) {
        setTimeout(function() {
          ref.sendSock(agentData, callback)
        }, 1000)
      } else {
        setTimeout(function() {
          ref.sendSock(agentData, callback)
        }, 1000)
      }
    }

  }
}
</script>
