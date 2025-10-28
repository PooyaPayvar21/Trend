import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaHandshake } from "react-icons/fa";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/register"
            className="inline-flex items-center text-[#E3D095] hover:text-[#E3D095]/70 transition-colors mb-4"
          >
            <FaArrowLeft className="ml-2" size={14} />
            بازگشت به ثبت‌نام
          </Link>
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-[#E3D095]/20 ml-4">
              <FaHandshake className="text-[#E3D095] text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">شرایط استفاده</h1>
          </div>
          <p className="text-gray-600">
            آخرین به‌روزرسانی: {new Date().toLocaleDateString("fa-IR")}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. پذیرش شرایط
              </h2>
              <p className="text-gray-700 mb-4">
                با استفاده از خدمات پلتفرم مزایده و مناقصه ما، شما موافقت
                می‌کنید که این شرایط استفاده را رعایت کنید. اگر با هر بخشی از
                این شرایط موافق نیستید، لطفاً از استفاده از خدمات ما خودداری
                کنید.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. تعاریف
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    پلتفرم:
                  </h3>
                  <p className="text-gray-700">
                    سایت و اپلیکیشن مزایده و مناقصه که توسط ما ارائه می‌شود.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    کاربر:
                  </h3>
                  <p className="text-gray-700">
                    هر شخصی که در پلتفرم ثبت‌نام کرده و از خدمات آن استفاده
                    می‌کند.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    مزایده:
                  </h3>
                  <p className="text-gray-700">
                    فرآیند فروش کالا یا خدمات از طریق پیشنهاد قیمت.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    مناقصه:
                  </h3>
                  <p className="text-gray-700">
                    فرآیند خرید کالا یا خدمات از طریق پیشنهاد قیمت.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. شرایط ثبت‌نام
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>شما باید حداقل 18 سال سن داشته باشید.</li>
                <li>اطلاعات ارائه شده باید دقیق و به‌روز باشد.</li>
                <li>شما مسئول حفظ امنیت حساب کاربری خود هستید.</li>
                <li>هر کاربر فقط می‌تواند یک حساب کاربری داشته باشد.</li>
                <li>استفاده از حساب کاربری دیگران ممنوع است.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. قوانین استفاده
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    ممنوعیت‌ها:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>ارائه اطلاعات نادرست یا گمراه‌کننده</li>
                    <li>تخلف از قوانین و مقررات جاری</li>
                    <li>آزار و اذیت سایر کاربران</li>
                    <li>استفاده از ربات یا نرم‌افزارهای خودکار</li>
                    <li>تلاش برای دسترسی غیرمجاز به سیستم</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    مسئولیت‌ها:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>رعایت قوانین و مقررات محلی و ملی</li>
                    <li>پرداخت به موقع تعهدات مالی</li>
                    <li>حفظ امنیت اطلاعات شخصی</li>
                    <li>گزارش تخلفات احتمالی</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. اشتراک و پرداخت
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  پلتفرم ما اشتراک‌های مختلفی ارائه می‌دهد که امکانات متفاوتی
                  دارند. هزینه اشتراک‌ها به صورت ماهانه محاسبه می‌شود.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>پرداخت‌ها غیرقابل بازگشت هستند، مگر در موارد خاص.</li>
                  <li>اشتراک‌ها به صورت خودکار تمدید می‌شوند.</li>
                  <li>شما می‌توانید اشتراک خود را در هر زمان لغو کنید.</li>
                  <li>در صورت عدم پرداخت، دسترسی شما محدود خواهد شد.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. مسئولیت‌های ما
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  ما متعهد به ارائه خدمات با کیفیت و امن هستیم، اما مسئولیت‌های
                  محدودی داریم:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>ما مسئول محتوای ارائه شده توسط کاربران نیستیم.</li>
                  <li>
                    ما تضمین نمی‌کنیم که خدمات همیشه بدون وقفه در دسترس باشند.
                  </li>
                  <li>
                    ما مسئول خسارات غیرمستقیم ناشی از استفاده از خدمات نیستیم.
                  </li>
                  <li>
                    ما حق تغییر یا توقف خدمات را در هر زمان محفوظ می‌داریم.
                  </li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. مالکیت معنوی
              </h2>
              <p className="text-gray-700 mb-4">
                تمام حقوق مالکیت معنوی مربوط به پلتفرم، از جمله نرم‌افزار،
                طراحی، محتوا و علائم تجاری، متعلق به ما است. استفاده غیرمجاز از
                این موارد ممنوع است.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. تغییرات شرایط
              </h2>
              <p className="text-gray-700 mb-4">
                ما حق تغییر این شرایط را در هر زمان محفوظ می‌داریم. تغییرات از
                طریق اعلان در پلتفرم یا ایمیل به اطلاع شما خواهد رسید. ادامه
                استفاده از خدمات پس از تغییرات، به معنای پذیرش شرایط جدید است.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. قانون حاکم
              </h2>
              <p className="text-gray-700 mb-4">
                این شرایط تابع قوانین جمهوری اسلامی ایران است. هرگونه اختلاف از
                طریق مذاکره و در صورت عدم توافق، از طریق مراجع قضایی صلاحیت‌دار
                حل و فصل خواهد شد.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. تماس با ما
              </h2>
              <p className="text-gray-700">
                اگر سوالی در مورد این شرایط دارید، لطفاً با ما تماس بگیرید:
              </p>
              <div className="mt-4 space-y-2 text-gray-700">
                <p>ایمیل: support@auction-platform.ir</p>
                <p>تلفن: 021-12345678</p>
                <p>آدرس: تهران، خیابان ولیعصر</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
