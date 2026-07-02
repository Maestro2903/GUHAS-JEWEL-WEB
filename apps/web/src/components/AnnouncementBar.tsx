import { getAnnouncement } from "@repo/supabase";

const DEFAULT_MESSAGE = "Book a private viewing at our Karur showroom.";

export default async function AnnouncementBar() {
  const banner = await getAnnouncement();
  // Explicitly switched off in the dashboard → hide the strip entirely.
  if (banner && !banner.is_active) return null;
  const message = banner?.title?.trim() || DEFAULT_MESSAGE;

  return (
    <div className="bg-burgundy text-white">
      <div className="container-x flex h-[42px] items-center justify-center text-center text-[12px] font-medium tracking-[0.04em]">
        <p>{message}</p>
      </div>
    </div>
  );
}
