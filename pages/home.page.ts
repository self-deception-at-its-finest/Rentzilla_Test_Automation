import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './base.page';
import endpoints from '../constants/endpoints.constants.json';
import { FooterComponent } from "../components/home-page/footer.component";

export class HomePage extends BasePage {
    public servicesTitle : Locator;
    public servicesPopularni : Locator;
    public servicesSilskogospodarski : Locator;

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

    constructor(page: Page) {
        super(page);
        this.endpoint = endpoints.home;
        this.servicesTitle = page.getByTestId('services').getByTestId('title');
        this.servicesPopularni = page.getByTestId('services__populyarni');
        this.servicesSilskogospodarski = page.getByTestId('services__silskogospodarski');

        this.footer = new FooterComponent(page);
        
        this.page = page;
        this.servicesSection = page.locator('section[data-testid="services"]');
        this.serviceTabs = this.servicesSection.locator('.RentzilaProposes_service__oHepD');
        this.serviceItems = this.servicesSection.locator('.RentzilaProposes_proposes_item__sY_h2');
        this.logo = page.locator('[data-testid="logo"]').first();

        this.specialEquipmentSection = page.locator('section[data-testid="specialEquipment"]');
        this.specialEquipmentTitle = this.specialEquipmentSection.locator('[data-testid="title"]');
        this.specialEquipmentTabs = this.specialEquipmentSection.locator('.RentzilaProposes_service__oHepD');
        this.specialEquipmentItems = this.specialEquipmentSection.locator('.RentzilaProposes_proposes_item__sY_h2');
    }

    async open(): Promise<void> {
        await super.open(this.endpoint);
    }
}