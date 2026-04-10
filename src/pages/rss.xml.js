import { getPostsFromWordPress } from "@/lib/wordpress-helpers";
import rss from "@astrojs/rss";

export async function get() {
	const posts = await getPostsFromWordPress();
	return rss({
		title: "Astro Learner | Blog",
		description: "My journey learning Astro",
		site: "https://my-blog-site.netlify.app",
		items: posts.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			link: `/post/${post.slug.replace('en/', '')}/`,
		})),
		customData: "<language>en-us</language>",
	});
}
