export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ChangePasswordResponse = {
  changed: boolean;
};

export type UpdateProfilePayload = {
  fullName: string;
};
