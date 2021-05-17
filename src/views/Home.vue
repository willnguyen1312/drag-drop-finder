<template>
  <div
    @drop="onDrop"
    @dragenter.prevent
    @dragover.prevent
    class="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4 text-center text-gray-400"
  >
    Here goes your content. You can also go the About page.
  </div>

  <FileTree v-if="tree.length > 0" :tree="tree" />
</template>


<script lang="ts">
import { ref, defineComponent } from "vue";
import { fromEvent } from "file-selector";

import FileTree from "../components/FileTree.vue";
import { pathsToTree, TreeViewItem } from "../utils";

export default defineComponent({
  components: { FileTree },
  setup() {
    const tree = ref<TreeViewItem[]>([]);

    const onDrop = async (event: Event) => {
      event.preventDefault();
      const files = await fromEvent(event);

      tree.value = pathsToTree(files.map((file: any) => file.path));
    };

    return { onDrop, tree };
  },
});
</script>
