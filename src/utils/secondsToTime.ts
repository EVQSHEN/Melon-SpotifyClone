function secondsToTime(input: number) {
  const seconds = Math.floor((input / 1000) % 60);
  const minutes = Math.floor((input / (1000 * 60)) % 60);
  const hours = Math.floor((input / (1000 * 60 * 60)) % 24);
  const parts: string[] = [];
  if (hours > 0) {
    parts.push(
      `${hours}`.padStart(2, '0'),
      `${minutes}`.padStart(2, '0'),
      `${seconds}`.padStart(2, '0'),
    );
  } else {
    parts.push(`${minutes}`, `${seconds}`.padStart(2, '0'));
  }
  return parts.join(':');
}

export default secondsToTime;
