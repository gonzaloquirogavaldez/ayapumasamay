export interface WordPressPost {
	id: number;
	date: string;
	date_gmt: string;
	guid: { rendered: string };
	modified: string;
	modified_gmt: string;
	slug: string;
	status: string;
	type: string;
	link: string;
	title: { rendered: string };
	content: { rendered: string; protected: boolean };
	excerpt: { rendered: string; protected: boolean };
	author: number;
	featured_media: number;
	comment_status: string;
	ping_status: string;
	sticky: boolean;
	template: string;
	format: string;
	meta: any[];
	categories: number[];
	tags: number[];
	_links: any;
}

export interface MappedPost {
	slug: string;
	data: {
		title: string;
		description: string;
		lastUpdateDate: Date;
		pubDate: Date;
		category: string;
		cover?: string; // Opcional
		hidden: boolean;
		// otros campos si es necesario
	};
	render: () => Promise<{ Content: any }>; // Esto será simulado
}

const WORDPRESS_API_URL = 'https://orchid-antelope-566017.hostingersite.com/wp-json/wp/v2/posts';

export async function getPostsFromWordPress(): Promise<MappedPost[]> {
	try {
		const response = await fetch(WORDPRESS_API_URL);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const posts: WordPressPost[] = await response.json();

		return posts.map((post) => ({
			slug: `en/${post.slug}`, // Asumiendo inglés, agregar locale
			data: {
				title: post.title.rendered,
				description: post.excerpt.rendered.replace(/<[^>]*>/g, ''), // Strip HTML
				lastUpdateDate: new Date(post.date),
				pubDate: new Date(post.date),
				category: 'News', // Dummy
				hidden: false, // Asumir no hidden
			},
			render: async () => ({
				Content: () => post.content.rendered, // Simular render
			}),
		}));
	} catch (error) {
		console.error('Error fetching posts from WordPress:', error);
		return [];
	}
}
