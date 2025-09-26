export function addSecondsToDate(date: Date, seconds: number = 0): Date {
  date.setSeconds(date.getSeconds() + seconds)
  return date
}

export function timestamp(addSeconds: number = 0): string {
  const t = addSecondsToDate(new Date(), addSeconds)
  return t.toISOString()
}

export function shuffle(array: unknown[]) {
  return array.sort(() => Math.random() - 0.5)
}
