import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './Base.page';
import endpoints from '../constants/endpoints.constants.json';
import { FooterComponent } from "../components/home-page/Footer.component";

export class HomePage extends BasePage {
    public servicesTitle: Locator;
    public servicesPopularni: Locator;
    public servicesSilskogospodarski: Locator;

    readonly footer: FooterComponent;

    readonly page: Page;
    readonly servicesSection: Locator;
    readonly serviceTabs: Locator;
    readonly serviceItems: Locator;
    readonly logo: Locator;

    readonly specialEquipmentSection: Locator;
    readonly specialEquipmentTitle: Locator;
    readonly specialEquipmentTabs: Locator;
    readonly specialEquipmentItems: Locator;

    readonly sidebarAdsCategory: Locator;
    readonly navAdsLink: Locator;

    constructor(page: Page) {
        super(page);
        this.endpoint = endpoints.home;
        this.servicesTitle = page.getByTestId('services').getByTestId('title');
        this.servicesPopularni = page.getByTestId('services__populyarni');
        this.servicesSilskogospodarski = page.getByTestId('services__silskogospodarski');

        this.footer = new FooterComponent(page);

        this.page = page;
        this.servicesSection = page.locator('section[data-testid="services"]');
        this.serviceTabs = this.servicesSection.getByTestId(/^services__/);
        this.serviceItems = this.servicesSection.getByTestId(/^service__/);
        this.logo = page.locator('[data-testid="logo"]').first();

        this.specialEquipmentSection = page.locator('section[data-testid="specialEquipment"]');
        this.specialEquipmentTitle = this.specialEquipmentSection.locator('[data-testid="title"]');
        this.specialEquipmentTabs = this.specialEquipmentSection.getByTestId(/^specialEquipment__/);
        this.specialEquipmentItems = this.specialEquipmentSection.getByTestId(/^category__/);

        this.sidebarAdsCategory = page.getByTestId('leftsideCategory').filter({ hasText: 'Оголошення' });
        this.navAdsLink = page.locator('a[href="/products/"]').first();
        
    }

    async open(): Promise<void> {
        await super.open(this.endpoint);
    }
}
