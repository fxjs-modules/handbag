<template lang="pug">
#test-vue
    | test-vue
    .foo {{foo}}
</template>

<script>
export default {
  name: 'test',

  data () {
    return {
      foo: 'bar'
    }
  },

  methods: {
    async loadResource () {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          resolve(Date.now())
        }, 1000)
      })
    }
  }
}
</script>

<style lang="stylus">
#test-vue
    color red
</style>


