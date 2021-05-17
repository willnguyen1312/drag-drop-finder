
<template>
  <ul v-for="node in tree" :key="node.path">
    <li>
      {{ node.name }}
      <FileTree v-if="node?.children.length > 0" :tree="node.children" />
    </li>
  </ul>
</template>
  
<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FileTree",
  props: ["tree"],
});
</script>


<style scoped>
ul {
  position: relative;
  padding: 2px 25px;
  margin: 0;
}
ul::before {
  content: "";
  position: absolute;
  z-index: 1;
  width: 3px;
  bottom: 0;
  top: 0;
  left: 10px;
  background-size: 3px 3px;
  background-image: radial-gradient(#999999 30%, transparent 0);
  background-position: center;
}
li {
  list-style: none;
}
</style>