export default (timestamp) => {
    timestamp = timestamp.toNumber() || 0;
    return timestamp === 0 ? 0 : new Date(timestamp * 1000).toLocaleString();
}