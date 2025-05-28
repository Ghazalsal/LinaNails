import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();
    return (_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: language === 'en' ? 'default' : 'outline', size: "sm", onClick: () => setLanguage('en'), className: "text-xs", children: "EN" }), _jsx(Button, { variant: language === 'ar' ? 'default' : 'outline', size: "sm", onClick: () => setLanguage('ar'), className: "text-xs", children: "\u0639\u0631\u0628\u064A" })] }));
};
export default LanguageSwitcher;
