import { useState } from "react";
import ProfileViewPage from "./ProfileViewPage";
import SetupProfilePage from "./SetupProfilePage";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  return isEditing ? (
    <SetupProfilePage onDone={() => setIsEditing(false)} />
  ) : (
    <ProfileViewPage onEdit={() => setIsEditing(true)} />
  );
}
