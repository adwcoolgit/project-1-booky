function parseLocalDateInput(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);

  return new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function toLocalDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function estimateReturnDate({
  durationDays,
  borrowDate,
  now = new Date(),
}: {
  durationDays: number;
  borrowDate?: string | undefined;
  now?: Date;
}): Date {
  const start = borrowDate ? parseLocalDateInput(borrowDate) : now;
  const result = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  result.setDate(result.getDate() + durationDays);

  return result;
}
