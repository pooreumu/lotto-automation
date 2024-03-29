import {
    convert,
    DateTimeFormatter,
    LocalDate,
    LocalDateTime,
    nativeJs,
} from '@js-joda/core';

export class DateTimeUtil {
    private static DATE_FORMATTER = DateTimeFormatter.ofPattern('yyyy-MM-dd');
    private static DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern(
        'yyyy-MM-dd HH:mm:ss',
    );

    static toString(localDate: LocalDate | LocalDateTime): string {
        if (localDate instanceof LocalDate) {
            return localDate.format(DateTimeUtil.DATE_FORMATTER);
        }
        return localDate.format(DateTimeUtil.DATE_TIME_FORMATTER);
    }

    static toDate(localDate: LocalDate | LocalDateTime): Date {
        return convert(localDate).toDate();
    }

    static toLocalDate(date: Date): LocalDate {
        return LocalDate.from(nativeJs(date));
    }

    static toLocalDateTime(date: Date): LocalDateTime {
        return LocalDateTime.from(nativeJs(date));
    }

    static toLocalDateBy(strDate: string): LocalDate {
        return LocalDate.parse(strDate, DateTimeUtil.DATE_FORMATTER);
    }

    static toLocalDateTimeBy(strDate: string): LocalDateTime {
        return LocalDateTime.parse(strDate, DateTimeUtil.DATE_TIME_FORMATTER);
    }
}
