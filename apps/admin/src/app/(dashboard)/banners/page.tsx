import Image from "next/image";
import { createClient } from "@repo/supabase/server";
import type { SiteBanner } from "@repo/supabase";
import PageHeader from "@/components/PageHeader";
import {
  updateAnnouncement,
  updateHero,
  createPromo,
  updatePromo,
  deletePromo,
  updateGallery,
} from "./actions";

export const dynamic = "force-dynamic";

// The homepage collage has 5 fixed slots; only the image is editable here.
const GALLERY_SLOTS = [
  { pos: 1, label: "Tile 1 — tall, left", def: "/images/gallery-4.jpg" },
  { pos: 2, label: "Tile 2 — wide, top", def: "/images/gallery-1.png" },
  { pos: 3, label: "Tile 3 — small", def: "/images/gallery-hands.jpg" },
  { pos: 4, label: "Tile 4 — small", def: "/images/gallery-wrist.png" },
  { pos: 5, label: "Tile 5 — tall, right", def: "/images/gallery-3.png" },
];

// Thumbnail for any banner image — uploaded ones are absolute Supabase URLs;
// the built-in "/images/*" defaults resolve from the admin public folder.
function Preview({ url, alt }: { url: string | null; alt: string }) {
  if (!url) return null;
  return (
    <div className="relative mb-3 h-28 w-44 overflow-hidden rounded-md border border-black/10 bg-cream">
      <Image src={url} alt={alt} fill sizes="176px" className="object-cover" />
    </div>
  );
}

function ActiveToggle({ defaultChecked }: { defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        name="is_active"
        defaultChecked={defaultChecked}
        className="h-4 w-4 accent-[#9c1137]"
      />
      Visible on the site
    </label>
  );
}

const fileInputClass =
  "block w-full text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-burgundy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-burgundy-dark";

