import { ScrollView, Text, TouchableOpacity } from "react-native";
import SweetSFSymbol from "sweet-sfsymbols";
import { lang } from "../../../../helpers";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

export const TermsOfUse = ({ theme }) => {
  const navigation = useNavigation();
  const isDark = (darkOp, lightp) => (theme === "dark" ? darkOp : lightp);
  return (
    <ScrollView>
      <TouchableOpacity
        className={
          "w-7 h-7 bg-transparent mt-10 ml-3 z-12 rounded-full flex items-center justify-center"
        }
      >
        <SweetSFSymbol
          name={"multiply.circle.fill"}
          size={32}
          colors={["transparent"]}
        />
      </TouchableOpacity>
      <Text
        className={
          "text-2xl p-4 pb-0 pt-0 text-left " +
          isDark(" text-white", " text-black")
        }
      >
        {lang === "ar" ? "شروط الاستخدام" : "Terms Of Use"}
      </Text>
      <Text
        className={
          "text-sm p-4 text-left " + isDark(" text-white", " text-black")
        }
      >
        {lang === "ar"
          ? `يرجى قراءة شروط الاستخدام هذه بعناية قبل استخدام هذا التطبيق.
تطبيق QuickCalc ("لدينا"، "نحن" أو "نا") هو تطبيق لأنظمة iOS وiPadOS وMacOS يجمع الأدوات البسيطة لحساباتك اليومية، ويمكنك أيضًا إنشاء أدواتك الخاصة.
بتثبيت التطبيق أو الوصول إليه أو استخدام خدماتنا أو ميزاتنا أو برنامجنا (معًا، "الخدمات" أو "الاستخدام")، فإنك توافق على شروط الخدمة الخاصة بنا ("الشروط"). أنت تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بالشروط التالية. إذا كنت لا توافق على الشروط، فأنت غير مصرح لك باستخدام خدماتنا.

1. أنت مسؤول عن المحتوى أو البيانات التي تقوم بخدمتها أو استخدامها أو تحريرها. أي استخدام للمواد غير المشروعة غير مسموح به في QuickCalc.

2. يُمنع تمامًا استخدام أي بيانات تم الحصول عليها من خدمات QuickCalc لمضايقة أو إساءة استخدام أو إيذاء شخص أو كيان آخر، أو محاولة القيام بذلك.

3. لا تسمح QuickCalc باستخدام خدماتها للحصول على أو مشاركة أي محتوى غير قانوني أو ضار أو مهدد أو مسيء أو مضايق أو متعسف أو تشهيري أو فاحش أو بذيء أو قاذف أو منتهك لخصوصية الآخرين أو مكره أو عنصري أو عرقي أو مرفوض بأي شكل آخر.

4. خدماتنا غير مخصصة للتوزيع أو الاستخدام في أي بلد حيث يمكن أن ينتهك هذا التوزيع أو الاستخدام القوانين المحلية أو يُخضعنا لأي تنظيمات في بلد آخر، ويقع على عاتق المستخدم مسؤولية التحقق من شرعية استخدامهم لـ QuickCalc.

5. لا تقدم QuickCalc أي ضمانات حول الخدمات أو الأدوات أو الميزات.

6. لا يجوز استخدام خدمات QuickCalc لأي أغراض تجارية أو إعلانية دون موافقتنا الخطية.

7. نحن غير مسؤولين عن أي مطالبات مالية إذا تأخرت في تقديم مطالباتك لأكثر من 6 أشهر من تاريخ انتهاء الاشتراك. الحد الأقصى للمبلغ الذي يمكن تعويضه هو 9.99 دولار أمريكي أو قيمة اشتراك شهر واحد (أيهما أقل).

8. تحتفظ QuickCalc بالحق، وفقًا لتقديرها الخاص، في تغيير أو تعديل أو إضافة أو إيقاف أي خدمة في أي وقت.

9. تحتفظ QuickCalc بالحق، وفقًا لتقديرها الخاص، في تغيير أو تعديل أو إضافة أو إزالة أجزاء من شروط الاستخدام هذه في أي وقت دون إشعار مسبق. تقع على عاتقك مسؤولية مراجعة شروط الاستخدام هذه بشكل دوري للتغييرات. يعني استمرار استخدامك للموقع بعد نشر التغييرات أنك تقبل وتوافق على هذه التغييرات.`
          : `PLEASE READ THESE TERMS OF USE CAREFULLY BEFORE USING THIS APP. 
QuickCalc ("our", "we" or "us") is an iOS, iPadOS, and MacOS app that gathers simple tools for your daily calculations, and you can also create your own tools. 
By installing, accessing, or using our app, services, features, or software (together, “Services” or "Use"), you agree to our Terms of Service ("Terms"). YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREED TO BE BOUND BY THE FOLLOWING TERMS. If you do not agree to the Terms, you are not authorized to use our Service.


1. You are responsible for the content or data that you serve, use, or edit. Any use of illicit materials is not allowed in QuickCalc. 

2. Using any data obtained from QuickCalc services to harass, abuse, or harm another person or entity, or attempting to do so, is strictly prohibited. 

3. QuickCalc does not allow its services to be used to obtain or share any content that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another’s privacy, hateful, or racially, ethnically, or otherwise objectionable. 

4. Our Services are not intended for distribution to or use in any country where such distribution or use would violate local law or would subject us to any regulations in another country, and the user carries the responsibility for checking the legitimacy of their use of QuickCalc. 

5. QuickCalc does not make any guarantees about the services, tools, or features. 

6. QuickCalc services must not be used for any commercial or advertising purposes without our written consent.

7. We are not responsible for any financial claims if you delay submitting your claims for more than 6 months from the end of subscription date. The maximum amount that can be compensated is $9.99 USD or the value of a one-month subscription (whichever is less).

8. QuickCalc reserves the right, at its sole discretion, to change, modify, add, or discontinue any service at any time. 

9. QuickCalc reserves the right, at its sole discretion, to change, modify, add, or remove portions of these Terms of Use at any time without prior notice. It is your responsibility to check these Terms of Use periodically for changes. Your continued use of the Site following the posting of changes will mean that you accept and agree to the changes.`}
      </Text>
    </ScrollView>
  );
};
