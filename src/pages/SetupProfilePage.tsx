import { useEffect, useRef, useState, useTransition } from "react";
import { IconCalendar, IconCamera } from "../assets/icons";
import { useAuthStore } from "../store/useAuthStore";
import { apiClient } from "../config/apiClient";
import { userSchema } from "../schemas/user.schema";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileForm } from "../schemas/profile.schema";

type ProfileEditFormProps = {
  onDone: () => void;
};

export default function SetupProfilePage({ onDone }: ProfileEditFormProps) {
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

  //////////////////////// 4. UPLOAD PROFILE FORM ////////////////////////////////////////////////
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(profileSchema) });

  //สั่ง observe ค่า gender แบบ realtime เพื่อ re-render ปุ่ม
  const gender = useWatch({ control, name: "gender" });

  //สำหรับเอาไป map ทำ button
  const activityLevels = [
    { value: "sedentary", label: "Sedentary (Office job)" },
    { value: "lightly_active", label: "Lightly Active (1-2 days/week)" },
    { value: "moderately_active", label: "Moderate Active (3-5 days/week)" },
    { value: "very_active", label: "Very Active (6-7 days/week)" },
  ] as const;

  const activityLevel = useWatch({ control, name: "activityLevel" });

  //onSubmit
  const onSubmit = (data: ProfileForm) => {
    startTransition(async () => {
      try {
        const payload = { ...data, birthDate: new Date(data.birthDate) };
        const res = await apiClient.patch("/profile", payload);
        const updatedUser = userSchema.parse(res.data.user);
        setAuth(updatedUser);
        onDone(); //กลับ View mode หลัง save สำเร็จ
      } catch (err) {
        console.log("error:", err);
      }
    });
  };

  //////////////////////// 5. FOR EDIT PROFILE ////////////////////////////////////////////////
  // opulate form ด้วยค่าเดิมตอน mount
  useEffect(() => {
    if (user?.profile) {
      if (user.profile.gender)
        setValue("gender", user.profile.gender as "male" | "female");

      if (user.profile.birthDate)
        setValue(
          "birthDate",
          new Date(user.profile.birthDate).toISOString().split("T")[0],
        );

      if (user.profile.height) setValue("height", user.profile.height);

      if (user.profile.weight) setValue("weight", user.profile.weight);

      if (user.profile.activityLevel)
        setValue(
          "activityLevel",
          user.profile.activityLevel as
            | "sedentary"
            | "lightly_active"
            | "moderately_active"
            | "very_active",
        );
    }
  }, [user, setValue]);

  // [เพิ่ม 3] Cancel → reset แล้วกลับ View mode
  const handleCancel = () => {
    reset();
    onDone();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-black text-white font-sans flex flex-col p-6 relative gap-4">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lime-500/5 blur-[120px] rounded-full"></div>
      </div>
      {/* HEADER */}

      <div className="flex items-start justify-between">
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
      {/* PROFILE FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* GENDER */}
          <div className="col-span-2 grid gap-2 ">
            <label className="uppercase text-[10px] text-zinc-500 font-black tracking-[0.25em]">
              Biological Gender
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue("gender", "male")}
                className={`py-3  text-sm border font-bold rounded-2xl transition-all hover:cursor-pointer ${gender === "male" ? "border-lime-400 text-lime-400  bg-lime-400/5" : "border-zinc-700 text-zinc-400  bg-zinc-900/50"}`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setValue("gender", "female")}
                className={`py-3  text-sm border font-bold rounded-2xl transition-all hover:cursor-pointer ${gender === "female" ? "border-lime-400 text-lime-400  bg-lime-400/5" : "border-zinc-700 text-zinc-400  bg-zinc-900/50"}`}
              >
                Female
              </button>
              {errors.gender && (
                <p className="text-red-400 text-xs">{errors.gender.message}</p>
              )}
            </div>
          </div>
          {/* BIRTDATE */}
          <div className="col-span-2 flex flex-col gap-2">
            <label className="uppercase text-[10px] text-zinc-500 font-black tracking-[0.25em]">
              DATE OF BIRTH
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-lime-400 transition-colors">
                <IconCalendar />
              </div>
              <input
                type="date"
                {...register("birthDate")}
                max={new Date().toISOString().split("T")[0]}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all text-sm text-white"
              />
            </div>
            {errors.birthDate && (
              <p className="text-red-400 text-xs">{errors.birthDate.message}</p>
            )}
          </div>
          {/* HEIGHT */}
          <div className="flex flex-col gap-2">
            <label className="uppercase text-[10px] text-zinc-500 font-black tracking-[0.25em]">
              HEIGHT (cm)
            </label>
            <input
              type="number"
              placeholder="Enter your height (cm)"
              {...register("height", { valueAsNumber: true })}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all text-sm text-white placeholder:text-zinc-600"
            />{" "}
            {errors.height && (
              <p className="text-red-400 text-xs">{errors.height.message}</p>
            )}
          </div>
          {/* WEIGHT */}
          <div className="flex flex-col gap-2">
            <label className="uppercase text-[10px] text-zinc-500 font-black tracking-[0.25em]">
              WEIGHT (kg)
            </label>
            <input
              type="number"
              placeholder="Enter your weight (kg)"
              {...register("weight", { valueAsNumber: true })}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 px-4 focus:outline-none focus:border-lime-400/50 focus:ring-1 focus:ring-lime-400/20 transition-all text-sm text-white placeholder:text-zinc-600"
            />{" "}
            {errors.weight && (
              <p className="text-red-400 text-xs">{errors.weight.message}</p>
            )}
          </div>

          {/* ACTIVITY */}
          <div className="col-span-2 grid gap-2 ">
            <label className="uppercase text-[10px] text-zinc-500 font-black tracking-[0.25em]">
              ACTIVITY LEVEL
            </label>
            <div className="grid grid-cols-2 gap-3">
              {activityLevels.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setValue("activityLevel", item.value)}
                  className={`py-3 px-4 border font-bold rounded-2xl text-xs transition-all cursor-pointer text-left ${
                    activityLevel === item.value
                      ? "border-lime-400 text-lime-400 bg-lime-400/5"
                      : "border-zinc-700 text-zinc-400 bg-zinc-900/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {errors.activityLevel && (
              <p className="text-red-400 text-xs">
                {errors.activityLevel.message}
              </p>
            )}
          </div>

          {/* BUTTON SUBMIT */}
          <div className="col-span-2 grid grid-cols-2 gap-3 mt-3">
            <button
              type="button"
              onClick={handleCancel}
              className="py-4 border border-zinc-700 text-zinc-400 text-xs font-black uppercase tracking-widest rounded-2xl hover:border-red-400 hover:text-red-400 transition-all active:scale-[0.98] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="py-4 bg-lime-400 text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-white transition-all active:scale-[0.98] shadow-lg shadow-lime-500/20 cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Finish Setup"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
