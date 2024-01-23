const components = import.meta.globEager('./components/**/*.vue');
const componentsMap = {};
Object.keys(components).forEach((key) => {
  const component: any = components[key];
  componentsMap[component?.default?.__name || component?.default?.name] = component.default;
});
export default componentsMap;
