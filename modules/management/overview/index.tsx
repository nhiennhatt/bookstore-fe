"use client";
import Image from "next/image";

export function Overview() {
  return (
    <div>
      <div className="w-full bg-white rounded-2xl p-3 border border-neutral-200 flex flex-col justify-center items-center">
        <div className="max-w-xl aspect-video">
          <Image alt="" height={800} width={800} src="/cooming_soon.svg" className="w-full h-full object-contain object-center"/>
        </div>
        <h1 className="text-xl">Tính năng đang phát triển!</h1>
      </div>
    </div>
  );
}
