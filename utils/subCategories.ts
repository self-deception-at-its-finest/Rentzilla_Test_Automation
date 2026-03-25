export function extractAllTitles(obj: any): string[] {
    let titles: string[] = [];

    if (obj.subcategories) {
        Object.values(obj.subcategories).forEach((sub: any) => {
            titles.push(sub.title);
            titles = titles.concat(extractAllTitles(sub));
        });
    }

    return titles;
}