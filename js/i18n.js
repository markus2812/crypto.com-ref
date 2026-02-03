// i18n.js - Internationalization module for CryptoRefund

const i18n = {
    currentLang: 'en',
    translations: {},

    // Initialize the i18n module
    async init() {
        // Check if user has a saved language preference
        const savedLang = localStorage.getItem('preferredLanguage');

        if (savedLang) {
            // User has previously selected a language
            this.currentLang = savedLang;
            await this.loadTranslations(this.currentLang);
            this.applyTranslations();
            this.updateLangSwitcher();
        } else {
            // First visit - show language modal
            await this.loadTranslations('en'); // Preload English
            await this.loadTranslations('ru'); // Preload Russian
            this.showLanguageModal();
        }
    },

    // Load translations for a specific language
    async loadTranslations(lang) {
        if (this.translations[lang]) {
            return this.translations[lang];
        }

        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang} translations`);
            this.translations[lang] = await response.json();
            return this.translations[lang];
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            return null;
        }
    },

    // Get a translation by key (supports nested keys like "nav.services")
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }

        return value;
    },

    // Set the current language
    async setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);

        if (!this.translations[lang]) {
            await this.loadTranslations(lang);
        }

        this.applyTranslations();
        this.updateLangSwitcher();
        this.updateDocumentLang();
        this.hideLanguageModal();
    },

    // Apply translations to all elements with data-i18n attributes
    applyTranslations() {
        // Translate text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation !== key) {
                el.textContent = translation;
            }
        });

        // Translate HTML content (for elements with nested HTML)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            const translation = this.t(key);
            if (translation !== key) {
                el.innerHTML = translation;
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation !== key) {
                el.placeholder = translation;
            }
        });

        // Translate titles
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            const translation = this.t(key);
            if (translation !== key) {
                el.title = translation;
            }
        });

        // Update meta tags
        this.updateMetaTags();
    },

    // Update document language attribute
    updateDocumentLang() {
        document.documentElement.lang = this.currentLang;
    },

    // Update meta tags for SEO
    updateMetaTags() {
        // Update page title
        const metaTitle = this.t('meta.title');
        if (metaTitle !== 'meta.title') {
            document.title = metaTitle;
        }

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            const desc = this.t('meta.description');
            if (desc !== 'meta.description') {
                metaDesc.content = desc;
            }
        }

        // Update OG tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            const title = this.t('meta.title');
            if (title !== 'meta.title') {
                ogTitle.content = title;
            }
        }

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            const desc = this.t('meta.description');
            if (desc !== 'meta.description') {
                ogDesc.content = desc;
            }
        }
    },

    // Update language switcher UI
    updateLangSwitcher() {
        // Desktop language switcher
        const enBtn = document.getElementById('langSwitchEn');
        const ruBtn = document.getElementById('langSwitchRu');

        if (enBtn && ruBtn) {
            enBtn.classList.toggle('active', this.currentLang === 'en');
            ruBtn.classList.toggle('active', this.currentLang === 'ru');
        }

        // Mobile language switcher
        const mobileEnBtn = document.getElementById('mobileLangEn');
        const mobileRuBtn = document.getElementById('mobileLangRu');

        if (mobileEnBtn && mobileRuBtn) {
            mobileEnBtn.classList.toggle('active', this.currentLang === 'en');
            mobileRuBtn.classList.toggle('active', this.currentLang === 'ru');
        }
    },

    // Show language selection modal
    showLanguageModal() {
        const modal = document.getElementById('langModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    // Hide language selection modal
    hideLanguageModal() {
        const modal = document.getElementById('langModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
};

// Initialize i18n when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    i18n.init();
});

// Export for use in other scripts
window.i18n = i18n;
