import { notFound } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import CollectionManager, { type LibraryImage } from "@/components/admin/CollectionManager";
import { BUILTIN_IMAGES } from "@/data/images";
import { COLLECTION_NAMES, SCHEMAS, type CollectionName } from "@/lib/collections";
import { getItems, hasContent } from "@/lib/content";
import { getGallery } from "@/lib/gallery";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ collection: string }> };

export async function generateMetadata({ params }: Params) {
  const { collection } = await params;
  return { title: SCHEMAS[collection as CollectionName]?.title ?? "Admin" };
}

export default async function CollectionPage({ params }: Params) {
  const { collection } = await params;
  if (!COLLECTION_NAMES.includes(collection as CollectionName)) notFound();
  const name = collection as CollectionName;
  const schema = SCHEMAS[name];

  const [items, custom, gallery] = await Promise.all([getItems(name), hasContent(name), getGallery()]);

  // Image library: built-in photos, gallery photos and any photo already used in this list
  const library: LibraryImage[] = [...BUILTIN_IMAGES];
  const add = (src: string, label: string) => {
    if (src && !library.some((l) => l.src === src)) library.push({ src, label });
  };
  if (schema.imageField) {
    for (const item of items) add(String(item[schema.imageField] ?? ""), "Photo in use");
  }
  for (const g of gallery) add(g.thumb, g.caption.en || "Gallery photo");

  return (
    <>
      <PageHeader title={schema.title} description={schema.description} />
      <CollectionManager schema={schema} initialItems={items} library={library} isCustom={custom} />
    </>
  );
}
