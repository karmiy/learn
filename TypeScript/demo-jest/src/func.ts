export function myForEach(items: number[], callback: (a: number) => void) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}