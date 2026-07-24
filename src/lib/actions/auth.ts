"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validation/auth";
import { sendEmail } from "@/lib/email/mailer";
import { welcomeTemplate } from "@/lib/email/templates/welcome";

export type RegisterActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerUser(
  _prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    location: formData.get("location"),
    occupation: formData.get("occupation"),
    userType: formData.get("userType"),
    interests: formData.getAll("interests"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await db.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return {
      success: false,
      message: "An account with that email already exists.",
      fieldErrors: { email: ["An account with that email already exists."] },
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      phone: parsed.data.phone,
      address: parsed.data.address,
      location: parsed.data.location,
      occupation: parsed.data.occupation,
      userType: parsed.data.userType,
      interests: parsed.data.interests,
    },
  });

  const { subject, html } = welcomeTemplate({ name: parsed.data.name });
  // Fire-and-forget: registration already succeeded, don't make the user wait on email delivery.
  sendEmail({ to: parsed.data.email, subject, html }).catch(() => {});

  return {
    success: true,
    message: "Account created. You can now log in — add a profile photo any time from My Account.",
  };
}
