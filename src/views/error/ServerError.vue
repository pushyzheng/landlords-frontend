<template>
  <div id="server-error">
    <div>
      <img src="static/images/HTTP-Internal-Server-Error.png" alt=""
           style="width: 600px;">
      <div style="text-align: center">
        <h1>服务似乎不可用了...</h1>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServerError"
}
</script>

<style scoped>
#server-error {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
