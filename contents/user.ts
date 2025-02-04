import { USER_TYPES, UserResponseData } from "@/model/user";

export const DEFAULT_USER: UserResponseData = {
  id: "081c83a5-8539-46bf-8386-8b8079f0ab3b",
  email: "alexjace151@gmail.com",
  phoneNumber: "",
  isVerified: true,
  isEmailVerified: true,
  isNumberVerified: false,
  createdAt: "2024-10-11T11:39:06.412Z",
  updatedAt: "2024-10-11T11:39:06.412Z",
  tempToken: null,
  profilePicture:
    "https://res.cloudinary.com/dw0mvf7os/raw/upload/v1728646745/cozzyconnect/IMG_20240827_183751_gzauwq.jpg",
  fullName: "Jace Alexander",
  address: "No 13, Ziks Avenue",
  userType: USER_TYPES.LANDLORD,
  userId: "5ae74e70-7271-4ad7-84f3-7e49f950a8c0",
};

export const DEFAULT_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaGFuIjoiMjMwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
