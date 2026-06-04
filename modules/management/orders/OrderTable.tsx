import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, OrderStatus } from "@/lib/interfaces/order";
import { formatPrice } from "@/lib/utils";
import { parseAddressToString } from "@/lib/utils/parseAddressToString";
import {
  commitOrderToDone,
  commitOrderToPrepared,
  commitOrderToShipping,
  getAllOrders,
  GetAllOrdersQuery,
} from "@/services/orders";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

type OrderTableProps = {
  status: OrderStatus;
};

const PAGE_SIZE = 10;

export function OrderTable({ status }: OrderTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    Pick<
      GetAllOrdersQuery,
      "deliveryCode" | "paymentCode" | "wardCode" | "districtId" | "provinceId"
    >
  >({});

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const response = await getAllOrders({
        status,
        limit: PAGE_SIZE,
        ...filter,
      });
      setLoading(false);
      if (response.error || !response.data) {
        setHasMore(false);
        return;
      }
      setOrders(response.data);
      setHasMore(response.data.length === PAGE_SIZE);
      setCursor(
        response.data.length > 0
          ? response.data[response.data.length - 1].id
          : null,
      );
    };
    fetchOrders();
  }, []);

  const handleLoadMore = async () => {
    if (loading || !hasMore || !cursor) return;
    setLoading(true);
    const response = await getAllOrders({
      status,
      cursor,
      limit: PAGE_SIZE,
      ...filter,
    });
    setLoading(false);
    if (response.error || !response.data) {
      setHasMore(false);
      return;
    }
    setOrders([...orders, ...response.data]);
    setHasMore(response.data.length === PAGE_SIZE);
    setCursor(
      response.data.length > 0
        ? response.data[response.data.length - 1].id
        : null,
    );
  };

  const removeItem = (id: string) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  const submitStatusToDone = (id: string) => {
    commitOrderToDone(id).then((res) => {
      if (res.error) return;
      removeItem(id);
      toast.info('Đã chuyển trạng thái đơn hàng thành "Đã đóng đã hoàn thành"');
    });
  };

  const submitStatusToPrepared = (id: string) => {
    commitOrderToPrepared(id).then((res) => {
      if (res.error) return;
      removeItem(id);
      toast.info('Đã chuyển trạng thái đơn hàng thành "Đã đóng gói xong"');
    });
  };

  const submitStatusToShipping = (id: string) => {
    commitOrderToShipping(id).then((res) => {
      if (res.error) return;
      removeItem(id);
      toast.info(
        'Đã chuyển trạng thái đơn hàng thành "Đã đóng đang vận chuyển"',
      );
    });
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Địa chỉ nhận</TableHead>
            <TableHead>Mã vận đơn</TableHead>
            <TableHead>Mã thanh toán</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Tác vụ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
              </TableCell>
              <TableCell>
                {order.address && parseAddressToString(order.address)}
              </TableCell>
              <TableCell>
                <span
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    navigator.clipboard.writeText(order.deliveryCode || "");
                    toast.success("Đã copy mã vận đơn");
                  }}
                >
                  {order.deliveryCode}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    navigator.clipboard.writeText(order.paymentCode || "");
                    toast.success("Đã copy mã thanh toán");
                  }}
                >
                  {order.paymentCode}
                </span>
              </TableCell>
              <TableCell>{formatPrice(order.grandTotal)}</TableCell>
              <TableCell>
                {order.status === OrderStatus.PREPARING && (
                  <Button
                    onClick={() => submitStatusToPrepared(order.id)}
                    className="bg-yellow-600 text-white"
                    size="sm"
                  >
                    Đã đóng gói
                  </Button>
                )}
                {order.status === OrderStatus.PREPARED && (
                  <Button
                    onClick={() => submitStatusToShipping(order.id)}
                    className="bg-blue-600 text-white"
                    size="sm"
                  >
                    Đã chuyển giao cho ĐVVC
                  </Button>
                )}
                {order.status === OrderStatus.SHIPPING && (
                  <Button
                    onClick={() => submitStatusToDone(order.id)}
                    className="bg-green-600 text-white"
                    size="sm"
                  >
                    Đã hoàn thành
                  </Button>
                )}
                {[OrderStatus.DONE, OrderStatus.CANCELLED].lastIndexOf(
                  order.status,
                ) < 0 && (
                  <Button variant="destructive" size="sm">
                    Hủy đơn
                  </Button>
                )}
                <Button variant="ghost" size="icon-sm" asChild>
                  <Link href={`/management/orders/${order.id}`}>
                    <Search />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {hasMore && (
            <TableRow>
              <TableCell colSpan={6}>
                <Button onClick={handleLoadMore} variant="outline">
                  Tải thêm
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
