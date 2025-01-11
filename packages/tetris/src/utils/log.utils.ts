export const debugObjectLog = (title: string, obj: object) => {
  console.group(title);
  console.log(JSON.stringify(obj, null, 2));
  console.groupEnd();
};
