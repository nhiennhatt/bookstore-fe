"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoadingUser, useUser } from "@/hooks";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronRight,
  Edit2,
  Mail,
  MapPin,
  Package,
  Phone,
  Trash2,
  UserIcon,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { parseAddressToString } from "@/lib/utils/parseAddressToString";
import { UserAddress } from "@/lib/interfaces/address";
import { useEffect, useState } from "react";
import { getAddresses, updateMe } from "@/services/me";
import { AddAddressModal } from "./AddAdressModal";
import { UpdateUserPayload } from "@/lib/interfaces/user";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { RequestVerifyModal } from "./RequestVerifyModal";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { notFound } from "next/navigation";

export function Profile({ isAddress = false }: { isAddress?: boolean }) {
  const [user, setUser] = useUser();
  const [isLoading] = useLoadingUser();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [openAddAddressModal, setOpenAddAddressModal] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);

  const [firstName, setFirstName] = useState<string>(user?.firstName || "");
  const [lastName, setLastName] = useState<string>(user?.lastName || "");
  const [editingAddress, setEditingAddress] = useState<
    UserAddress | undefined
  >();

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      const res = await getAddresses();
      if (res.error) return;
      setAddresses(res.data ?? []);
    };
    fetchAddresses();
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return notFound();
  }

  const handleEditUserInfo = (userInform: UpdateUserPayload) => {
    updateMe(userInform).then((result) => {
      if (result.error) return;
      setUser({ ...user, ...userInform });
    });
  };

  return (
    <main className="grow py-20 px-4 md:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-deep-charcoal mb-4">
              Hồ sơ của tôi
            </h1>
            <p className="text-lg text-cool-slate leading-relaxed">
              Quản lý thông tin cá nhân và địa chỉ giao hàng của bạn.
            </p>
          </motion.div>
        </header>

        <Tabs
          defaultValue={isAddress ? "addresses" : "info"}
          className="space-y-8"
        >
          <TabsList
            variant="line"
            className="bg-vapor-white border border-border/75 p-1 rounded-xl w-full sm:w-auto overflow-x-auto justify-start sm:justify-center h-auto"
          >
            <TabsTrigger
              value="info"
              className="after:bg-electric-indigo px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-electric-indigo data-[state=active]:shadow-sm transition-all"
            >
              <UserIcon size={16} className="mr-2" />
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="after:bg-electric-indigo px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-electric-indigo data-[state=active]:shadow-sm transition-all"
            >
              <MapPin size={16} className="mr-2" />
              Địa chỉ của tôi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8"
            >
              <div className="md:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl border border-border/50 p-8 flex flex-col items-center text-center shadow-sm">
                  <div className="relative group mb-6">
                    <Image
                      src={user.avatar ?? "/avatar.webp"}
                      alt={user.username}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover border-4 border-vapor-white shadow-lg"
                    />
                    <button className="absolute bottom-0 right-0 p-2 bg-electric-indigo text-white rounded-full shadow-lg hover:bg-deep-charcoal transition-colors">
                      <Edit2 size={16} />
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-deep-charcoal mb-1">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-cool-slate text-sm font-medium mb-4">
                    @{user.username}
                  </p>
                  {user.verified && (
                    <Badge className="bg-green-50 text-green-600 border-green-200 hover:bg-green-50">
                      <CheckCircle2 size={12} className="mr-1" /> Đã xác minh
                    </Badge>
                  )}

                  {!user.verified && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          onClick={() => setOpenVerifyModal(true)}
                          className="bg-red-50 text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                        >
                          <XCircle size={12} className="mr-1" /> Chưa xác minh
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nhấn để xác minh tài khoản</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>

                <Separator className="bg-border/30 my-2" />
                <Link
                  href="/orders"
                  className="flex items-center justify-between group p-1"
                >
                  <div className="flex items-center gap-3 text-sm text-cool-slate">
                    <Package size={18} className="text-electric-indigo" />
                    <span className="font-bold text-deep-charcoal">
                      Đơn hàng của tôi
                    </span>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-cool-slate group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>

              <div className="md:col-span-8 bg-white rounded-3xl border border-border/50 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-deep-charcoal mb-8">
                  Chi tiết thông tin
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-cool-slate">
                      Họ
                    </label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nhập họ"
                      className="p-3 bg-vapor-white rounded-xl border border-border/30 font-medium text-deep-charcoal placeholder:text-cool-slate"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-cool-slate">
                      Tên
                    </label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Nhập tên"
                      className="p-3 bg-vapor-white rounded-xl border border-border/30 font-medium text-deep-charcoal placeholder:text-cool-slate"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-cool-slate flex items-center gap-2">
                      <Mail size={12} /> Email
                    </label>
                    <Input
                      readOnly
                      value={user.email ?? ""}
                      placeholder="email@example.com"
                      className="p-3 bg-vapor-white rounded-xl border border-border/30 font-medium text-deep-charcoal placeholder:text-cool-slate"
                    />
                  </div>
                </div>
                <div className="mt-12 flex justify-end">
                  <Button
                    onClick={() => handleEditUserInfo({ firstName, lastName })}
                    className="rounded-xl bg-deep-charcoal px-8 py-2 h-auto text-white font-bold uppercase tracking-widest text-xs gap-3"
                  >
                    <Edit2 size={16} /> Lưu thay đổi
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="addresses">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-deep-charcoal">
                  Danh sách địa chỉ
                </h3>
                <AddAddressModal
                  addAddress={(address) =>
                    setAddresses([...addresses, address])
                  }
                  editAddress={(address) => {
                    setAddresses([
                      ...addresses.map((a) =>
                        a.id === address.id ? address : a,
                      ),
                    ]);
                  }}
                  editingAddress={editingAddress}
                  onClose={() => {
                    setEditingAddress(undefined);
                  }}
                  open={openAddAddressModal}
                  setOpen={setOpenAddAddressModal}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`bg-white rounded-3xl border px-8 py-4 flex flex-col justify-between shadow-sm transition-all hover:shadow-md ${
                      address.default
                        ? "border-electric-indigo ring-1 ring-electric-indigo"
                        : "border-border/50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-deep-charcoal">
                            {address.name}
                          </h4>
                          {address.default && (
                            <Badge className="bg-electric-indigo text-white text-[10px] uppercase font-bold px-2 py-0.5 border-none">
                              Mặc định
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="p-2 text-cool-slate hover:text-electric-indigo transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2
                              onClick={() => {
                                setEditingAddress(address);
                                setOpenAddAddressModal(true);
                              }}
                              size={16}
                            />
                          </button>
                          <button
                            className="p-2 text-cool-slate hover:text-red-500 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3 text-sm text-cool-slate leading-relaxed">
                          <MapPin
                            size={16}
                            className="mt-1 shrink-0 text-electric-indigo"
                          />
                          <span>{parseAddressToString(address)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-cool-slate font-medium">
                          <Phone
                            size={16}
                            className="shrink-0 text-electric-indigo"
                          />
                          <span>{address.phone}</span>
                        </div>

                        {!address.default && (
                          <button className="text-[10px] font-bold uppercase tracking-widest text-electric-indigo hover:text-deep-charcoal transition-colors self-start mt-4">
                            Đặt làm mặc định
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      {user?.verified === false && (
        <RequestVerifyModal
          isOpen={openVerifyModal}
          setIsOpen={setOpenVerifyModal}
        />
      )}
    </main>
  );
}
