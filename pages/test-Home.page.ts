import { expect, type Locator, type Page } from '@playwright/test';
import BasePage from './test-Base.page';
import endpoints from '../constants/endpoints.constants.json';


export class HomePage extends BasePage {
    public servicesTitle : Locator
    public servicesPopularni : Locator
    public servicesSilskogospodarski : Locator

    constructor(page: Page) {
        super(page)
        this.endpoint = endpoints.home
        this.servicesTitle = page.getByTestId('services').getByTestId('title')
        this.servicesPopularni = page.getByTestId('services__populyarni')
        this.servicesSilskogospodarski = page.getByTestId('services__silskogospodarski')
    }

    async open(): Promise<void> {
        await super.open(this.endpoint)
    }
}