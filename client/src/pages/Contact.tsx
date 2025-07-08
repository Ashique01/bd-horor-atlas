// src/pages/Contact.tsx
import React from "react";

const Contact: React.FC = () => {
  return (
    <main className="max-w-4xl mx-auto p-6 mt-24 text-gray-200">
      <h1 className="text-4xl font-extrabold text-purple-400 mb-6">যোগাযোগ</h1>

      <p className="mb-4 leading-relaxed text-lg">
        আপনার যদি কোনো প্রশ্ন, পরামর্শ অথবা গল্প জমা দেওয়ার ব্যাপারে সাহায্যের প্রয়োজন হয়, অনুগ্রহ করে নিচের ঠিকানায় ইমেইল করুন:
      </p>

      <p className="mb-6 text-lg font-semibold text-pink-400 break-all">
        ashiquemurad@gmail.com
      </p>

      <p className="mb-4 leading-relaxed text-lg">
        এছাড়াও, আমাদের ওয়েবসাইটের যেকোনো ভুল বা সমস্যা সম্পর্কে জানাতে এই ইমেইলে যোগাযোগ করতে পারেন।  
        আমরা দ্রুত আপনার মেসেজের উত্তর দেওয়ার চেষ্টা করব।
      </p>

      <p className="text-gray-500 italic">
        ধন্যবাদ, <br />
        ভূতের ঠিকানা টিম
      </p>
    </main>
  );
};

export default Contact;
