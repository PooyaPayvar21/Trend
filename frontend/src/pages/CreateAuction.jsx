import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authAPI from "../api/auth";
import PersianDatePicker from "../components/PersianDatePicker";
import PersianTimePicker from "../components/PersianTimePicker";

import {
  FaArrowLeft,
  FaUpload,
  FaCalendar,
  FaMoneyBillWave,
} from "react-icons/fa";
import toast from "react-hot-toast";

const CreateAuction = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    starting_price: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    category: "",
    condition: "",
    location: "",
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in when component mounts
  useEffect(() => {
    if (!user) {
      navigate("/register", {
        state: {
          redirectTo: "/create-auction",
          message: "برای ایجاد مزایده ابتدا ثبت‌نام کنید",
        },
      });
    }
  }, [user, navigate]);

  const categories = [
    { value: "all", label: "مزایده همه" },
    { value: "light_vehicle", label: "مزایده خودرو سبک، سواری و وانت" },
    { value: "heavy_vehicle", label: "مزایده خودرو سنگین" },
    { value: "motorcycle_bicycle", label: "مزایده موتورسیکلت و دوچرخه" },
    { value: "vehicle_parts", label: "مزایده قطعات و لوازم جانبی خودرو" },
    { value: "sim_card_phone", label: "مزایده سیم کارت و خط تلفن ثابت" },
    {
      value: "residential_property",
      label: "مزایده فروش و اجاره اماکن مسکونی (ملک و ساختمان)",
    },
    {
      value: "commercial_property",
      label: "مزایده فروش و اجاره اماکن اداری-تجاری (بوفه، استخر و...)",
    },
    {
      value: "industrial_property",
      label: "مزایده فروش و اجاره اماکن تولیدی-صنعتی (کارگاه، کارخانه و...)",
    },
    {
      value: "land_garden_villa",
      label: "مزایده فروش و اجاره زمین، باغ، ویلا و مزرعه",
    },
    {
      value: "household_appliances",
      label: "مزایده لوازم خانگی، آشپزخانه و شخصی",
    },
    {
      value: "office_equipment",
      label: "مزایده ماشین‌ها و لوازم اداری و فروشگاهی",
    },
    { value: "scrap", label: "مزایده ضایعات" },
    {
      value: "computer_network",
      label: "مزایده کامپیوتر، سخت افزار و تجهیزات شبکه",
    },
    { value: "mobile_tablet", label: "مزایده موبایل و تبلت" },
    { value: "tools_construction", label: "مزایده ابزارآلات و مصالح ساختمانی" },
    {
      value: "safety_firefighting",
      label: "مزایده تجهیزات، سیستم‌های ایمنی و آتش ‌نشانی",
    },
    { value: "metal_industry", label: "مزایده صنایع فلزی، آهن‌آلات و تجهیزات" },
    {
      value: "mining_industry",
      label: "مزایده صنعت معدن، بهره‌برداری و ماشین آلات",
    },
    { value: "mineral_products", label: "مزایده فرآورده‌ها و مواد معدنی" },
    { value: "textile_industry", label: "مزایده صنعت نساجی و تجهیزات مرتبط" },
    { value: "clothing_accessories", label: "مزایده پوشاک، لباس و اکسسوری" },
    {
      value: "medical_health",
      label: "مزایده تجهیزات پزشکی، سلامت و آزمایشگاهی",
    },
    { value: "investment_franchise", label: "مزایده سرمایه‌گذاری و حق امتیاز" },
    { value: "printing_paper", label: "مزایده صنعت چاپ و کاغذ" },
    {
      value: "advertising_industry",
      label: "مزایده صنعت تبلیغات و فضای تبلیغاتی",
    },
    { value: "packaging_machinery", label: "مزایده ماشین‌آلات بسته‌بندی" },
    { value: "marine_equipment", label: "مزایده تجهیزات و ماشین آلات دریایی" },
    { value: "water_sewage", label: "مزایده آب و فاضلاب، سد، کانال و چاه" },
    { value: "pipes_fittings", label: "مزایده لوله و اتصالات، شیرآلات" },
    {
      value: "environment_waste",
      label: "مزایده محیط زیست، تصفیه، بازیافت و پسماند",
    },
    {
      value: "livestock_industry",
      label: "مزایده صنعت دامپروری، تجهیزات و ماشین‌آلات",
    },
    {
      value: "agriculture_industry",
      label: "مزایده صنعت کشاورزی، تجهیزات و ماشین‌آلات",
    },
    {
      value: "food_industry",
      label: "مزایده صنایع غذایی، مواد غذایی، تجهیزات و ماشین‌آلات",
    },
    { value: "electricity_industry", label: "مزایده تولید و توزیع صنعت برق" },
    {
      value: "electronic_electrical",
      label: "مزایده تجهیزات و لوازم الکترونیکی و الکتریکی",
    },
    { value: "telecommunications", label: "مزایده تجهیزات مخابرات" },
    {
      value: "recreational_cultural",
      label: "مزایده لوازم و تجهیزات تفریحی، فرهنگی، ورزشی",
    },
    {
      value: "chemical_industry",
      label: "مزایده صنایع شیمیایی، محصولات و مواد شیمیایی",
    },
    { value: "plastic_products", label: "مزایده پلاستیک و محصولات پلاستیکی" },
    {
      value: "oil_gas_petrochemical",
      label: "مزایده تجهیزات نفت، گاز و پتروشیمی",
    },
    {
      value: "industrial_machinery",
      label: "مزایده ماشین‌آلات و تجهیزات صنعتی",
    },
    { value: "wood_industry", label: "مزایده صنعت چوب و محصولات چوبی" },
    { value: "international", label: "مزایده بین المللی" },
    { value: "miscellaneous", label: "مزایده متفرقه" },
  ];

  const conditions = [
    { value: "new", label: "نو" },
    { value: "like_new", label: "مثل نو" },
    { value: "good", label: "خوب" },
    { value: "fair", label: "متوسط" },
    { value: "used", label: "کارکرده" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/register", {
        state: {
          redirectTo: "/create-auction",
          message: "برای ایجاد مزایده ابتدا ثبت‌نام کنید",
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.createAuction(formData);
      toast.success(response.message || "مزایده با موفقیت ایجاد شد");
      navigate("/auctions");
    } catch (error) {
      toast.error(
        error.detail || "خطا در ایجاد مزایده. لطفا دوباره تلاش کنید."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fa-IR").format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-[#E3D095] hover:text-[#E3D095]/70 transition-colors mb-4"
          >
            <FaArrowLeft className="ml-2" size={14} />
            بازگشت
          </button>
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-[#E3D095]/20 ml-4">
              <FaMoneyBillWave className="text-[#E3D095] text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              ایجاد مزایده جدید
            </h1>
          </div>
          <p className="text-gray-600">
            اطلاعات مزایده خود را وارد کنید تا آن را در پلتفرم قرار دهیم
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان مزایده *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                  placeholder="عنوان مزایده را وارد کنید"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دسته‌بندی *
                </label>
                <select
                  name="category"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                placeholder="توضیحات کامل کالا یا خدمت را وارد کنید"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Price and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت شروع (تومان) *
                </label>
                <input
                  type="number"
                  name="starting_price"
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                  placeholder="0"
                  value={formData.starting_price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وضعیت کالا
                </label>
                <select
                  name="condition"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="">انتخاب کنید</option>
                  {conditions.map((condition) => (
                    <option key={condition.value} value={condition.value}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                محل مزایده
              </label>
              <input
                type="text"
                name="location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                placeholder="محل برگزاری مزایده"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاریخ شروع *
                </label>
                <div className="flex gap-2">
                  <PersianDatePicker
                    value={formData.start_date}
                    onChange={(date) =>
                      setFormData((prev) => ({ ...prev, start_date: date }))
                    }
                    placeholder="انتخاب تاریخ شروع"
                    className="flex-1"
                  />
                  <PersianTimePicker
                    value={formData.start_time}
                    onChange={(time) =>
                      setFormData((prev) => ({ ...prev, start_time: time }))
                    }
                    placeholder="انتخاب زمان"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاریخ پایان *
                </label>
                <div className="flex gap-2">
                  <PersianDatePicker
                    value={formData.end_date}
                    onChange={(date) =>
                      setFormData((prev) => ({ ...prev, end_date: date }))
                    }
                    placeholder="انتخاب تاریخ پایان"
                    className="flex-1"
                  />
                  <PersianTimePicker
                    value={formData.end_time}
                    onChange={(time) =>
                      setFormData((prev) => ({ ...prev, end_time: time }))
                    }
                    placeholder="انتخاب زمان"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تصاویر (اختیاری)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#E3D095] transition-colors">
                <FaUpload className="mx-auto text-gray-400 text-3xl mb-4" />
                <input
                  type="file"
                  name="images"
                  multiple
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={handleChange}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-[#E3D095] hover:text-[#E3D095]/70 font-medium"
                >
                  انتخاب تصاویر
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  حداکثر 5 تصویر، هر کدام کمتر از 5MB
                </p>
              </div>
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.images.length} تصویر انتخاب شده
                  </p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 px-6 py-3 bg-[#E3D095] text-black rounded-md hover:bg-[#E3D095]/70 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black ml-2"></div>
                    در حال ایجاد...
                  </div>
                ) : (
                  "ایجاد مزایده"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;
