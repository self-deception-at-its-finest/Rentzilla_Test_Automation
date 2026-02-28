import { Page } from "@playwright/test";
import { PhotosComponent } from "../../components/create-unit/2/Photos.component";

export async function fillTab2Flow(page: Page, photo: string) {
    await new PhotosComponent(page).uploadPhoto(photo);
}