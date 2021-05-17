export interface TreeViewItem {
  name: string;
  path: string;
  children: TreeViewItem[];
}

export const pathsToTree = (paths: string[]): TreeViewItem[] => {
  const result: TreeViewItem[] = [];
  const level = { result };

  paths.forEach((path) => {
    const pathUnits = path.split("/");
    pathUnits.reduce((pathUnit, name, index) => {
      if (!pathUnit[name]) {
        pathUnit[name] = { result: [] };
        pathUnit.result.push({
          name,
          path: pathUnits.slice(0, index + 1).join("/"),
          children: pathUnit[name].result,
        });
      }

      return pathUnit[name];
    }, level);
  });

  return result[0].children.length === 0 ? result : result[0].children;
};

export const findNodeFromTree = (
  menuData: TreeViewItem[],
  predicate: (menuItem: TreeViewItem) => boolean
): TreeViewItem | null => {
  const stack: TreeViewItem[] = [];
  stack.push(...menuData);
  let node: TreeViewItem;

  while (stack.length) {
    node = stack.pop() as TreeViewItem;

    if (predicate(node)) {
      return node;
    }

    if (node.children?.length) {
      stack.push(...node.children);
    }
  }

  return null;
};
