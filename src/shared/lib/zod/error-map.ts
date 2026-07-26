import type { ZodErrorMap } from "zod";

function messageFromIssue(path: readonly PropertyKey[] | undefined): string {
  if (path && path.length > 0) {
    return `Invalid value for ${path.join(".")}.`;
  }

  return "Invalid input.";
}

export const defaultZodErrorMap: ZodErrorMap = (issue) => ({
  message: messageFromIssue(issue.path),
});
