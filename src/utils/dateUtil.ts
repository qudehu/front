/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import moment, { unitOfTime } from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(
  date: moment.MomentInput = undefined,
  format = DATE_TIME_FORMAT,
): string {
  return moment(date).format(format);
}

export function formatToDate(date: moment.MomentInput = undefined, format = DATE_FORMAT): string {
  return moment(date).format(format);
}
export function strToDate(str: string, format = DATE_FORMAT): moment.MomentInput {
  return moment(str, format);
}
export function strToDateTime(str: string, format = DATE_TIME_FORMAT): moment.MomentInput {
  return moment(str, format);
}
/**
 * 计算相差时间
 * @param startTime
 * @param endTime
 * @returns
 */
export function diff(
  startTime: moment.Moment,
  endTime: moment.Moment,
  unitOfTime: unitOfTime.Diff = 'hours',
) {
  if (startTime && endTime) {
    return endTime.diff(startTime, unitOfTime);
  }
  return undefined;
}

export const dateUtil = moment;
