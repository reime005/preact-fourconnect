export default async (instance) => {
    try {
        let id = await instance.getOpenGameId.call();
        return id;
    } catch (error) {
        return -1;
    }
}