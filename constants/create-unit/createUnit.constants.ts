import { TabNumber } from "@custom-types/tabs.types";
import { MANUFACTURERS } from "./manufacturers.constants";

const createUnitConsts = {
    pageTitle: "Створити оголошення",
    errorMessages: {
        empty: "Це поле обов’язкове",
        less10symbols: "У назві оголошення повинно бути не менше 10 символів",
        more100symbols: "У назві оголошення може бути не більше 100 символів",
        missingManufacturer:
            "На жаль, виробника ““ не знайдено в нашій базі. Щоб додати виробника - зв`яжіться із службою підтримки",
        more15symbols: "У назві моделі може бути не більше 15 символів",
        missingLocation: "Виберіть коректне місце на мапі України",
        missingService:
            "На жаль, послугу ““ не знайдено в нашій базі. Ви можете додати послугу в категорію “Користувацькі”:",
        invalidPhoneNumber: "Некоректний номер телефону",
    },
    forbiddenSymbols: "<>{};^",
    tabs: {
        "1": {
            title: "Основна інформація",
            category: {
                label: "Категорія",
                placeholder: "Виберіть категорію",
                popupTitle: "Вибір категорії технічного засобу",
                mobilePopupTitle: "Вибір категорії",
            },
            ad: {
                label: "Назва оголошення",
                placeholder: "Введіть назву оголошення",
            },
            manufacturer: {
                label: "Виробник транспортного засобу",
                placeholder: "Введіть виробника транспортного засобу",
            },
            model: {
                label: "Назва моделі",
                placeholder: "Введіть назву моделі",
            },
            specifications: {
                label: "Технічні характеристики",
            },
            details: {
                label: "Детальний опис",
            },
            location: {
                label: "Місце розташування технічного засобу",
                placeholder: "Виберіть на мапі",
                buttonText: "Вибрати на мапі",
                modal: {
                    title: "Техніка на мапі",
                    cancel: "Скасувати",
                    accept: "Підтвердити вибір",
                },
            },
        },
        "2": {
            title: "Фотографії",
            photosForm: {
                label: "Фото технічного засобу",
                description:
                    "Додайте в оголошення від 1 до 12 фото технічного засобу розміром до 20 МВ у форматі .jpg, .jpeg, .png. Перше фото буде основним.",
            },
            errorModals: {
                sameImage: "Ви не можете завантажити двічі один файл.",
                invalidPhoto:
                    "Формат зображення не підтримується. Допустимі формати: .jpg, .jpeg, .png. Ви не можете завантажити файл більше 20 МВ.",
                buttonText: "Зрозуміло",
            },
        },
        "3": {
            title: "Послуги",
            description: "Знайдіть послуги, які надає Ваш технічний засіб",
            addInfo: "Додайте в оголошення принаймні 1 послугу",
            placeholder: "Наприклад: Рихлення грунту, буріння",
            addedServicesTitle: "Послуги, які надає технічний засіб:",
            addServiceButtonText: "Створити послугу",
        },
        "4": {
            title: "Вартість",
            paymentMethodLabel: "Спосіб оплати",
            paymentMethods: {
                cash: "Готівкою / на картку",
                cashlessWithoutVAT: "Безготівковий розрахунок (без ПДВ)",
                cashlessWithVAT: "Безготівковий розрахунок (з ПДВ)",
            },
            priceFieldLabel: "Вартість мінімального замовлення",
            priceFieldPlaceholder: "Наприклад, 1000",
            servicePriceLabel: "Вартість Ваших послуг",
            servicePriceDescription:
                "За бажанням Ви можете додати вартість конкретних послуг, які надає технічний засіб",
            addServicePrice: "Додати вартість",
            servicePriceTypes: {
                h: "Година",
                sh: "Зміна",
                t: "Тонна",
                ga: "Гектар",
                m2: "Метр кв.",
                m3: "Метр куб.",
                km: "Кілометр",
            },
            shifts: {
                eight: "8 год",
                four: "4 год",
            },
        },
        "5": {
            mainInfoLabel: "Основна інформація",
            title: "Контакти",
            photoLabel: "Ваше фото",
            choosePhotoLabel: "Вибрати фото",
            userTypeLabel: "Тип особи, до якої належите",
            userTypes: {
                fop: "ФОП",
                private: "Приватна особа",
                legal: "Юридична особа",
            },
            tinLabel: "РНОКПП (ІПН)",
            tinDescription:
                "Заповніть поле для підтвердження своєї особи та контактної інформації",
            tinInputErrorText: "Код ІПН не може бути коротше 10 символів",
            legalTypeLabel: "Тип юридичної особи",
            legalTypes: {
                tov: "ТОВ",
                vat: "ВАТ",
                zat: "ЗАТ",
            },
            legalNumberLabel: "ЄДРПОУ для юридичних осіб",
            legalNumberErrorText: "Код ЄДРПОУ не може бути коротше 8 символів",
            legalNameLabel: "Назва юридичної особи",
            lastNameLabel: "Прізвище",
            namesErrors: {
                lettersOnly: "має містити лише літери",
                less2: "має містити щонайменше 2 літери",
            },
            firstNameLabel: "Ім'я",
            patronymicLabel: "По-батькові",
            cityLabel: "Місто",
            yourContactsLabel: "Ваші контакти",
            userPhoneLabel: "Номер телефону",
            verifyNumberViaLabel: "Верифікувати номер телефону за допомогою",
            viberLabel: "Viber",
            viberInputPlaceholder: "+380 12 345 67 89",
            telegramLabel: "Telegram",
            emailLabel: "Email",
            contactsOfOperatorLabel: "Контакти оператора",
            iAmTheOperator: "Я оператор технічного засобу",
            operatorFirstNameLabel: "Ім’я",
            operatorPhoneLabel: "Телефон",
            operatorNameErrors: {
                less2: "має містити щонайменше дві літери",
                more25: "Введіть не більше 25 символів",
            },
            operatorPhoneErrorText:
                "Введіть коректний мобільний номер телефону",
        },
    },
    buttons: {
        cancel: "Скасувати",
        back: "Назад",
        review: "Переглянути оголошення",
        next: "Далі",
    },
} as const;

const FORBIDDEN_SYMBOLS = createUnitConsts.forbiddenSymbols;

const TAB_NUMBERS = Object.keys(createUnitConsts.tabs) as TabNumber[];

const TAB_TITLES = Object.values(createUnitConsts.tabs).map((tab) => tab.title);

const FIELDS_ERRORS = {
    EMPTY: createUnitConsts.errorMessages.empty,
    LESS_10_SYMBOLS: createUnitConsts.errorMessages.less10symbols,
    MORE_100_SYMBOLS: createUnitConsts.errorMessages.more100symbols,
    MISSING_MANUFACTURER: createUnitConsts.errorMessages.missingManufacturer,
    MORE_15_SYMBOLS: createUnitConsts.errorMessages.more15symbols,
    MISSING_LOCATION: createUnitConsts.errorMessages.missingLocation,
    MISSING_SERVICE: createUnitConsts.errorMessages.missingService,
    INVALID_PHONE_NUMBER: createUnitConsts.errorMessages.invalidPhoneNumber,
} as const;

const BUTTONS = {
    CANCEL: createUnitConsts.buttons.cancel,
    BACK: createUnitConsts.buttons.back,
    NEXT: createUnitConsts.buttons.next,
} as const;

export {
    createUnitConsts,
    FORBIDDEN_SYMBOLS,
    TAB_NUMBERS,
    BUTTONS,
    TAB_TITLES,
    FIELDS_ERRORS,
    MANUFACTURERS,
};
