import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "movies": "Movies",
        "users": "Users",
        "wishlist": "Wishlist",
        "login": "Login",
        "register": "Register",
        "logout": "Logout"
      },
      "common": {
        "loading": "Loading...",
        "error": "Something went wrong",
        "viewDetails": "View Details",
        "addToWishlist": "Wishlist",
        "search": "Search movies...",
        "popularity": "Popularity",
        "rating": "Rating",
        "newest": "Newest",
        "sortBy": "Sort by",
        "all": "All",
        "prev": "Prev",
        "next": "Next",
        "page": "Page",
        "of": "of"
      },
      "home": {
        "featured": "FEATURED",
        "popularNow": "Popular Now",
        "topRated": "Top Rated",
        "nowPlaying": "Now Playing"
      },
      "movie": {
        "synopsis": "Synopsis",
        "status": "Status",
        "releaseDate": "Release Date",
        "budget": "Budget",
        "revenue": "Revenue",
        "topCast": "Top Cast",
        "moreLikeThis": "More Like This",
        "watchTrailer": "Watch Trailer",
        "addToList": "Add to List",
        "back": "Back",
        "trending": "Trending",
        "members": "Members",
        "runtime": "min",
        "trailerNotAvailable": "Trailer not available at the moment."
      },
      "users": {
        "featuredMembers": "Featured Members",
        "email": "Email",
        "verifiedAdmin": "Verified Administrator",
        "viewProfile": "View Full Profile",
        "userId": "User ID",
        "joined": "Joined",
        "security": "Security",
        "passwordSet": "Password set",
        "editProfile": "Edit Profile",
        "contactUser": "Contact User"
      },
      "auth": {
        "welcomeBack": "Welcome Back",
        "signInToManage": "Sign in to manage your favorites and elite features",
        "email": "Email Address",
        "password": "Password",
        "rememberMe": "Remember me",
        "forgotPassword": "Forgot password?",
        "signIn": "Sign In Now",
        "dontHaveAccount": "Don't have an account?",
        "joinElite": "Join the Elite",
        "createAccount": "Create Account",
        "joinCommunity": "Join our elite movie community today",
        "username": "Username",
        "confirmPassword": "Confirm Password",
        "register": "Register Now",
        "alreadyHaveAccount": "Already have an account?",
        "signInSmall": "Sign In",
        "successRegister": "Account created successfully! Redirecting to login...",
        "invalidAuth": "Invalid email or password",
        "emailRegistered": "Email already registered"
      },
      "wishlist": {
        "myLibrary": "My Library",
        "yourWishlist": "Your Wishlist",
        "curatedSelection": "A curated selection of your favorite cinematic masterpieces.",
        "backToHome": "Back to Home",
        "emptyList": "Your list is empty",
        "startExploring": "Start exploring and save the movies you want to watch later.",
        "exploreNow": "Explore Now"
      }
    }
  },
  ar: {
    translation: {
      "nav": {
        "home": "الرئيسية",
        "movies": "الأفلام",
        "users": "المستخدمين",
        "wishlist": "قائمة الأمنيات",
        "login": "تسجيل الدخول",
        "register": "إنشاء حساب",
        "logout": "تسجيل الخروج"
      },
      "common": {
        "loading": "جاري التحميل...",
        "error": "حدث خطأ ما",
        "viewDetails": "عرض التفاصيل",
        "addToWishlist": "قائمة الأمنيات",
        "search": "بحث عن أفلام...",
        "popularity": "الأكثر شهرة",
        "rating": "التقييم",
        "newest": "الأحدث",
        "sortBy": "ترتيب حسب",
        "all": "الكل",
        "prev": "السابق",
        "next": "التالي",
        "page": "صفحة",
        "of": "من"
      },
      "home": {
        "featured": "مميز",
        "popularNow": "شائع الآن",
        "topRated": "الأعلى تقييماً",
        "nowPlaying": "يعرض الآن"
      },
      "movie": {
        "synopsis": "نبذة عن الفيلم",
        "status": "الحالة",
        "releaseDate": "تاريخ الإصدار",
        "budget": "الميزانية",
        "revenue": "الإيرادات",
        "topCast": "طاقم العمل",
        "moreLikeThis": "أفلام مشابهة",
        "watchTrailer": "شاهد الإعلان",
        "addToList": "أضف للقائمة",
        "back": "رجوع",
        "trending": "رائج",
        "members": "أعضاء",
        "runtime": "دقيقة",
        "trailerNotAvailable": "الإعلان غير متوفر حالياً."
      },
      "users": {
        "featuredMembers": "الأعضاء المميزون",
        "email": "البريد الإلكتروني",
        "verifiedAdmin": "مدير معتمد",
        "viewProfile": "عرض الملف الشخصي",
        "userId": "معرف المستخدم",
        "joined": "انضم في",
        "security": "الأمان",
        "passwordSet": "تم تعيين كلمة المرور",
        "editProfile": "تعديل الملف الشخصي",
        "contactUser": "الاتصال بالمستخدم"
      },
      "auth": {
        "welcomeBack": "مرحباً بعودتك",
        "signInToManage": "سجل الدخول لإدارة مفضلاتك والميزات النخبوية",
        "email": "البريد الإلكتروني",
        "password": "كلمة المرور",
        "rememberMe": "تذكرني",
        "forgotPassword": "نسيت كلمة المرور؟",
        "signIn": "سجل الدخول الآن",
        "dontHaveAccount": "ليس لديك حساب؟",
        "joinElite": "انضم إلى النخبة",
        "createAccount": "إنشاء حساب",
        "joinCommunity": "انضم إلى مجتمعنا السينمائي اليوم",
        "username": "اسم المستخدم",
        "confirmPassword": "تأكيد كلمة المرور",
        "register": "سجل الآن",
        "alreadyHaveAccount": "لديك حساب بالفعل؟",
        "signInSmall": "تسجيل دخول",
        "successRegister": "تم إنشاء الحساب بنجاح! جاري التحويل لتسجيل الدخول...",
        "invalidAuth": "البريد الإلكتروني أو كلمة المرور غير صالحة",
        "emailRegistered": "البريد الإلكتروني مسجل بالفعل"
      },
      "wishlist": {
        "myLibrary": "مكتبتي",
        "yourWishlist": "قائمة أمنياتك",
        "curatedSelection": "مجموعة مختارة من روائعك السينمائية المفضلة.",
        "backToHome": "العودة للرئيسية",
        "emptyList": "قائمتك فارغة",
        "startExploring": "ابدأ في الاستكشاف واحفظ الأفلام التي تريد مشاهدتها لاحقاً.",
        "exploreNow": "استكشف الآن"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'htmlTag', 'cookie', 'path', 'subdomain'],
      caches: ['localStorage'],
    }
  });

// Set direction on init
const currentLanguage = i18n.language || 'en';
document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = currentLanguage;

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
