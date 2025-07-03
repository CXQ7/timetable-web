<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :width="isMobile ? '95%' : '70%'"
    top="20px">
    <el-table :data="classTimes" border style="width: 100%">
      <el-table-column prop="section" label="节次" width="80"></el-table-column>
      <el-table-column label="开始时间">
        <template slot-scope="scope">
          <el-time-picker
            v-model="scope.row.startTime"
            format="HH:mm"
            value-format="HH:mm"
            :size="isMobile ? 'small' : 'medium'"
            placeholder="选择时间">
          </el-time-picker>
        </template>
      </el-table-column>
      <el-table-column label="结束时间">
        <template slot-scope="scope">
          <el-time-picker
            v-model="scope.row.endTime"
            format="HH:mm"
            value-format="HH:mm"
            :size="isMobile ? 'small' : 'medium'"
            placeholder="选择时间">
          </el-time-picker>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="handleRemove(scope.$index)"
            type="text"
            :size="isMobile ? 'small' : 'medium'">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;">
      <el-button
        @click="handleAdd"
        type="primary"
        :size="isMobile ? 'small' : 'medium'">
        添加时间段
      </el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button
        @click="handleCancel"
        :size="isMobile ? 'small' : 'medium'">
        取消
      </el-button>
      <el-button
        type="primary"
        :size="isMobile ? 'small' : 'medium'"
        @click="handleSave">
        保存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ClassTimeDialog',
  props: {
    // 弹窗标题
    title: {
      type: String,
      default: '上课时间设置'
    },
    // 是否显示弹窗
    visible: {
      type: Boolean,
      default: false
    },
    // 上课时间数据
    classTimes: {
      type: Array,
      required: true
    },
    // 是否为移动端
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 保存设置
    handleSave () {
      this.$emit('save')
      this.$emit('update:visible', false)
    },

    // 添加时间段
    handleAdd () {
      this.$emit('add')
    },

    // 删除时间段
    handleRemove (index) {
      this.$emit('remove', index)
    },

    // 取消
    handleCancel () {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped>
/* 可根据需要添加自定义样式 */
</style>
