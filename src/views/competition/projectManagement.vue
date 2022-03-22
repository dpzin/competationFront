<template>
  <div class="projectManage">
    <el-menu
      :default-active="active"
      class="el-menu-vertical-demo"
      :collapse="false"
      @select="handleSelect"
    >
      <div
        v-for="(item,index) in projects"
        :key="index"
      >
        <el-submenu :index="index.toString()">
          <template slot="title">{{ item.name }}</template>
          <el-menu-item
            :index="index + '-1'"
            @click="handleClick(item.id, item.name, item.processStatus)"
          >海选</el-menu-item>
          <el-menu-item
            :index="index + '-2'"
            @click="handleClick(item.id, item.name, item.processStatus)"
          >对战</el-menu-item>
        </el-submenu>
      </div>
    </el-menu>
    <div class="right">
      <audition
        v-show="active.indexOf('-1')>-1"
        :competition-project-id="competitionProjectId"
        :competition-project-name="competitionProjectName"
        :process-status="processStatus"
      />
      <battle-steps
        v-show="active.indexOf('-2')>-1"
        :active="active"
        :competition-project-id="competitionProjectId"
        :competition-project-name="competitionProjectName"
        :competition-id="competitionId"
      />
    </div>
  </div>
</template>

<script>
import { getCompetitionProject } from '@/api/competition'
import audition from './components/audition.vue'
import battleSteps from './components/battleSteps.vue'
export default {
  components: { audition, battleSteps },
  data() {
    return {
      projects: [],
      active: '0-1',
      competitionProjectId: '',
      competitionProjectName: '',
      processStatus: ''
    }
  },
  created() {
    if (this.$route.query.id) {
      getCompetitionProject({ competitionId: this.$route.query.id }).then(res => {
        this.projects = res.data
        this.competitionProjectId = res.data[0].id
        this.competitionProjectName = res.data[0].name
        this.processStatus = res.data[0].processStatus
        this.competitionId = res.data[0].competitionId
      })
    }
  },
  methods: {
    handleSelect(key) {
      this.active = key
    },
    handleClick(id, name, processStatus) {
      this.competitionProjectId = id
      this.competitionProjectName = name
      this.processStatus = processStatus
    }
  }
}
</script>

<style lang='scss' scoped>
.projectManage {
  height: 100%;
  display: flex;
  .el-menu {
    flex: 1;
    overflow: auto;
    &::-webkit-scrollbar {
      //清除滚动条样式
      display: none;
    }
    .el-menu-item.is-active {
      background: #e9f2ff;
      color: #2681ff;
      font-weight: 500;
    }
  }
  .right {
    flex: 4;
    height: 100%;
    padding: 30px;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
