const axios = require("axios")

const { OK } = require("../util/statusCodes")

async function RobloxService(fastify) {
	fastify.route({
		method: "POST",
		path: "/users",

		config: {
			auth: true,
			permissions: "roblox/users",
		},

		schema: {
			body: {
				type: "object",
				properties: {
					userIds: { type: "array", items: { type: "integer" } },
					excludeBannedUsers: { type: "boolean", default: true },
				},
				required: [
					"userIds",
				],
			},

			response: {
				[OK]: {
					type: "object",
					properties: {
						data: {
							type: "array",
							items: {
								type: "object",
								properties: {
									id: { type: "integer" },
									name: { type: "string" },
									displayName: { type: "string" },
									description: { type: "string" },
									created: { type: "string", format: "datetime" },
									externalAppDisplayName: { type: "string" },
									isBanned: { type: "boolean" },
								},
							},
						},
					},
				},
			},
		},

		async handler(request) {
			const response = await axios.post("https://users.roblox.com/v1/users", request.body)
			return response.data
		},
	})

	fastify.route({
		method: "POST",
		path: "/usernames",

		config: {
			auth: true,
			permissions: "roblox/usernames",
		},

		schema: {
			body: {
				type: "object",
				properties: {
					usernames: { type: "array", items: { type: "string" } },
					excludeBannedUsers: { type: "boolean", default: true },
				},
				required: [
					"usernames",
				],
			},

			response: {
				[OK]: {
					type: "object",
					properties: {
						data: {
							type: "array",
							items: {
								type: "object",
								properties: {
									requestedUsername: { type: "string" },
									id: { type: "integer" },
									name: { type: "string" },
									displayName: { type: "string" },
								},
							},
						},
					},
				},
			},
		},

		async handler(request) {
			const response = await axios.post("https://users.roblox.com/v1/usernames/users", request.body)
			return response.data
		},
	})

	fastify.route({
		method: "POST",
		path: "/thumbnails",

		config: {
			auth: true,
			permissions: "roblox/thumbnails",
		},

		schema: {
			body: {
				type: "array",
				items: {
					type: "object",
					properties: {
						requestId: { type: "string" },
						targetId: { type: "integer" },
						token: { type: "string" },
						alias: { type: "string" },
						type: {
							type: "string",
							enum: [
								"Avatar",
								"AvatarHeadShot",
								"GameIcon",
								"BadgeIcon",
								"GameThumbnail",
								"GamePass",
								"Asset",
								"BundleThumbnail",
								"Outfit",
								"GroupIcon",
								"DeveloperProduct",
								"AvatarBust",
								"AutoGeneratedAsset",
								"PlaceIcon",
							],
						},
						size: { type: "string" },
						isCircular: { type: "boolean", default: false },
					},
					required: [
						"targetId",
						"type",
						"size",
					],
				},
			},

			response: {
				[OK]: {
					type: "object",
					properties: {
						data: {
							type: "array",
							items: {
								type: "object",
								properties: {
									requestId: { type: "string" },
									errorCode: { type: "integer" },
									errorMessage: { type: "string" },
									targetId: { type: "integer" },
									state: {
										type: "string",
										enum: [
											"Error",
											"Completed",
											"InReview",
											"Pending",
											"Blocked",
										],
									},
									imageUrl: { type: "string" },
								},
							},
						},
					},
				},
			},
		},

		async handler(request) {
			const response = await axios.post("https://thumbnails.roblox.com/v1/batch", request.body)
			return response.data
		},
	})
}

RobloxService.autoPrefix = "/roblox"

module.exports = RobloxService