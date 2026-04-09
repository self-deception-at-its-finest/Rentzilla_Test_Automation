import { APIRequestContext } from "@playwright/test";
import { ENDPOINTS } from "@constants/endpoints.constants";
import { CreateUnitPayload } from "@custom-types/tabs.types";

export class ApiHelper {
	constructor(private request: APIRequestContext) {
		this.request = request;
	}

	async createUnit(token: string, unit: CreateUnitPayload) {
		const response = await this.request.post(ENDPOINTS.API.UNITS, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: unit,
		});

		if (!response.ok()) {
			throw new Error(`Create unit failed: ${response.status()} ${await response.text()}`);
		}
		const responseData = await response.json();
		console.log(`Unit created: ${responseData.id}`);
		return responseData;
	}

	async deleteServiceByName(token: string, name: string): Promise<void> {
		const response = await this.request.get(ENDPOINTS.API.SERVICES, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const serviceList = await response.json();

		for (const service of serviceList) {
			if (service.name === name) {
				const response = await this.request.delete(`${ENDPOINTS.API.CRM_SERVICES}${service.id}/`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				if (response.ok()) {
					console.log(`Service "${name}" was deleted`);
					return;
				} else {
					throw new Error(`Service wasn’t deleted: ${response.status()} ${await response.text()}`);
				}
			}
		}

		console.log(`Service "${name}" was not found`);
	}

	async deleteUnitById(token: string, unitId: number): Promise<void> {
		try {
			await this.request.delete(`${ENDPOINTS.API.UNITS}${unitId}/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(`Unit "${unitId}" was deleted`);
		} catch (_) {
			console.log(`Unit with “${unitId}” was not found`);
		}
	}

	async declineUnitByName(token: string, unitName: string): Promise<void> {
		let response = await this.request.get(ENDPOINTS.API.CRM_UNITS, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			params: {
				search: unitName,
				status: "pending",
			},
		});

		const unit = await response.json();

		response = await this.request.patch(`${ENDPOINTS.API.CRM_UNIT_MODERATE(unit.results[0].id)}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
			data: {
				is_approved: false,
			},
		});

		if (response.ok()) {
			console.log(`Unit "${unitName}" was declined`);
			return;
		} else throw new Error(`Unit wasn’t declined: ${response.status()} ${await response.text()}`);
	}
}
