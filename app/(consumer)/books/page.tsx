import { permanentRedirect, RedirectType } from "next/navigation";

export default function BooksPage() {
    permanentRedirect("/search", RedirectType.replace);
}