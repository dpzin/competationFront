<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-create" @click="handleCreate">
        上一轮对战（32进16）
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-create" @click="handleCreate">
        下一轮对战（8进4）
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-create" @click="handleCreate">
        大屏海报
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-create" @click="handleCreate">
        大屏对战表
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template>
          <span>第一组</span>
        </template>
      </el-table-column>
      <el-table-column label="左手边" align="center">
        <template>
          <span>三哥(17号)</span>
        </template>
      </el-table-column>
      <el-table-column label="右手边">
        <template>
          唐神（23号）
        </template>
      </el-table-column>
      <el-table-column label="比赛结果" align="center">
        <template>
          <span>三哥(17号)(win)</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            对战
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            判定
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  components: { },
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
    }
  }
}
</script>
