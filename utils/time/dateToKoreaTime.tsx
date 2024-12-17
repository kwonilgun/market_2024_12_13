export function dateToKoreaTime(date: Date | null): string | null {
  if (date !== null && date !== undefined) {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      // timeZoneName: "short",
      // timeZone: "Asia/Seoul"
    }).format(date);
  } else {
    //     devLOGError('dateToKoreaTime.ts: date가 null 이다.');
    return null;
  }
}
