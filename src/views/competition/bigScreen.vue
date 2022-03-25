<template>
  <div class="bigScreen">
    <div
      v-if="type === 'main'"
      class="main"
      :style="{'background-image': 'url('+ domain + coverUrl + ')'}"
    />
    <competitors
      v-if="type === 'competitors'"
      :competition-name="competitionName"
      :competition-project-id="competitionProjectId"
    />
    <battle
      v-if="type === 'battle1v1'"
      :battle-id="battleId"
      :competition-id="id"
    />
    <champion
      v-if="type === 'champion'"
      :competition-project-id="competitionProjectId"
      :competition-name="competitionName"
    />
    <battle-tree
      v-if="type === 'battleInfo'"
      :competition-name="competitionName"
      :competition-project-id="competitionProjectId"
    />
  </div>
</template>

<script>
var websock = null
import competitors from './bigScreen/competitors.vue'
import battle from './bigScreen/battle.vue'
import champion from './bigScreen/champion.vue'
import battleTree from './bigScreen/battleTree.vue'
import { getCompetitionDetail } from '@/api/competition'
export default {
  components: { competitors, battle, champion, battleTree },
  data() {
    return {
      type: 'main',
      id: this.$route.query.competitionId,
      domain: process.env.VUE_APP_BASE_API,
      coverUrl: '',
      competitionName: '',
      battleId: '',
      competitionProjectId: ''
    }
  },
  async created() {
    this.initWebSocket()
    if (this.$route.query.competitionId) {
      // 获取赛事大屏背景
      await getCompetitionDetail({ id: this.$route.query.competitionId }).then(res => {
        this.coverUrl = res.data.coverUrl
        this.competitionName = res.data.name
      })
    }
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
        this.competitionProjectId = socketMessage.competitionProjectId
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
  .main {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
}
</style>
