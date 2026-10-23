export function fromSQLDatetime(datetime: string) {
  return new Date(datetime.replace(' ', 'T') + 'Z')
}
