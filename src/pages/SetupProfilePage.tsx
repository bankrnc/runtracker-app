import { useRef, useState, useTransition } from "react";
import { IconCamera } from "../assets/icons";
import { useAuthStore } from "../store/useAuthStore";
import { apiClient } from "../config/apiClient";
import { userSchema } from "../schemas/user.schema";

export default function SetupProfilePage() {
  //////////////////////// 1. CLICK TO SELECT IMAGE ////////////////////////////////////////////////
  // 1.1 fileInput คือตัวกลางที่เอาไป Ref ปุ่มหลอก
  const fileInput = useRef<HTMLInputElement>(null);

  // 1.2 เอา handleClickImage ไป blind ตัวที่เป็นปุ่มหลอก
  const handleClickImage = () => {
    fileInput.current?.click();
  };

  //////////////////////// 2. SHOW IMAGE IN CIRCLE ////////////////////////////////////////////////
  //2.1 สร้าง state เก็บไฟล์ที่เลือก
  const [image, setImage] = useState<File | null>(null);

  //2.2 ถ้า image มีค่า ให้แปลงเป็น URL ให้ <img src=""> อ่าน
  const imageSrc = image ? URL.createObjectURL(image) : null;

  //2.3 onChange ที่ input ตอนเปลี่ยนเลือกรูป ให้ไป setImage
  const onChangeImage = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    //(e.target.files) ==> ข้อมูลรูป => list ของไฟล์ที่เราเลือก
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  //////////////////////// 3. UPLOAD PICTURE INTO BACKEND ////////////////////////////////////////////////
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isPending, startTransition] = useTransition();

  const handleClickUpload = () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("profileImage", image);

    startTransition(async () => {
      try {
        const res = await apiClient.patch("/profile/upload", formData);

        const updatePictureUser = userSchema.parse(res.data.user);
        setAuth(updatePictureUser);
        setImage(null);
      } catch (err) {
        console.error(err);
      }
    });
  };

  //สำหรับเอา user name ไปโชว์
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans flex flex-col p-6 relative gap-4">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-500/5 blur-[120px] rounded-full"></div>
      </div>
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">
          Personal Details
        </h1>
        <p className="text-zinc-500 text-sm">
          We need these to calculate your{" "}
          <span className="text-lime-400">BMI, TDEE</span> and{" "}
          <span className="text-lime-400">Heart Rate Zones</span> accurately.
        </p>
      </div>
      {/* UPLOAD PROFILE PICTURE SECTION*/}
      <div className="flex flex-col gap-3 items-center">
        {/* ตัวแม่ที่เป็นขอบเขต (Group & Relative) */}
        <div
          className="relative group w-32 h-32 cursor-pointer"
          onClick={handleClickImage}
        >
          {/* 1. วงกลมชั้นนอก (Gradient Border) - สั่ง Scale ที่นี่ */}
          <div className="w-full h-full bg-linear-to-tr from-lime-400 to-emerald-500 rounded-full p-1 shadow-[0_0_40px_rgba(163,230,53,0.15)] transition-transform duration-500 group-hover:scale-110">
            <div className="w-full h-full bg-zinc-950 rounded-full flex items-center justify-center overflow-hidden border-4 border-zinc-950">
              {imageSrc ? (
                // รูปที่เพิ่งเลือกใหม่ (ยังไม่ upload)
                <img src={imageSrc} className="w-full h-full object-cover" />
              ) : user?.profile?.imageUrl ? (
                // รูปที่ upload แล้ว (จาก cloudinary)
                <img
                  src={user.profile.imageUrl}
                  className="w-full h-full object-cover"
                />
              ) : (
                // default ถ้าไม่มีรูปเลย
                <span className="text-4xl grayscale transition-all duration-500 group-hover:grayscale-0">
                  👤
                </span>
              )}
            </div>
          </div>

          {/* 3. ปุ่มกล้อง (Absolute เทียบกับตัวแม่ชั้นนอกสุด) */}
          <button className="absolute bottom-0 right-0 bg-lime-400 text-black p-2.5 rounded-full border-4 border-black hover:bg-white transition-all shadow-lg z-20 active:scale-90 cursor-pointer">
            <IconCamera />
          </button>
          <input
            type="file"
            ref={fileInput}
            className="hidden"
            onChange={onChangeImage}
          />
        </div>

        {image && (
          <div className="flex gap-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:cursor-pointer hover:bg-blue-400 transition-all"
              onClick={handleClickUpload}
              disabled={isPending}
            >
              {isPending ? (
                <span className="animate-spin">Uploading...</span>
              ) : (
                "Upload"
              )}
            </button>
            <button
              className="px-4 py-2 bg-red-500 rounded-lg text-sm hover:cursor-pointer hover:bg-red-400 transition-all"
              onClick={() => {
                setImage(null);
                if (fileInput.current) {
                  //clear fileInput เพื่อให้เลือกรูปเดิมได้
                  fileInput.current.value = "";
                }
              }}
            >
              Cancel
            </button>
          </div>
        )}
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em]">
          {user?.profile?.firstName} {user?.profile?.lastName}
        </p>
      </div>
    </div>
  );
}
