import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import authAPI from "../api/auth";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone_number: "",
    address: "",
    company: "",
    national_id: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        company: user.company || "",
        national_id: user.national_id || "",
      });
    } else {
      const load = async () => {
        try {
          const data = await authAPI.getProfile();
          updateUser(data);
          setProfileData({
            username: data.username || "",
            email: data.email || "",
            phone_number: data.phone_number || "",
            address: data.address || "",
            company: data.company || "",
            national_id: data.national_id || "",
          });
        } catch (e) {
          toast.error("برای مشاهده پروفایل ابتدا وارد شوید");
        }
      };
      load();
    }
  }, [user, updateUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const updated = await authAPI.updateProfile(profileData);
      updateUser(updated);
      toast.success("اطلاعات پروفایل با موفقیت ذخیره شد");
    } catch (error) {
      toast.error(error.detail || "خطا در ذخیره اطلاعات");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChangeInput = (e) => {
    const { id, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [id]: value }));
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.current_password ||
      !passwordData.new_password ||
      !passwordData.confirm_password
    ) {
      toast.error("تمام فیلدهای رمز عبور را پر کنید");
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("رمزهای عبور مطابقت ندارند");
      return;
    }
    try {
      setIsLoading(true);
      const res = await authAPI.changePassword(
        passwordData.current_password,
        passwordData.new_password,
        passwordData.confirm_password
      );
      toast.success(res.message || "رمز عبور با موفقیت تغییر کرد");
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error) {
      toast.error(error.detail || "خطا در تغییر رمز عبور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  اطلاعات شخصی
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      نام کاربری
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ایمیل
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      شماره تماس
                    </label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={profileData.phone_number}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      آدرس
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700"
                    >
                      نام شرکت
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={profileData.company}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="national_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      کد ملی
                    </label>
                    <input
                      type="text"
                      id="national_id"
                      name="national_id"
                      value={profileData.national_id}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleSave}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  تغییر رمز عبور
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      رمز عبور فعلی
                    </label>
                    <input
                      type="password"
                      id="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChangeInput}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      رمز عبور جدید
                    </label>
                    <input
                      type="password"
                      id="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChangeInput}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      تکرار رمز عبور جدید
                    </label>
                    <input
                      type="password"
                      id="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChangeInput}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDarkMode
                        ? "text-black bg-[#E3D095] hover:bg-[#E3D095]/80 focus:ring-[#E3D095]"
                        : "text-white bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={isLoading}
                  >
                    {isLoading ? "در حال تغییر..." : "تغییر رمز عبور"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
