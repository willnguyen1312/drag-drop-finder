
<template>
  <span
    v-for="(_, index) in paths"
    :key="index"
    class="text-2xl font-medium mt-2 cursor-pointer"
    @click="$emit('pathClick', index)"
  >
    {{
      `${paths[index]}${index === 0 || index === paths.leng - 1 ? "" : " / "}`
    }}
  </span>

  <ul class="mt-2" v-for="node in currentTree" :key="node.path">
    <li
      draggable="true"
      class="flex items-end text-lg cursor-pointer"
      @click="node.children.length > 0 && $emit('changePath', node.path)"
      @drop="onDrop($event, node.path)"
      @dragenter.prevent
      @dragover.prevent
      @dragstart="startDrag($event, node.path)"
    >
      <font-awesome-icon
        :icon="node.children.length > 0 ? 'folder' : 'file'"
        size="2x"
        class="mr-2"
      />
      <span class="text-xl">
        {{ node.name }}
      </span>
    </li>
  </ul>
</template>
  
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { findNodeFromTree, TreeViewItem } from "../utils";

export default defineComponent({
  name: "FileTree",
  props: ["currentTree", "paths"],
  setup() {
    const startDrag = (evt: any, path: string) => {
      evt.dataTransfer.dropEffect = "move";
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("path", path);
    };

    const onDrop = (evt: any, parentPath: string) => {
      evt.preventDefault();
      const childPath = evt.dataTransfer.getData("path");
      if (childPath === parentPath) {
        return;
      }

      console.log(parentPath);
      console.log(childPath);
    };

    return { startDrag, onDrop };
  },
});
</script>