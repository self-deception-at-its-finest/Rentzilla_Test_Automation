export type TabNumber = "1" | "2" | "3" | "4" | "5";

export type TabTitle =
    | "Основна інформація"
    | "Фотографії"
    | "Послуги"
    | "Вартість"
    | "Контакти";

/**
 * This type uses for test data.
 * -
 * The real type has to have more fields.
 */
export type TestAdData = {
    title: string;
    manufacturer: string;
    photo: string;
    service: string;
    price: string;
};

/**
 * For API using
 * -
 */
export type CreateUnitPayload = {
    name: string;
    model_name: string;
    type_of_work: string;
    phone: string;
    minimal_price: number;
    money_value: string;
    payment_method: string;
    manufacturer: number;
    owner: number;
    lat: number;
    lng: number;
    services: number[];
    time_of_work: string;
    category: number;
};
