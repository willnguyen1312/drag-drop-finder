<template>
  <div
    @drop="onDrop"
    @dragenter.prevent
    @dragover.prevent
    class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4 text-center text-gray-400"
  >
    Here goes your content. You can also go the About page.
  </div>

  <FileTree
    v-if="currentTree.length > 0"
    :currentTree="currentTree"
    :paths="paths"
    @changePath="changePath"
    @pathClick="pathClick"
  />
</template>


<script lang="ts">
import { ref, defineComponent, computed } from "vue";
import { fromEvent } from "file-selector";

import FileTree from "../components/FileTree.vue";
import { findNodeFromTree, pathsToTree, TreeViewItem } from "../utils";

export default defineComponent({
  components: { FileTree },
  setup() {
    const tree = ref<TreeViewItem[]>([]);
    const currentPath = ref<string>("");

    const onDrop = async (event: Event) => {
      event.preventDefault();
      const files = await fromEvent(event);
      tree.value = pathsToTree(files.map((file: any) => file.path));
    };

    const currentTree = computed(() => {
      const currentPathValue = currentPath.value;

      if (!currentPathValue) {
        return tree.value;
      }

      const newTree = findNodeFromTree(
        tree.value,
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

    const pathClick = (index: number) => {
      if (index === 0) {
        changePath("");
        return;
      }

      const newPath = `${paths.value.slice(1, index + 1).join("/")}`;
      changePath(newPath);
    };

    return { onDrop, currentTree, paths, changePath, pathClick };
  },
});
</script>
