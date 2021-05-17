
<template>
  <span
    v-for="(_, index) in paths"
    :key="index"
    class="text-2xl font-medium mt-2 cursor-pointer"
    @click="onPathClick(index)"
  >
    {{
      `${paths[index]}${index === 0 || index === paths.leng - 1 ? "" : " / "}`
    }}
  </span>

  <ul class="mt-2" v-for="node in currentTree" :key="node.path">
    <li
      class="flex items-end text-lg cursor-pointer"
      @click="node.children.length > 0 && changePath(node.path)"
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
  props: ["tree"],
  setup({ tree }: { tree: TreeViewItem[] }) {
    const currentPath = ref<string>("");

    const currentTree = computed(() => {
      const currentPathValue = currentPath.value;

      if (!currentPathValue) {
        return tree;
      }

      const newTree = findNodeFromTree(
        tree,
        (node) => node.path === currentPathValue
      );

      return newTree.children;
    });

    const paths = computed(() => {
      return ["Root"].concat(currentPath.value.split("/"));
    });

    const changePath = (path: string) => {
      currentPath.value = path;
    };

    const onPathClick = (index: number) => {
      if (index === 0) {
        changePath("");
        return;
      }

      const newPath = `${paths.value.slice(1, index + 1).join("/")}`;
      changePath(newPath);
    };

    return { paths, changePath, currentTree, onPathClick };
  },
});
</script>