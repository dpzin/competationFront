<template>
  <div class="app-container">
    <div class="search">
      <!-- <el-input
        v-model="search"
        placeholder="名称"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button> -->
      <el-button
        type="primary"
        icon="el-icon-create"
        @click="handleCreate()"
      >
        创建赛事
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
      />
      <el-table-column
        label="赛事名称"
        prop="name"
        align="center"
      >
        <template slot-scope="{row}">
          <span
            class="name"
            @click="goToProject(row.id)"
          >{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="比赛时间"
        prop="startTime"
        align="center"
      />
      <el-table-column
        label="赛事项目"
        prop="projects"
        align="center"
      >
        <template slot-scope="{row}">
          <el-tag
            v-for="(item) in row.projects"
            :key="item"
            size="small"
            class="tag"
          >{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="参赛费用"
        prop="price"
        align="center"
      />
      <el-table-column
        label="赛事地址"
        prop="address"
        align="center"
      />
      <el-table-column
        label="操作"
        align="center"
        width="330px"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            @click="handleBigScreen(row.id)"
          >
            大屏显示
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleBigScreenController(row.id)"
          >
            大屏遥控
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleDetail(row.id)"
          >
            详情
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row.id)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="detail.name"
      :visible.sync="detailVisible"
      width="50%"
    >
      <el-descriptions :column="2">
        <el-descriptions-item label="比赛时间">{{ detail.startTime }}</el-descriptions-item>
        <el-descriptions-item label="参赛费用">{{ detail.price }}</el-descriptions-item>
        <el-descriptions-item label="赛事项目">
          <el-tag
            v-for="(item) in detail.projects"
            :key="item"
            size="small"
            class="tag"
          >{{ item }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="赛事地址">{{ detail.address }}</el-descriptions-item>
        <el-descriptions-item
          label="赛事描述"
          :span="2"
        >{{ detail.description }}</el-descriptions-item>
        <el-descriptions-item
          label="宣传海报"
          :span="2"
        >
          <img
            :src="domain + detail.posterUrl"
            width="148"
            height="148"
          >
        </el-descriptions-item>
        <el-descriptions-item
          label="大屏背景"
          :span="2"
        >
          <img
            :src="domain + detail.coverUrl"
            width="148"
            height="148"
          >
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { getCompetitionList, deleteCompetition, getCompetitionDetail } from '@/api/competition'

export default {
  data() {
    return {
      tableKey: 0,
      list: [],
      detailVisible: false,
      detail: {},
      domain: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取赛事列表
    getList() {
      this.listLoading = false
      getCompetitionList().then((res) => {
        this.list = res.data
      })
    },
    // 新增
    handleCreate() {
      this.$router.push({
        path: '/competition/addCompetition'
      })
    },
    // 显示大屏
    handleBigScreen(id) {
      window.open('//' + window.location.host + '/competition/bigScreen?competitionId=' + id)
    },
    // 显示大屏遥控
    handleBigScreenController(id) {
      window.open('//' + window.location.host + '/competition/controller?id=' + id)
    },
    // 详情
    handleDetail(id) {
      getCompetitionDetail({ id }).then(res => {
        this.detail = res.data
        this.detailVisible = true
      })
    },
    // 编辑
    handleUpdate(id) {
      this.$router.push({
        path: '/competition/editCompetition',
        query: {
          id
        }
      })
    },
    // 删除
    handleDelete(id) {
      deleteCompetition({ id }).then(res => {
        this.getList()
      })
    },
    // 跳转至赛事项目管理
    goToProject(id) {
      this.$router.push({
        path: '/competition/projectManagement',
        query: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .search {
    margin-bottom: 24px;
  }
  .tag {
    margin-right: 6px;
    &:last-child {
      margin-right: 0;
    }
  }
  .name {
    color: #409eff;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
