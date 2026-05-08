"use client";

import type { Dispatch, SetStateAction } from "react";

import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type BookVariant,
  BookVariantStatus,
} from "@/lib/interfaces/bookVariant";

export const STATUS_LABELS: Record<BookVariantStatus, string> = {
  [BookVariantStatus.ACTIVE]: "Đang bán",
  [BookVariantStatus.INACTIVE]: "Ngưng",
};

export const STATUS_OPTIONS = Object.values(BookVariantStatus) as BookVariantStatus[];

export type VariantFormState = {
  name: string;
  isbn: string;
  originPrice: string;
  salePrice: string;
  inventory: string;
  status: BookVariantStatus;
};

export function emptyVariantForm(): VariantFormState {
  return {
    name: "",
    isbn: "",
    originPrice: "",
    salePrice: "",
    inventory: "",
    status: BookVariantStatus.ACTIVE,
  };
}

export function variantFormFromBookVariant(v: BookVariant): VariantFormState {
  return {
    name: v.name,
    isbn: v.isbn,
    originPrice:
      v.originPrice !== undefined && v.originPrice !== null
        ? String(v.originPrice)
        : "",
    salePrice:
      v.salePrice !== undefined && v.salePrice !== null
        ? String(v.salePrice)
        : "",
    inventory:
      v.inventory !== undefined && v.inventory !== null
        ? String(v.inventory)
        : "",
    status: v.status,
  };
}

export function parseOptionalInt(raw: string): number | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function VariantFormFields({
  form,
  setForm,
  idPrefix,
  disabled,
}: {
  form: VariantFormState;
  setForm: Dispatch<SetStateAction<VariantFormState>>;
  idPrefix: string;
  disabled: boolean;
}) {
  return (
    <FieldGroup className="gap-4">
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-name`}>Tên phiên bản</FieldLabel>
        <Input
          id={`${idPrefix}-name`}
          value={form.name}
          disabled={disabled}
          onChange={(e) =>
            setForm((f) => ({ ...f, name: e.target.value }))
          }
          placeholder="VD: Bìa cứng"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-isbn`}>ISBN</FieldLabel>
        <Input
          id={`${idPrefix}-isbn`}
          value={form.isbn}
          disabled={disabled}
          onChange={(e) =>
            setForm((f) => ({ ...f, isbn: e.target.value }))
          }
          placeholder="Mã ISBN"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-origin`}>Giá gốc</FieldLabel>
          <Input
            id={`${idPrefix}-origin`}
            inputMode="numeric"
            value={form.originPrice}
            disabled={disabled}
            onChange={(e) =>
              setForm((f) => ({ ...f, originPrice: e.target.value }))
            }
            placeholder="VNĐ (tối thiểu 1 nếu nhập)"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor={`${idPrefix}-sale`}>Giá bán</FieldLabel>
          <Input
            id={`${idPrefix}-sale`}
            inputMode="numeric"
            value={form.salePrice}
            disabled={disabled}
            onChange={(e) =>
              setForm((f) => ({ ...f, salePrice: e.target.value }))
            }
            placeholder="VNĐ (tối thiểu 1 nếu nhập)"
          />
        </Field>
      </div>
      <Field>
        <FieldLabel htmlFor={`${idPrefix}-inventory`}>Tồn kho</FieldLabel>
        <Input
          id={`${idPrefix}-inventory`}
          inputMode="numeric"
          value={form.inventory}
          disabled={disabled}
          onChange={(e) =>
            setForm((f) => ({ ...f, inventory: e.target.value }))
          }
          placeholder="Số lượng"
        />
      </Field>
      <div className="grid gap-1.5">
        <Label htmlFor={`${idPrefix}-status`}>Trạng thái</Label>
        <Select
          value={form.status}
          onValueChange={(v) =>
            setForm((f) => ({ ...f, status: v as BookVariantStatus }))
          }
          disabled={disabled}
        >
          <SelectTrigger id={`${idPrefix}-status`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </FieldGroup>
  );
}
