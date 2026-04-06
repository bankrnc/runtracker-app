import { useState } from "react";
import ProfileViewPage from "./ProfileViewPage";
import SetupProfilePage from "./SetupProfilePage";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  return isEditing ? (
    // ส่ง onDone ลงไปให้ ProfileEditForm
    <SetupProfilePage onDone={() => setIsEditing(false)} />
  ) : (
    // ส่ง onEdit ลงไปให้ ProfileView
    <ProfileViewPage onEdit={() => setIsEditing(true)} />
  );
}
