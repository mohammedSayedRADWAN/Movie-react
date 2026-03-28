import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
	http.get('https://api.escuelajs.co/api/v1/users', () => {
		return HttpResponse.json({
			id: 1,
			email: 'omar@yahoo.com',
			role: 'customer',
		});
	}),
];

export const server = setupServer(...handlers);
