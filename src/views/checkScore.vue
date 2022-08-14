<template>
  <div>
    <el-table
      key="contestantTable"
      v-loading="contestantLoading"
      :data="contestantList"
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column
        label="排序"
        width="70px"
      >
        <template slot-scope="{row,$index}">
          <span>{{ $index +1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="no"
        label="号码牌"
        width="70px"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="140px"
      />
      <el-table-column
        prop="score"
        label="分数（10分制）"
      />
    </el-table>
  </div>
</template>

<script>
import { getProjectMember } from '@/api/competition'
export default {
  data() {
    return {
      competitionProjectId: this.$route.query.projectId,
      contestantLoading: false,
      contestantList: []
    }
  },
  created() {
    this.getContestantList()
  },
  methods: {
    async getContestantList() {
      this.contestantLoading = true
      await getProjectMember({
        competitionProjectId: this.competitionProjectId,
        orderBy: 'auditionResult'
      }).then(res => {
        this.contestantList = res.data.map(item => {
          const obj = {
            id: item.id,
            no: item.no,
            name: item.name,
            score: item.auditionResult
          }
          return obj
        })
        this.total = res.data.length
        this.contestantLoading = false
      })
    }
  }
}
</script>
