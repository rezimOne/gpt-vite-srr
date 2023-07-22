<template>
  <div class="container">
    <div class="sun"></div>
    <div class="orbit">
      <div class="planet red"></div>
    </div>
  </div>
</template>
<style scoped>
.container {
  position: relative;
  height: 600px;
  /* adjust as needed */
  width: 600px;
  /* adjust as needed */
}

.sun {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid black;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: top left;
}

.planet {
  position: absolute;
  border-radius: 50%;
}

.red {
  border: solid 2px black;
  width: 10px;
  height: 10px;
}

@keyframes orbit {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(1turn);
  }
}

.orbit:nth-child(1) {
  animation: orbit 5s linear infinite;
}

.orbit:nth-child(2) {
  animation: orbit 3s linear infinite;
}
</style>