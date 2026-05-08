import z from "zod";

export const loginSchema = z.object({
  username: z
    .string("Tên đăng nhập không được để trống")
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .max(16, "Tên đăng nhập không được vượt quá 16 ký tự")
    .regex(/^[a-z0-9_]{3,16}$/, "Tên đăng nhập không hợp lệ"),
  password: z
    .string("Mật khẩu không được để trống")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});
