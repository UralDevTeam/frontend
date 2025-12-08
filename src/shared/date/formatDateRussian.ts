const MONTHS = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
];

export const formatDateRussian = (value?: Date | string | number | null, options?: { hideYear?: boolean }) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear();

    if (options?.hideYear) {
        return `${day} ${month}`;
    }

    return `${day} ${month} ${year}`;
};
