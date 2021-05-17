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

  return result;
};
