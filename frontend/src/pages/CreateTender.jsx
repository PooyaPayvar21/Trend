import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import authAPI from "../api/auth";
import PersianDatePicker from "../components/PersianDatePicker";
import PersianTimePicker from "../components/PersianTimePicker";

import { FaArrowLeft, FaUpload, FaCalendar, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const CreateTender = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    category: "",
    requirements: "",
    location: "",
    documents: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is logged in when component mounts
  useEffect(() => {
    if (!user) {
      navigate("/register", {
        state: {
          redirectTo: "/create-tender",
          message: "برای ایجاد مناقصه ابتدا ثبت‌ نام کنید",
        },
      });
    }
  }, [user, navigate]);

  const categories = [
    { value: "all", label: "مناقصه همه" },
    { value: "civil_urban", label: "مناقصه خدمات عمرانی و شهرسازی" },
    { value: "road_railway", label: "مناقصه راه، راه‌ سازی، راه‌آهن" },
    {
      value: "human_resources",
      label: "مناقصه تامین نیروی انسانی و خدمات عمومی",
    },
    { value: "financial_legal", label: "مناقصه خدمات مالی، بیمه و حقوقی" },
    {
      value: "engineering_consulting",
      label: "مناقصه طراحی پروژه، مهندسی و مشاوره",
    },
    {
      value: "transport_postal",
      label: "مناقصه خدمات حمل و نقل، ایاب و ذهاب، خدمات پستی",
    },
    { value: "automotive_industry", label: "مناقصه صنعت خودرو و وسایل نقیله" },
    {
      value: "household_appliances",
      label: "مناقصه لوازم خانگی، آشپزخانه و شخصی",
    },
    {
      value: "office_services",
      label: "مناقصه خدمات و تجهیزات اداری و فروشگاهی",
    },
    {
      value: "tools_construction",
      label: "مناقصه ابزار آلات و مصالح ساختمانی",
    },
    {
      value: "safety_firefighting",
      label: "مناقصه خدمات سیستم‌های ایمنی و آتش‌‌نشانی",
    },
    {
      value: "steel_industry",
      label: "مناقصه صنایع فولاد، ریخته گری و مفتولی",
    },
    { value: "iron_metals", label: "مناقصه آهن‌آلات و فلزات" },
    {
      value: "mining_industry",
      label: "مناقصه صنایع معدن، تجهیزات و ماشین‌آلات",
    },
    { value: "mineral_products", label: "مناقصه فرآورده‌های معدنی" },
    {
      value: "textile_industry",
      label: "مناقصه صنایع نساجی، تجهیزات و ماشین‌آلات",
    },
    { value: "clothing_accessories", label: "مناقصه پوشاک، البسه و اکسسوری" },
    { value: "medical_equipment", label: "مناقصه تجهیزات پزشکی و آزمایشگاهی" },
    { value: "health_services", label: "مناقصه خدمات بهداشت، درمان و سلامت" },
    {
      value: "investment_projects",
      label: "مناقصه پروژه‌های سرمایه‌گذاری و مشارکت",
    },
    {
      value: "graphic_printing",
      label: "مناقصه خدمات طراحی گرافیکی، چاپ و کاغذ",
    },
    { value: "advertising_services", label: "مناقصه خدمات تبلیغات" },
    { value: "packaging_services", label: "مناقصه خدمات و تجهیزات بسته‌بندی" },
    { value: "marine_projects", label: "مناقصه خدمات و پروژه های دریایی" },
    { value: "water_sewage", label: "مناقصه آب و فاضلاب، آبیاری و آبرسانی" },
    { value: "pipes_fittings", label: "مناقصه لوله و اتصالات، شیرآلات" },
    {
      value: "environment_waste",
      label: "مناقصه محیط ‌زیست، تصفیه، بازیافت و پسماند",
    },
    {
      value: "livestock_industry",
      label: "مناقصه صنعت دامپروری، تجهیزات و ماشین‌آلات",
    },
    {
      value: "agriculture_industry",
      label: "مناقصه صنعت کشاورزی، تجهیزات و ماشین‌آلات",
    },
    { value: "food_industry", label: "مناقصه صنایع غذایی و مواد غذایی" },
    {
      value: "electricity_services",
      label: "مناقصه خدمات تولید و توزیع صنعت برق",
    },
    { value: "it_software", label: "مناقصه فناوری اطلاعات و خدمات نرم‌افزاری" },
    {
      value: "computer_network",
      label: "مناقصه خدمات کامپیوتری، شبکه و سخت ‌افزار",
    },
    { value: "mobile_tablet", label: "مناقصه موبایل و تبلت" },
    {
      value: "electrical_electronic",
      label: "مناقصه تجهیزات و خدمات الکتریکی و الکترونیکی",
    },
    { value: "telecommunications", label: "مناقصه خدمات و تجهیزات مخابرات" },
    {
      value: "recreational_cultural",
      label: "مناقصه خدمات تفریحی، فرهنگی و ورزشی",
    },
    {
      value: "stationery_educational",
      label: "مناقصه لوازم التحریر، اقلام آموزشی و کمک آموزشی",
    },
    {
      value: "chemical_industry",
      label: "مناقصه صنایع شیمیایی، تجهیزات و محصولات شیمیایی",
    },
    {
      value: "plastic_products",
      label: "مناقصه پلاستیک و فرآورده‌های پلاستیکی",
    },
    { value: "cleaning_hygiene", label: "مناقصه مواد شوینده و لوازم بهداشتی" },
    {
      value: "oil_gas_petrochemical",
      label: "مناقصه صنایع نفت، گاز و پتروشیمی",
    },
    {
      value: "industrial_machinery",
      label: "مناقصه ماشین‌آلات و تجهیزات صنعتی",
    },
    { value: "wood_industry", label: "مناقصه صنعت چوب و فرآورده های چوبی" },
    { value: "international", label: "مناقصه بین المللی" },
    { value: "miscellaneous", label: "مناقصه متفرقه" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/register", {
        state: {
          redirectTo: "/create-tender",
          message: "برای ایجاد مناقصه ابتدا ثبت‌نام کنید",
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.createTender(formData);
      toast.success(response.message || "مناقصه با موفقیت ایجاد شد");
      navigate("/trend");
    } catch (error) {
      toast.error(
        error.detail || "خطا در ایجاد مناقصه. لطفا دوباره تلاش کنید."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documents") {
      setFormData((prev) => ({
        ...prev,
        documents: Array.from(files),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
              <FaFileAlt className="text-[#E3D095] text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              ایجاد مناقصه جدید
            </h1>
          </div>
          <p className="text-gray-600">
            اطلاعات مناقصه خود را وارد کنید تا آن را در پلتفرم قرار دهیم
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان مناقصه *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                  placeholder="عنوان مناقصه را وارد کنید"
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
                placeholder="توضیحات کامل پروژه یا خدمت مورد نیاز را وارد کنید"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Budget and Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بودجه تخمینی (تومان)
                </label>
                <input
                  type="number"
                  name="budget"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                  placeholder="0"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  محل اجرا
                </label>
                <input
                  type="text"
                  name="location"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                  placeholder="محل اجرای پروژه"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شرایط و الزامات
              </label>
              <textarea
                name="requirements"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3D095] focus:border-transparent"
                placeholder="شرایط شرکت در مناقصه، مدارک مورد نیاز و الزامات فنی را وارد کنید"
                value={formData.requirements}
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

            {/* Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مدارک و مستندات (اختیاری)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#E3D095] transition-colors">
                <FaUpload className="mx-auto text-gray-400 text-3xl mb-4" />
                <input
                  type="file"
                  name="documents"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                  id="document-upload"
                  onChange={handleChange}
                />
                <label
                  htmlFor="document-upload"
                  className="cursor-pointer text-[#E3D095] hover:text-[#E3D095]/70 font-medium"
                >
                  انتخاب فایل‌ها
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  PDF، Word، تصاویر - حداکثر 10 فایل، هر کدام کمتر از 10MB
                </p>
              </div>
              {formData.documents.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.documents.length} فایل انتخاب شده
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
                  "ایجاد مناقصه"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTender;
