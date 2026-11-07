import PageHeader from "@/components/admin/PageHeader";
import GalleryManager from "@/components/admin/GalleryManager";
import { getGallery } from "@/lib/gallery";

export const metadata = { title: "Gallery" };

export default async function GalleryAdminPage() {
  const items = await getGallery();
  return (
    <>
      <PageHeader
        title="Gallery"
        description="Upload trip photos, write captions in English and Afaan Oromoo, and choose what appears on the website."
      />
      <GalleryManager items={items} />
    </>
  );
}
