<template>
  <div
    @drop="onDrop"
    @dragenter.prevent
    @dragover.prevent
    class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4 text-center text-gray-400"
  >
    Here goes your folder(s) content
  </div>

  <FileTree
    v-if="currentTree.length > 0"
    :currentTree="currentTree"
    :paths="paths"
    @changePath="changePath"
    @pathClick="pathClick"
    @nodeChange="nodeChange"
  />
</template>

<script lang="ts">
import { ref, defineComponent, defineAsyncComponent, computed } from "vue";
import { fromEvent } from "file-selector";

import {
  findNodeFromTree,
  updatePath,
  pathsToTree,
  TreeViewItem,
} from "../utils";

const AsyncFileTree = defineAsyncComponent(
  () => import("../components/FileTree.vue")
);

export default defineComponent({
  components: { FileTree: AsyncFileTree },
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

    const nodeChange = ({
      childPath,
      parentPath,
    }: {
      childPath: string;
      parentPath: string;
    }) => {
      let childNode = findNodeFromTree(
        tree.value,
        (node) => node.path === childPath
      );

      const parentNode = findNodeFromTree(
        tree.value,
        (node) => node.path === parentPath
      );

      parentNode.children.push(childNode);

      const directParentNode = findNodeFromTree(
        tree.value,
        (node) => node.path === childNode.parentPath
      );

      childNode.parentPath = parentNode.path;
      childNode.path = parentNode.path + childNode.path;

      childNode.children.forEach((node) => {
        updatePath(node, childNode);
      });

      if (directParentNode) {
        const index = directParentNode.children.indexOf(childNode);
        directParentNode.children.splice(index, 1);
        return;
      }

      const index = tree.value.indexOf(childNode);
      tree.value.splice(index, 1);
    };

    return { onDrop, currentTree, paths, changePath, pathClick, nodeChange };
  },
});
</script>
