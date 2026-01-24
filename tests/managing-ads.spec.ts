import { PhotosComponent } from "../components/create-unit/2/photos.component";
import { ContactsComponent } from "../components/create-unit/5/contacts.component";
import { expect, test } from "../fixtures/fixtures";

test.describe("Create and delete ads", () => {
    test("First test", async ({ createUnitPageWithAds, page }) => {
        const contactsComponent = new ContactsComponent(page);
        await expect(contactsComponent.isOperatorCheckbox).toBeChecked();
    });
});
