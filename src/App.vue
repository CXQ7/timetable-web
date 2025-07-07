<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {},
  mounted () {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      this.$store.commit('SET_USER_INFO', userInfo)
    }
  }
}
</script>
