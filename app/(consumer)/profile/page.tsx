import { Profile } from "@/modules/consumer/Profile";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ isAddress?: boolean }>;
}) {
  const { isAddress } = await searchParams;
  return <Profile isAddress={isAddress} />;
}
