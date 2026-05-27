import type { User } from "firebase/auth";

type AvatarProps = {
  user: User | null;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "size-9 text-sm",
  md: "size-11 text-base",
  lg: "size-20 text-2xl",
};

export function getUserLabel(user: User | null) {
  return user?.displayName?.trim() || user?.email || "Taski user";
}

function getInitials(user: User | null) {
  const label = user?.displayName?.trim() || user?.email?.split("@")[0] || "T";
  const words = label.split(/\s+/).filter(Boolean);
  return words.length > 1
    ? `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase()
    : label.slice(0, 2).toUpperCase();
}

export function Avatar({ user, size = "md" }: AvatarProps) {
  return (
    <div className="avatar placeholder">
      <div className={`${sizes[size]} rounded-full bg-primary text-primary-content`}>
        {user?.photoURL ? <img alt="" src={user.photoURL} /> : <span className="font-semibold">{getInitials(user)}</span>}
      </div>
    </div>
  );
}
