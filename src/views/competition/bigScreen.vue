<template>
  <div>
    <competitors v-if="competition.competitors" />
    <battle v-if="competition.battle1v1" />
    <champion v-if="competition.champion" />
    <battle-tree v-if="competition.battleInfo" />
  </div>
</template>

<script>
var websock = null
var serverPort = '16666'
var id = 11
import competitors from './bigScreen/competitors.vue'
import battle from './bigScreen/battle.vue'
import champion from './bigScreen/champion.vue'
import battleTree from './bigScreen/battleTree.vue'
export default {
  components: { competitors, battle, champion, battleTree },
  data() {
    return {
      competition: {
        competitors: true,
        battleInfo: false,
        battle1v1: false,
        champion: false
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
      websock.onmessage = (e) => {
        ref.websocketonmessage(e)
      }
      websock.onclose = (e) => {
        ref.websocketclose(e)
      }
      websock.onopen = () => {
        ref.websocketOpen()
      }
      // 连接发生错误的回调方法
      websock.onerror = () => {
        console.log('WebSocket连接发生错误')
      }
    },
    websocketonmessage(e) {
      console.log('接受到的消息:' + e.data)
      const socketMessage = JSON.parse(e.data)
      if (socketMessage.view === 'battleInfo') {
        this.clearChampion()
        this.competition.battleInfo = true
      }
    },
    clearChampion() {
      this.competition.competitors = false
      this.competition.battleInfo = false
      this.competition.battle1v1 = false
      this.competition.champion = false
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
        setTimeout(() => {
          ref.sendSock(agentData, callback)
        }, 1000)
      } else {
        setTimeout(() => {
          ref.sendSock(agentData, callback)
        }, 1000)
      }
    }

  }
}
</script>
