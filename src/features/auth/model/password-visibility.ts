export const passwordFieldNames = ["password", "confirmPassword"] as const;
export type PasswordFieldName = (typeof passwordFieldNames)[number];

export type PasswordVisibilityState = Record<PasswordFieldName, boolean>;

export const defaultPasswordVisibilityState: PasswordVisibilityState = {
  password: false,
  confirmPassword: false,
};

export function togglePasswordVisibility(
  state: PasswordVisibilityState,
  field: PasswordFieldName,
): PasswordVisibilityState {
  return {
    ...state,
    [field]: !state[field],
  };
}
