import "server-only";
import { galleryDefaults } from "@/data/galleryDefaults";
import { listGallery, mutateGallery, type GalleryItem } from "@/lib/store";

export const getGallery = () => listGallery(galleryDefaults);

export async function getVisibleGallery(): Promise<GalleryItem[]> {
  try {
    return (await getGallery()).filter((item) => item.visible);
  } catch (error) {
    console.error("[gallery] falling back to defaults", error);
    return galleryDefaults;
  }
}

export const changeGallery = (fn: Parameters<typeof mutateGallery>[1]) =>
  mutateGallery(galleryDefaults, fn);
