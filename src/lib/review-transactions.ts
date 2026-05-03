export type TransactionDayGroup<TTransaction> = {
  dayKey: string;
  label: string;
  transactions: TTransaction[];
};

type TransactionDateFields = {
  occurredAt?: string | number;
  date?: string | number;
  createdAt?: string | number;
};

export function groupTransactionsByDay<TTransaction extends TransactionDateFields>(
  transactions: TTransaction[],
): TransactionDayGroup<TTransaction>[] {
  const groups = new Map<string, TTransaction[]>();

  for (const transaction of [...transactions].sort(
    (first, second) => getTransactionTime(second) - getTransactionTime(first),
  )) {
    const dayKey = getTransactionDayKey(transaction);
    groups.set(dayKey, [...(groups.get(dayKey) ?? []), transaction]);
  }

  return [...groups.entries()]
    .sort(([firstDay], [secondDay]) => secondDay.localeCompare(firstDay))
    .map(([dayKey, dayTransactions]) => ({
      dayKey,
      label: formatDayLabel(dayKey),
      transactions: dayTransactions,
    }));
}

function getTransactionDayKey(transaction: TransactionDateFields): string {
  return toDayKey(transaction.occurredAt ?? transaction.date ?? transaction.createdAt);
}

function getTransactionTime(transaction: TransactionDateFields): number {
  const value = transaction.occurredAt ?? transaction.date ?? transaction.createdAt;

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return new Date(value).getTime();
  }

  return 0;
}

function toDayKey(value: string | number | undefined): string {
  if (typeof value === "number") {
    return formatDateKey(new Date(value));
  }

  if (typeof value === "string") {
    const dateOnlyMatch = /^\d{4}-\d{2}-\d{2}/.exec(value);

    if (dateOnlyMatch) {
      return dateOnlyMatch[0];
    }

    return formatDateKey(new Date(value));
  }

  return formatDateKey(new Date(0));
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDayLabel(dayKey: string): string {
  const [year, month, day] = dayKey.split("-").map(Number);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}
