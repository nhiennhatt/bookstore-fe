import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreateAddressPayload,
  DistrictDto,
  ProvinceDto,
  UserAddress,
  WardDto,
} from "@/lib/interfaces/address";
import { getDistricts, getProvinces, getWards } from "@/services/addresses";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addAddress, updateAddress } from "@/services/me";

export function AddAddressModal({
  addAddress: addAddressCallback,
  editAddress: editAddressCallback,
  editingAddress,
  onClose: onCloseCallback,
  open,
  setOpen,
}: {
  addAddress: (address: UserAddress) => void;
  editAddress: (address: UserAddress) => void;
  editingAddress?: UserAddress;
  onClose: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [provinces, setProvinces] = useState<ProvinceDto[]>([]);
  const [districts, setDistricts] = useState<DistrictDto[]>([]);
  const [wards, setWards] = useState<WardDto[]>([]);
  const [formData, setFormData] = useState<CreateAddressPayload>(
    editingAddress ?? {
      name: "",
      phone: "",
      provinceId: 0,
      districtId: 0,
      wardCode: "",
      address: "",
    },
  );

  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await getProvinces();
      if (res.error) return;
      setProvinces(res.data ?? []);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.provinceId) {
        setDistricts([]);
        return;
      }
      const res = await getDistricts(formData.provinceId);
      if (res.error) return;
      setDistricts(res.data ?? []);
    };
    fetchDistricts();
  }, [formData.provinceId]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!formData.districtId) {
        setWards([]);
        return;
      }
      const res = await getWards(formData.districtId);
      if (res.error) return;
      setWards(res.data ?? []);
    };
    fetchWards();
  }, [formData.districtId]);

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        name: editingAddress.name,
        phone: editingAddress.phone,
        provinceId: editingAddress.provinceId,
        districtId: editingAddress.districtId,
        wardCode: editingAddress.wardCode,
        address: editingAddress.address,
      });
    } else {
      setFormData({
        name: "",
        phone: "",
        provinceId: 0,
        districtId: 0,
        wardCode: "",
        address: "",
      });
    }
  }, [editingAddress]);

  const handleSubmit = (e: React.ChangeEvent) => {
    e.preventDefault();
    (editingAddress
      ? updateAddress(editingAddress.id, formData)
      : addAddress(formData)
    )
      .then((result) => {
        if (result.error) return;
        const address = result.data;
        editingAddress
          ? editAddressCallback(address)
          : addAddressCallback(address);
        setFormData({
          name: "",
          phone: "",
          provinceId: 0,
          districtId: 0,
          wardCode: "",
          address: "",
        });
      })
      .finally(() => {
        setOpen(false);
      });
  };

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      onCloseCallback();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Id") ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={handleOnOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-xl border-electric-indigo text-electric-indigo font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 px-6 gap-2"
        >
          <Plus size={16} /> Thêm địa chỉ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] rounded-3xl bg-white p-0 overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-8 bg-vapor-white border-b border-border/30">
          <DialogTitle className="text-2xl font-bold tracking-tight text-deep-charcoal">
            {editingAddress ? "Cập nhật" : "Thêm"} địa chỉ giao hàng
          </DialogTitle>
          <DialogDescription className="text-cool-slate">
            Nhập thông tin chi tiết để chúng tôi có thể giao hàng đến bạn nhanh
            nhất.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[10px] font-bold uppercase tracking-widest text-cool-slate"
              >
                Họ và tên
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="VD: Nhật Hiền"
                value={formData.name}
                onChange={handleChange}
                required
                className="rounded-xl border-border/50 h-12 focus-visible:ring-electric-indigo"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-[10px] font-bold uppercase tracking-widest text-cool-slate"
              >
                Số điện thoại
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="VD: 090xxxxxxx"
                value={formData.phone}
                onChange={handleChange}
                required
                className="rounded-xl border-border/50 h-12 focus-visible:ring-electric-indigo"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="province"
                className="text-[10px] font-bold uppercase tracking-widest text-cool-slate"
              >
                Tỉnh / Thành phố
              </Label>
              <Select
                value={
                  formData.provinceId
                    ? formData.provinceId.toString()
                    : undefined
                }
                name="provinceId"
                onValueChange={(value: string) => {
                  setFormData((prev) => ({
                    ...prev,
                    provinceId: parseInt(value) || 0,
                    districtId: 0,
                    wardCode: "",
                  }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tỉnh / Thành phố" />
                </SelectTrigger>
                <SelectContent onChange={handleChange}>
                  <SelectGroup>
                    {provinces.map((province) => (
                      <SelectItem
                        key={province.id}
                        value={province.id.toString()}
                      >
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="district"
                className="text-[10px] font-bold uppercase tracking-widest text-cool-slate"
              >
                Quận / Huyện
              </Label>
              <Select
                value={
                  formData.districtId
                    ? formData.districtId.toString()
                    : undefined
                }
                name="districtId"
                onValueChange={(value: string) => {
                  setFormData((prev) => ({
                    ...prev,
                    districtId: parseInt(value) || 0,
                  }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Quận / Huyện" />
                </SelectTrigger>
                <SelectContent onChange={handleChange}>
                  <SelectGroup>
                    {districts.map((district) => (
                      <SelectItem
                        key={district.id}
                        value={district.id.toString()}
                      >
                        {district.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="ward"
                className="text-[10px] font-bold uppercase tracking-widest text-cool-slate"
              >
                Phường / Xã
              </Label>
              <Select
                value={formData.wardCode}
                name="wardId"
                onValueChange={(value: string) => {
                  setFormData((prev) => ({
                    ...prev,
                    wardCode: value,
                    ward: wards.find((ward) => ward.code === value)?.name || "",
                  }));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Phường / Xã" />
                </SelectTrigger>
                <SelectContent onChange={handleChange}>
                  <SelectGroup>
                    {wards.map((ward) => (
                      <SelectItem key={ward.code} value={ward.code}>
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="address"
              className="text-[10px] font-bold uppercase tracking-widest text-cool-slate"
            >
              Địa chỉ chi tiết (Số nhà, tên đường)
            </Label>
            <Input
              id="address"
              name="address"
              placeholder="VD: 123 Đường Lê Lợi"
              value={formData.address}
              onChange={handleChange}
              required
              className="rounded-xl border-border/50 h-12 focus-visible:ring-electric-indigo"
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onCloseCallback();
                setOpen(false);
              }}
              className="rounded-xl font-bold text-xs uppercase tracking-widest px-6"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-deep-charcoal text-white hover:bg-deep-charcoal/90 font-bold text-xs uppercase tracking-widest px-8"
            >
              {editingAddress ? "Cập nhật" : "Thêm"} địa chỉ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