export default async function BannersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_banners")
    .select("*")
    .order("slot", { ascending: true })
    .order("sort_order", { ascending: true });

  // The table hasn't been created yet — guide the owner to run the migration.
  if (error) {
    return (
      <div>
        <PageHeader
          title="Banners"
          subtitle="Manage the announcement bar, homepage hero, and promo cards."
        />
        <div className="card max-w-2xl p-6">
          <h2 className="font-serif text-lg text-ink">One-time setup needed</h2>
          <p className="mt-2 text-sm text-muted">
            The <code>site_banners</code> table doesn&apos;t exist yet. Open the
            Supabase dashboard → SQL Editor and run{" "}
            <code>supabase/migrations/0002_banners.sql</code> from the repo, then
            reload this page.
          </p>
          <p className="mt-3 text-xs text-muted">
            Error: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const banners = (data ?? []) as SiteBanner[];
  const announcement = banners.find((b) => b.slot === "announcement") ?? null;
  const hero = banners.find((b) => b.slot === "hero") ?? null;
  const promos = banners.filter((b) => b.slot === "promo");
  const gallery = banners.filter((b) => b.slot === "gallery");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Banners"
        subtitle="Manage the announcement bar, homepage hero, and promo cards. Changes appear on the site immediately."
      />

      {/* ---------- Announcement bar ---------- */}
      <section className="card max-w-3xl p-6">
        <h2 className="font-serif text-lg text-ink">Announcement bar</h2>
        <p className="mt-1 text-sm text-muted">
          The thin strip at the very top of every page.
        </p>
        <form action={updateAnnouncement} className="mt-5 space-y-4">
          <input type="hidden" name="id" value={announcement?.id ?? ""} />
          <div>
            <label className="field-label">Message</label>
            <input
              name="title"
              defaultValue={announcement?.title ?? ""}
              className="field-input"
              placeholder="Book a private viewing at our Karur showroom."
            />
          </div>
          <ActiveToggle defaultChecked={announcement?.is_active ?? true} />
          <button type="submit" className="btn-primary">
            Save announcement
          </button>
        </form>
      </section>

      {/* ---------- Hero banner ---------- */}
      <section className="card max-w-3xl p-6">
        <h2 className="font-serif text-lg text-ink">Homepage hero</h2>
        <p className="mt-1 text-sm text-muted">
          The large banner at the top of the homepage.
        </p>
        <form action={updateHero} className="mt-5 space-y-4">
          <input type="hidden" name="id" value={hero?.id ?? ""} />
          <input
            type="hidden"
            name="existing_image_url"
            value={hero?.image_url ?? ""}
          />
          <input
            type="hidden"
            name="existing_image_path"
            value={hero?.image_path ?? ""}
          />

          <div>
            <label className="field-label">Background image</label>
            <Preview url={hero?.image_url ?? null} alt="Hero" />
            <input name="image" type="file" accept="image/*" className={fileInputClass} />
            <p className="mt-1 text-xs text-muted">
              Leave empty to keep the current image. Wide/landscape images work best.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Eyebrow (small label)</label>
              <input
                name="eyebrow"
                defaultValue={hero?.eyebrow ?? ""}
                className="field-input"
                placeholder="New Arrivals"
              />
            </div>
            <div>
              <label className="field-label">Headline</label>
              <input
                name="title"
                defaultValue={hero?.title ?? ""}
                className="field-input"
                placeholder="Crafted to Shine"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Subtext</label>
            <textarea
              name="subtitle"
              rows={2}
              defaultValue={hero?.subtitle ?? ""}
              className="field-input"
              placeholder="A short line under the headline"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Button label</label>
              <input
                name="cta_label"
                defaultValue={hero?.cta_label ?? ""}
                className="field-input"
                placeholder="Explore Collection"
              />
            </div>
            <div>
              <label className="field-label">Button link</label>
              <input
                name="cta_href"
                defaultValue={hero?.cta_href ?? ""}
                className="field-input"
                placeholder="/products"
              />
            </div>
          </div>

          <ActiveToggle defaultChecked={hero?.is_active ?? true} />
          <button type="submit" className="btn-primary">
            Save hero
          </button>
        </form>
      </section>

      {/* ---------- Promo cards ---------- */}
      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-lg text-ink">Promo cards</h2>
          <p className="mt-1 text-sm text-muted">
            The pair of promotional cards in the middle of the homepage.
          </p>
        </div>

        {promos.map((promo) => (
          <form
            key={promo.id}
            action={updatePromo}
            className="card max-w-3xl space-y-4 p-6"
          >
            <input type="hidden" name="id" value={promo.id} />
            <input
              type="hidden"
              name="existing_image_url"
              value={promo.image_url ?? ""}
            />
            <input
              type="hidden"
              name="existing_image_path"
              value={promo.image_path ?? ""}
            />

            <div>
              <label className="field-label">Image</label>
              <Preview url={promo.image_url} alt={promo.title ?? "Promo"} />
              <input name="image" type="file" accept="image/*" className={fileInputClass} />
              <p className="mt-1 text-xs text-muted">
                Leave empty to keep the current image.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Eyebrow</label>
                <input
                  name="eyebrow"
                  defaultValue={promo.eyebrow ?? ""}
                  className="field-input"
                  placeholder="New collection"
                />
              </div>
              <div>
                <label className="field-label">Title</label>
                <input
                  name="title"
                  defaultValue={promo.title ?? ""}
                  className="field-input"
                  placeholder="Summer Essentials"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Link</label>
                <input
                  name="cta_href"
                  defaultValue={promo.cta_href ?? ""}
                  className="field-input"
                  placeholder="/products"
                />
              </div>
              <div>
                <label className="field-label">Display order</label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={promo.sort_order}
                  className="field-input"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <ActiveToggle defaultChecked={promo.is_active} />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  Save
                </button>
                <button
                  type="submit"
                  formAction={deletePromo}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </form>
        ))}

        {/* Add a new promo card */}
        <form action={createPromo} className="card max-w-3xl space-y-4 p-6">
          <h3 className="font-medium text-ink">Add a promo card</h3>
          <div>
            <label className="field-label">Image</label>
            <input name="image" type="file" accept="image/*" className={fileInputClass} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Eyebrow</label>
              <input name="eyebrow" className="field-input" placeholder="New collection" />
            </div>
            <div>
              <label className="field-label">Title</label>
              <input name="title" className="field-input" placeholder="Festive Edit" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Link</label>
              <input name="cta_href" className="field-input" placeholder="/products" />
            </div>
            <div>
              <label className="field-label">Display order</label>
              <input name="sort_order" type="number" defaultValue={promos.length + 1} className="field-input" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <ActiveToggle defaultChecked={true} />
            <button type="submit" className="btn-primary">
              Add promo
            </button>
          </div>
        </form>
      </section>

      {/* ---------- Image gallery ---------- */}
      <section className="space-y-4">
        <div>
          <h2 className="font-serif text-lg text-ink">Image gallery</h2>
          <p className="mt-1 text-sm text-muted">
            The five-tile collage on the homepage. Upload a new photo to replace
            any tile — the layout stays the same.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_SLOTS.map((slot) => {
            const row = gallery.find((g) => g.sort_order === slot.pos) ?? null;
            const previewUrl = row?.image_url ?? slot.def;
            return (
              <form
                key={slot.pos}
                action={updateGallery}
                className="card space-y-3 p-5"
              >
                <input type="hidden" name="id" value={row?.id ?? ""} />
                <input type="hidden" name="sort_order" value={slot.pos} />
                <input
                  type="hidden"
                  name="existing_image_url"
                  value={row?.image_url ?? ""}
                />
                <input
                  type="hidden"
                  name="existing_image_path"
                  value={row?.image_path ?? ""}
                />

                <p className="text-sm font-medium text-ink">{slot.label}</p>
                <Preview url={previewUrl} alt={slot.label} />
                <input name="image" type="file" accept="image/*" className={fileInputClass} />
                <div className="flex items-center justify-between pt-1">
                  <ActiveToggle defaultChecked={row?.is_active ?? true} />
                  <button type="submit" className="btn-primary">
                    Save
                  </button>
                </div>
              </form>
            );
          })}
        </div>
      </section>
    </div>
  );
}
