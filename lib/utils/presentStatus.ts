import { BookStatus } from "../interfaces/book";

export const presentStatus: (
  status: BookStatus,
  stock: number,
) => { label: string; color: string } = (status, stock) => {
  switch (status) {
    case BookStatus.ACTIVE:
      return stock > 0
        ? { label: "Đang bán", color: "green" }
        : { label: "Hết hàng", color: "red" };
    case BookStatus.INACTIVE:
      return { label: "Không hiển thị", color: "red" };
    case BookStatus.COMING_SOON:
      return { label: "Sắp có", color: "yellow" };
    case BookStatus.DISCONTINUED:
      return { label: "Ngừng phân phối", color: "gray" };
    default:
      return { label: status, color: "gray" };
  }
};
