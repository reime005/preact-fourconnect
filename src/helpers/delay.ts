export async function delay(timeout: number) {
  return new Promise<any>(res => setTimeout(res, timeout));
}
