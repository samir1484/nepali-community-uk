"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { requireAdmin, NotAuthorizedError } from "@/lib/auth/rbac";
import { notifyMatchingUsers } from "@/lib/notifications/matchInterests";
import {
  listingBaseSchema,
  detailsSchemaFor,
  typeToPath,
  type ListingTypeValue,
} from "@/lib/validation/listings";

export type ListingActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new NotAuthorizedError();
  return session;
}

function extractDetails(type: ListingTypeValue, formData: FormData): Record<string, unknown> {
  switch (type) {
    case "JOB":
      return {
        company: formData.get("company"),
        jobType: formData.get("jobType"),
        salaryRange: formData.get("salaryRange"),
        applyEmail: formData.get("applyEmail"),
      };
    case "ROOM":
      return {
        rentAmount: formData.get("rentAmount"),
        rentPeriod: formData.get("rentPeriod"),
        roomType: formData.get("roomType"),
        availableFrom: formData.get("availableFrom"),
      };
    case "EVENT":
      return {
        startDate: formData.get("startDate"),
        isOnline: formData.get("isOnline") === "on",
        ticketUrl: formData.get("ticketUrl"),
      };
    case "VOLUNTEER":
      return {
        organization: formData.get("organization"),
        commitment: formData.get("commitment"),
      };
    case "BUSINESS":
      return {
        services: formData.get("services"),
        websiteUrl: formData.get("websiteUrl"),
      };
  }
}

export async function createListing(
  _prevState: ListingActionState,
  formData: FormData
): Promise<ListingActionState> {
  const session = await requireUser();

  const base = listingBaseSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    location: formData.get("location"),
  });
  if (!base.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: base.error.flatten().fieldErrors,
    };
  }

  const detailsSchema = detailsSchemaFor(base.data.type);
  const detailsParsed = detailsSchema.safeParse(extractDetails(base.data.type, formData));
  if (!detailsParsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: detailsParsed.error.flatten().fieldErrors,
    };
  }

  const role = session.user.role;
  const status = role === "ADMIN" || role === "MODERATOR" ? "APPROVED" : "PENDING";
  const images = formData.getAll("images").filter((v): v is string => typeof v === "string" && v.length > 0).slice(0, 6);

  const listing = await db.listing.create({
    data: {
      type: base.data.type,
      title: base.data.title,
      description: base.data.description,
      location: base.data.location,
      details: detailsParsed.data,
      images,
      status,
      authorId: session.user.id,
    },
  });

  if (status === "APPROVED") {
    await notifyMatchingUsers(listing);
  }

  revalidatePath(`/${typeToPath(base.data.type)}`);
  revalidatePath("/admin/listings");

  return {
    success: true,
    message:
      status === "APPROVED"
        ? "Listing published."
        : "Listing submitted — an admin will review it shortly.",
  };
}

export async function approveListing(id: string): Promise<{ success: boolean; message: string }> {
  await requireAdmin();
  const listing = await db.listing.update({ where: { id }, data: { status: "APPROVED" } });
  await notifyMatchingUsers(listing);
  revalidatePath(`/${typeToPath(listing.type)}`);
  revalidatePath("/admin/listings");
  return { success: true, message: "Listing approved." };
}

export async function rejectListing(id: string): Promise<{ success: boolean; message: string }> {
  await requireAdmin();
  const listing = await db.listing.update({ where: { id }, data: { status: "REJECTED" } });
  revalidatePath(`/${typeToPath(listing.type)}`);
  revalidatePath("/admin/listings");
  return { success: true, message: "Listing rejected." };
}

export async function deleteListing(id: string): Promise<{ success: boolean; message: string }> {
  await requireAdmin();
  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing) return { success: false, message: "Listing not found." };

  await db.listing.delete({ where: { id } });
  revalidatePath(`/${typeToPath(listing.type)}`);
  revalidatePath("/admin/listings");
  return { success: true, message: "Listing deleted." };
}
