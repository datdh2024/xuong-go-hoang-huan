import { groq } from "next-sanity";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    companyName, tagline, taglineSub, phone, zaloNumber,
    email, address, workingHours,
    facebookUrl, "tiktokUrl": tiktokUrl
  }
`;

export const heroSlidesQuery = groq`
  *[_type == "heroSlide"] | order(order asc) {
    _id, headline, subheadline,
    ctaLabel, ctaLink, order,
    image { asset->{url, metadata} }
  }
`;

export const highlightsQuery = groq`
  *[_type == "highlight"] | order(order asc) {
    _id, icon, title, description, order
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && featured == true] | order(order asc, _createdAt desc) [0..5] {
    _id, title, slug, location, completedYear, description,
    category->{ name },
    thumbnail { asset->{url, metadata} }
  }
`;

export const allProjectsQuery = groq`
  *[_type == "project"] | order(order asc, _createdAt desc) {
    _id, title, slug, location, completedYear, description,
    category->{ name, slug },
    thumbnail { asset->{url, metadata} }
  }
`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, location, completedYear, description,
    category->{ name },
    thumbnail { asset->{url, metadata} },
    images[] { asset->{url, metadata} }
  }
`;

export const projectCategoriesQuery = groq`
  *[_type == "projectCategory"] | order(name asc) {
    _id, name, slug
  }
`;

export const featuredTemplatesQuery = groq`
  *[_type == "houseTemplate" && featured == true] | order(_createdAt desc) [0..5] {
    _id, name, description,
    specs { area, bays, columns },
    thumbnail { asset->{url, metadata} }
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    story, teamDescription,
    highlights[] { number, label },
    heroImage { asset->{url, metadata} },
    storyImage { asset->{url, metadata} }
  }
`;

export const faqItemsQuery = groq`
  *[_type == "faqItem"] | order(orderRank) {
    _id, question, answer
  }
`;
