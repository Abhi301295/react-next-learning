"use client";

import { useState } from "react";
import Image from "next/image";
import { TextLink } from "@/components/ui/TextLink";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { UpstreamUserDetail } from "@/lib/users/types";
import UsersFormDialog from "@/(app)/users/UsersFormDialog";

function profilePhotoSrc(raw: string | undefined): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  return /^https?:\/\//i.test(t) ? t : null;
}

function websiteHref(website: string) {
  const trimmed = website.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export default function UserDetail({
  user,
}: {
  user: UpstreamUserDetail;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const phoneHrefDigits = user.phone
    ? user.phone.replace(/[^\d+]/g, "")
    : "";
  const portraitUrl = profilePhotoSrc(user.image);
  const portraitAlt = `Profile photo for ${user.name}`;

  return (
    <article className="space-y-4" aria-labelledby="user-heading">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1
            id="user-heading"
            className="text-display-sm font-semibold text-primary"
          >
            {user.name}
          </h1>
          <p className="text-sm text-subtle">Profile · User ID {user.id}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setEditOpen(true)}>
          Edit user
        </Button>
      </header>

      <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border border-stroke bg-panel">
        {portraitUrl ? (
          <Image
            src={portraitUrl}
            alt={portraitAlt}
            fill
            unoptimized
            className="object-cover"
            sizes="9rem"
            priority
          />
        ) : (
          <span className="sr-only">No profile photo</span>
        )}
      </div>

      <Card className="border-stroke bg-panel">
        <CardHeader>
          <CardTitle as="h2">Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-subtle">Email</dt>
              <dd className="text-foreground">
                <a
                  href={`mailto:${user.email}`}
                  className="text-primary underline-offset-2 hover:underline"
                >
                  {user.email}
                </a>
              </dd>
            </div>
            {user.phone && (
              <div>
                <dt className="text-subtle">Phone</dt>
                <dd className="text-foreground">
                  {phoneHrefDigits ? (
                    <a
                      href={`tel:${phoneHrefDigits}`}
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      {user.phone}
                    </a>
                  ) : (
                    <span>{user.phone}</span>
                  )}
                </dd>
              </div>
            )}
            {user.website && (
              <div>
                <dt className="text-subtle">Website</dt>
                <dd className="text-foreground">
                  <a
                    href={websiteHref(user.website)}
                    rel="noreferrer noopener"
                    className="break-all text-primary underline-offset-2 hover:underline"
                  >
                    {user.website}
                  </a>
                </dd>
              </div>
            )}
            {user.company?.name && (
              <div>
                <dt className="text-subtle">Company</dt>
                <dd className="text-foreground">{user.company.name}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      <nav aria-label="Profile navigation">
        <TextLink href="/users" variant="inlineBlock">
          ← Back to users
        </TextLink>
      </nav>

      <UsersFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        editUserId={user.id}
        initialDetail={user}
      />
    </article>
  );
}
