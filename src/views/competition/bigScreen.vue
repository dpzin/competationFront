<template>
  <div class="bigScreen">
    <competitors v-if="type === 'competitors'" />
    <battle
      v-if="type === 'battle1v1'"
      :battle-id="battleId"
    />
    <champion v-if="type === 'champion'" />
    <battle-tree v-if="type === 'battleInfo'" />
  </div>
</template>

<script>
var websock = null
import competitors from './bigScreen/competitors.vue'
import battle from './bigScreen/battle.vue'
import champion from './bigScreen/champion.vue'
import battleTree from './bigScreen/battleTree.vue'
export default {
  components: { competitors, battle, champion, battleTree },
  data() {
    return {
      type: '',
      id: this.$route.query.competitionId,
      battleId: ''
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
      var wsuri = 'ws://' + process.env.VUE_APP_WS_API + ':16666' + '/webSocket/' + this.id
      websock = new WebSocket(wsuri)
      websock.onmessage = (e) => {
        ref.websocketonmessage(e)
      }
      websock.onclose = (e) => {
        ref.websocketclose(e)
      }
      websock.onopen = () => {
        // ref.websocketOpen()
      }
      // 连接发生错误的回调方法
      websock.onerror = () => {
        console.log('WebSocket连接发生错误')
      }
    },
    websocketonmessage(e) {
      console.log('接受到的消息:' + e.data)
      const socketMessage = JSON.parse(e.data)

      if (socketMessage) {
        this.type = socketMessage.type
        this.battleId = socketMessage.battleId
      }
    },
    websocketsend(agentData) {
      websock.send(JSON.stringify(agentData))
    },
    websocketclose(e) {
      console.log('connection closed (' + e.code + ')')
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

<style lang="scss">
.bigScreen {
  width: 100%;
  height: 100%;
}
</style>
