<template>
  <div>
    <a-switch @change='onChange' v-model="checked"/>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        checked: false
      }
    },
    methods: {
      onChange(checked){
        console.log(`a-switch to ${checked}`);
      }
    },
  }
</script>
