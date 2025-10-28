import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";

const Privacy = () => {
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
              <FaShieldAlt className="text-[#E3D095] text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">حریم خصوصی</h1>
          </div>
          <p className="text-gray-600">
            آخرین به‌روزرسانی: {new Date().toLocaleDateString("fa-IR")}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. تعهد ما به حریم خصوصی
              </h2>
              <p className="text-gray-700 mb-4">
                ما متعهد به حفظ حریم خصوصی شما هستیم. این سیاست حریم خصوصی توضیح
                می‌دهد که چگونه اطلاعات شخصی شما را جمع‌آوری، استفاده و محافظت
                می‌کنیم. استفاده از خدمات ما به معنای پذیرش این سیاست است.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. اطلاعاتی که جمع‌آوری می‌کنیم
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    اطلاعات شخصی:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>نام و نام خانوادگی</li>
                    <li>آدرس ایمیل</li>
                    <li>شماره تلفن</li>
                    <li>آدرس فیزیکی</li>
                    <li>کد ملی</li>
                    <li>نام شرکت (در صورت وجود)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    اطلاعات تراکنش:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>تاریخچه مزایده‌ها و مناقصه‌ها</li>
                    <li>پیشنهادات ارائه شده</li>
                    <li>تراکنش‌های مالی</li>
                    <li>اشتراک‌های خریداری شده</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    اطلاعات فنی:
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>آدرس IP</li>
                    <li>نوع مرورگر و سیستم عامل</li>
                    <li>کوکی‌ها و فایل‌های موقت</li>
                    <li>لاگ‌های سرور</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. نحوه استفاده از اطلاعات
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  ما از اطلاعات شما برای اهداف زیر استفاده می‌کنیم:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>ارائه خدمات مزایده و مناقصه</li>
                  <li>احراز هویت و امنیت حساب کاربری</li>
                  <li>ارتباط با شما در مورد خدمات</li>
                  <li>بهبود کیفیت خدمات</li>
                  <li>رعایت قوانین و مقررات</li>
                  <li>پیشگیری از تقلب و سوء استفاده</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. اشتراک‌گذاری اطلاعات
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  ما اطلاعات شخصی شما را با اشخاص ثالث به اشتراک نمی‌گذاریم، مگر
                  در موارد زیر:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>با رضایت صریح شما</li>
                  <li>برای ارائه خدمات مورد نیاز (مثل پردازش پرداخت)</li>
                  <li>برای رعایت قوانین و مقررات</li>
                  <li>برای محافظت از حقوق و امنیت خود و دیگران</li>
                  <li>در صورت ادغام یا فروش شرکت</li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    <strong>توجه:</strong> ما هرگز اطلاعات شخصی شما را برای
                    اهداف تبلیغاتی به اشخاص ثالث نمی‌فروشیم.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. امنیت اطلاعات
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  ما از روش‌های امنیتی پیشرفته برای محافظت از اطلاعات شما
                  استفاده می‌کنیم:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>رمزگذاری SSL/TLS برای انتقال داده‌ها</li>
                  <li>رمزگذاری اطلاعات حساس در پایگاه داده</li>
                  <li>کنترل دسترسی سختگیرانه</li>
                  <li>نظارت مداوم بر سیستم‌های امنیتی</li>
                  <li>پشتیبان‌گیری منظم و امن</li>
                  <li>آموزش کارکنان در زمینه امنیت</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. کوکی‌ها و فایل‌های موقت
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  ما از کوکی‌ها برای بهبود تجربه کاربری استفاده می‌کنیم:
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      کوکی‌های ضروری:
                    </h3>
                    <p className="text-gray-700">
                      برای عملکرد صحیح سایت و حفظ ورود کاربر
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      کوکی‌های تحلیلی:
                    </h3>
                    <p className="text-gray-700">
                      برای تحلیل استفاده از سایت و بهبود خدمات
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      کوکی‌های ترجیحات:
                    </h3>
                    <p className="text-gray-700">
                      برای حفظ تنظیمات و ترجیحات کاربر
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  شما می‌توانید کوکی‌ها را در تنظیمات مرورگر خود غیرفعال کنید،
                  اما این ممکن است بر عملکرد سایت تأثیر بگذارد.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. حقوق شما
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  شما دارای حقوق زیر در رابطه با اطلاعات شخصی خود هستید:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>دسترسی به اطلاعات شخصی خود</li>
                  <li>تصحیح اطلاعات نادرست</li>
                  <li>حذف اطلاعات شخصی (در موارد مجاز)</li>
                  <li>محدود کردن پردازش اطلاعات</li>
                  <li>انتقال اطلاعات به سرویس‌های دیگر</li>
                  <li>اعتراض به پردازش اطلاعات</li>
                </ul>
                <p className="text-gray-700">
                  برای اعمال این حقوق، لطفاً با ما تماس بگیرید.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. نگهداری اطلاعات
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  ما اطلاعات شخصی شما را تا زمانی که برای اهداف ذکر شده ضروری
                  است نگهداری می‌کنیم:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>اطلاعات حساب کاربری: تا زمان حذف حساب</li>
                  <li>اطلاعات تراکنش: 7 سال (طبق قوانین مالیاتی)</li>
                  <li>لاگ‌های سیستم: 1 سال</li>
                  <li>کوکی‌ها: طبق تنظیمات مرورگر</li>
                </ul>
                <p className="text-gray-700">
                  پس از انقضای این مدت‌ها، اطلاعات به صورت ایمن حذف می‌شوند.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. تغییرات سیاست حریم خصوصی
              </h2>
              <p className="text-gray-700 mb-4">
                ما ممکن است این سیاست حریم خصوصی را در آینده به‌روزرسانی کنیم.
                تغییرات از طریق اعلان در سایت یا ایمیل به اطلاع شما خواهد رسید.
                ادامه استفاده از خدمات پس از تغییرات، به معنای پذیرش سیاست جدید
                است.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. تماس با ما
              </h2>
              <p className="text-gray-700 mb-4">
                اگر سوالی در مورد این سیاست حریم خصوصی دارید یا می‌خواهید حقوق
                خود را اعمال کنید، لطفاً با ما تماس بگیرید:
              </p>
              <div className="space-y-2 text-gray-700">
                <p>ایمیل: privacy@auction-platform.ir</p>
                <p>تلفن: 021-12345678</p>
                <p>آدرس: تهران، خیابان ولیعصر</p>
                <p>ساعات کاری: شنبه تا چهارشنبه، 9 صبح تا 6 عصر</p>
              </div>
            </section>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                تعهد ما
              </h3>
              <p className="text-blue-800">
                ما متعهد به حفظ حریم خصوصی شما و ارائه خدمات امن و قابل اعتماد
                هستیم. اگر احساس می‌کنید که حریم خصوصی شما نقض شده است، لطفاً
                فوراً با ما تماس بگیرید.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
