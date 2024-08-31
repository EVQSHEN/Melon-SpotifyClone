function millisecondsToMinutesAndSeconds(duration_ms: number) {
  const millis = duration_ms;
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  const hours = Math.floor((millis / (1000 * 60 * 60)) % 24);
  return hours + minutes + ':' + (seconds.length === 1 ? '0' : '') + seconds;
}

export default millisecondsToMinutesAndSeconds;
